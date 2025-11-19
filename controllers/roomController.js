const rooms = [
  { id: "101", name: "Meeting Room A", baseHourlyRate: 200, capacity: 4 },
  { id: "102", name: "Meeting Room B", baseHourlyRate: 250, capacity: 6 },
  { id: "103", name: "Conference Room", baseHourlyRate: 300, capacity: 10 },
];

exports.getRooms = (req, res) => {
  res.json(rooms);
};
