exports.isConflict = (roomId, start, end, bookings) => {
  return bookings.some(b => {
    return (
      b.roomId === roomId &&
      b.status === "CONFIRMED" &&
      start < new Date(b.endTime) &&
      end > new Date(b.startTime)
    );
  });
};
