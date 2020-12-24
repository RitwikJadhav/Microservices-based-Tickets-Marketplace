import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import "express-async-errors"; // mandatory is we are async await syntax anywhere in our code
import { errorHandler, NotFoundError, currentUser } from "@tixpal/common";
import { CreateTicketRouter } from "./routes/new";
import { ShowTickerRouter } from "./routes/show";
import { GetAllTicketRouter } from "./routes/get-all";
import { UpdateTicketsRouter } from "./routes/update";

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
app.use(CreateTicketRouter);
app.use(ShowTickerRouter);
app.use(GetAllTicketRouter);
app.use(UpdateTicketsRouter);
app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
