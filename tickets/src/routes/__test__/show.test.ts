import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

// it("returns a status of 404 if ticket is not found", async () => {
//   const id = new mongoose.Types.ObjectId().toHexString();
//   const response = await request(app)
//     .get(`/api/tickets/${id}`)
//     .send()
//     .expect(404);
// });

it("returns the ticket if ticket is found", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({ title: "concert", price: 20 })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual("concert");
  expect(ticketResponse.body.price).toEqual(20);
});
