const spawnSync = require('child_process').spawnSync;

function parseAdbDevice(rawString) {
  if (rawString.startsWith('List of')) {
    return null;
  }
  if (rawString.startsWith('*')) {
    return null;
  }

  const [id, type, ...features] = rawString.split(/\s+/g);

  if (type !== 'device') {
    return null;
  }

  const device = { id, type };
  features.forEach((rawFeature) => {
    const [key, value] = rawFeature.split(':');
    device[key] = value;
  });
  return device;
}

function getConnectedDevices() {
  const adb = spawnSync('adb', ['devices', '-l']);
  const devices = adb.stdout.toString()
    .split('\n')
    .map(s => s.trim())
    .filter((row, index) => (row.length && index > 0))
    .map(parseAdbDevice)
    .filter(device => (device.type === 'device'));
  return devices;
}

module.exports = {
  parseAdbDevice,
  getConnectedDevices,
};
