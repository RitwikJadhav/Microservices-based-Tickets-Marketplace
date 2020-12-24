import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import "express-async-errors"; // mandatory is we are async await syntax anywhere in our code
import { errorHandler, NotFoundError, currentUser } from "@tixpal/common";
import { NewOrderRouter } from "./routes/new";
import { ShowOrderRouter } from "./routes/show";
import { DeleteOrderRouter } from "./routes/delete";
import { IndexOrderRouter } from "./routes";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", // in test environment, https is not required.
  })
);
app.use(currentUser);
app.use(NewOrderRouter);
app.use(ShowOrderRouter);
app.use(DeleteOrderRouter);
app.use(IndexOrderRouter);
app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
