const seatCounts = [100, 12, 32, 18, 23];
const seatLayout = seatCounts.map((count) =>
  new Array(count).fill(0)
);
// console.log(seatLayout);

// const count = seatLayout.reduce(
//   (currentCount, row) => currentCount + row.length,
//   0
// );
const seats = [
  [1, 3],
  [3, 2],
];

const seatsToBook = seats.map((seat) => {
  const [row, col] = seat;
  //   console.log(row);
  if (seatLayout[row][col] === 0) {
    seatLayout[row][col] = 1;
    return seat;
  }
});

console.log(seatLayout);
