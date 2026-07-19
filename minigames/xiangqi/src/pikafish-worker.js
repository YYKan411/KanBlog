/* Pikafish runs away from the UI thread. */
importScripts('../vendor/pikafish/pikafish.js');

let engine = null;

self.onmessage = async ({ data }) => {
  if (data.type === 'init') {
    try {
      const engineBase = new URL('../vendor/pikafish/', self.location.href);
      engine = await Pikafish({
        locateFile: (name) => new URL(name, engineBase).href,
        mainScriptUrlOrBlob: new URL('pikafish.js', engineBase).href,
        onReceiveStdout: (line) => self.postMessage({ type: 'line', line }),
        onReceiveStderr: (line) => self.postMessage({ type: 'error-line', line }),
      });
      self.postMessage({ type: 'loaded' });
    } catch (error) {
      self.postMessage({ type: 'fatal', message: error?.message || String(error) });
    }
    return;
  }

  if (data.type === 'command' && engine?.sendCommand) {
    engine.sendCommand(data.command);
  }
};
