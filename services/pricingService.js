const rooms = [
  { id: "101", baseHourlyRate: 200 },
  { id: "102", baseHourlyRate: 250 },
  { id: "103", baseHourlyRate: 300 }
];

function isPeakHour(hour) {
  return (
    (hour >= 10 && hour < 13) ||
    (hour >= 16 && hour < 19)
  );
}

exports.calculatePrice = (start, end, roomId) => {
  const room = rooms.find(r => r.id === roomId);
  let price = 0;

  let current = new Date(start);

  while (current < end) {
    let hour = current.getHours();
    let rate = room.baseHourlyRate;

    if (isPeakHour(hour)) {
      rate *= 1.5;
    }

    price += rate;

    current.setHours(current.getHours() + 1);
  }

  return price;
};
