const cors = require("cors");
const express = require("express");
const PORT = process.env.PORT || 5000;
const moviesRouter = require("./routes/movies");
const userRouter = require("./routes/user");
const reviewRouter = require("./routes/review");

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/movies", moviesRouter);
app.use("/api/user", userRouter);
app.use("/api/review", reviewRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
