import { moveName } from './rules.js';

const LEVELS = {
  easy: { movetime: 120, multiPV: 3, pick: 2 },
  medium: { movetime: 350, multiPV: 2, pick: 0 },
  hard: { movetime: 1000, multiPV: 1, pick: 0 },
};

function parseScore(line) {
  const cp = line.match(/\bscore cp (-?\d+)/);
  if (cp) return Number(cp[1]);
  const mate = line.match(/\bscore mate (-?\d+)/);
  if (mate) return Math.sign(Number(mate[1])) * 100000;
  return null;
}

function parseInfo(line) {
  if (!line.startsWith('info ') || !line.includes(' pv ')) return null;
  const pvMatch = line.match(/\bpv (.+?)\s*$/);
  const depth = line.match(/\bdepth (\d+)/);
  const multiPV = line.match(/\bmultipv (\d+)/);
  const score = parseScore(line);
  if (!pvMatch || score == null) return null;
  const pv = pvMatch[1]
    .trim()
    .split(/\s+/)
    .filter((token) => /^[a-i][0-9][a-i][0-9]$/.test(token));
  if (!pv.length) return null;
  return {
    move: pv[0],
    pv,
    score,
    depth: depth ? Number(depth[1]) : 0,
    multiPV: multiPV ? Number(multiPV[1]) : 1,
  };
}

export function parseIccsMove(move) {
  if (!/^[a-i][0-9][a-i][0-9]$/.test(move || '')) return null;
  const file = (char) => char.charCodeAt(0) - 97;
  return {
    from: Number(move[1]) * 9 + file(move[0]),
    to: Number(move[3]) * 9 + file(move[2]),
  };
}

export class PikafishEngine {
  constructor(onStatus = () => {}) {
    this.onStatus = onStatus;
    this.worker = null;
    this.ready = false;
    this.waiters = [];
    this.searchChain = Promise.resolve();
  }

  async init() {
    if (this.ready) return true;
    if (this.initPromise) return this.initPromise;

    this.onStatus('loading');
    this.initPromise = new Promise((resolve, reject) => {
      this.worker = new Worker(new URL('./pikafish-worker.js', import.meta.url));
      const timeout = setTimeout(() => reject(new Error('Pikafish 載入逾時')), 20000);

      this.worker.onmessage = ({ data }) => {
        if (data.type === 'line') this.handleLine(data.line);
        if (data.type === 'error-line') console.warn('[Pikafish]', data.line);
        if (data.type === 'fatal') reject(new Error(data.message));
        if (data.type === 'loaded') {
          const uciReady = this.waitFor((line) => line === 'uciok', 10000);
          this.send('uci');
          uciReady
            .then(() => {
              this.send('setoption name Threads value 1');
              this.send('setoption name Hash value 16');
              const engineReady = this.waitFor((line) => line === 'readyok', 10000);
              this.send('isready');
              return engineReady;
            })
            .then(() => {
              clearTimeout(timeout);
              this.ready = true;
              this.onStatus('ready');
              resolve(true);
            })
            .catch(reject);
        }
      };

      this.worker.onerror = (event) => {
        clearTimeout(timeout);
        reject(new Error(event.message || 'Pikafish Worker 錯誤'));
      };
      this.worker.postMessage({ type: 'init' });
    }).catch((error) => {
      this.onStatus('fallback');
      globalThis.__pikafishError = error?.stack || error?.message || String(error);
      console.warn('Pikafish unavailable; using lightweight fallback.', error);
      throw error;
    });

    return this.initPromise;
  }

  send(command) {
    this.worker?.postMessage({ type: 'command', command });
  }

  handleLine(line) {
    const pending = this.waiters.slice();
    for (const waiter of pending) {
      if (waiter.test(line)) waiter.resolve(line);
    }
  }

  waitFor(test, timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
      const waiter = {
        test,
        resolve: (line) => {
          clearTimeout(timer);
          this.waiters = this.waiters.filter((item) => item !== waiter);
          resolve(line);
        },
      };
      const timer = setTimeout(() => {
        this.waiters = this.waiters.filter((item) => item !== waiter);
        reject(new Error('Pikafish 回應逾時'));
      }, timeoutMs);
      this.waiters.push(waiter);
    });
  }

  search(moves, { movetime = 350, multiPV = 1 } = {}) {
    const task = async () => {
      await this.init();
      const lines = new Map();
      this.send(`setoption name MultiPV value ${multiPV}`);
      this.send(moves.length ? `position startpos moves ${moves.join(' ')}` : 'position startpos');

      const result = await new Promise((resolve, reject) => {
        const waiter = {
          test: (line) => {
            const info = parseInfo(line);
            if (info) {
              const previous = lines.get(info.multiPV);
              if (!previous || info.depth >= previous.depth) lines.set(info.multiPV, info);
            }
            return line.startsWith('bestmove ');
          },
          resolve: (line) => {
            clearTimeout(timeout);
            this.waiters = this.waiters.filter((item) => item !== waiter);
            const bestmove = line.split(/\s+/)[1];
            resolve({
              bestmove,
              lines: [...lines.values()].sort((a, b) => a.multiPV - b.multiPV),
            });
          },
        };
        const timeout = setTimeout(() => {
          this.waiters = this.waiters.filter((item) => item !== waiter);
          this.send('stop');
          reject(new Error('Pikafish 搜尋逾時'));
        }, movetime + 5000);
        this.waiters.push(waiter);
        this.send(`go movetime ${movetime}`);
      });
      return result;
    };

    const result = this.searchChain.then(task, task);
    this.searchChain = result.catch(() => {});
    return result;
  }

  async chooseMove(history, level = 'medium') {
    const config = LEVELS[level] || LEVELS.medium;
    const moves = history.map((move) => moveName(move.from, move.to));
    const result = await this.search(moves, config);
    const candidate = result.lines[config.pick] || result.lines[0];
    return parseIccsMove(candidate?.move || result.bestmove);
  }

  async analyse(history, movetime = 450) {
    const moves = history.map((move) => moveName(move.from, move.to));
    const result = await this.search(moves, { movetime, multiPV: 1 });
    const principal = result.lines[0];
    return {
      best: parseIccsMove(principal?.move || result.bestmove),
      score: principal?.score ?? 0,
      depth: principal?.depth ?? 0,
      pv: principal?.pv || (result.bestmove ? [result.bestmove] : []),
    };
  }
}
