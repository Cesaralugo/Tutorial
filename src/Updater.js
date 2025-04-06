const params = {
  TrackerName: 'trackerId',
  Updates: [
    {
      DeviceId: 'deviceId',
      Position: [-122.431297, 37.773972],
      SampleTime: new Date()
    }
  ]
};
const command = new BatchUpdateDevicePositionCommand(params);
client.send(command, (err, data) => {
  if (err) console.error(err);
  if (data) console.log(data);
});
