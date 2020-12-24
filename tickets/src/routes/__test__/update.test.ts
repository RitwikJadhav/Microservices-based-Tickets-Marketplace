import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns a 404 if the provided id does not exists", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signup())
    .send({ title: "adsfsdf", price: 20 })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "adsfsdf", price: 20 })
    .expect(401);
});

it("returns a 401 if the user does not own a ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({ title: "dfasdf", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signup())
    .send({
      title: "fdsfs",
      price: 20,
    })
    .expect(401);
});

// it("returns a 400 if the user provides an invalid title or price", async () => {
//   const cookie = global.signup();
//   const response = await request(app)
//     .post("/api/tickets")
//     .set("Cookie", cookie)
//     .send({ title: "dfasdf", price: 20 });

//   await request(app)
//     .put(`/api/tickets/${response.body.id}`)
//     .set("Cookie", cookie)
//     .send({
//       title: "",
//       price: 20,
//     })
//     .expect(400);

//   await request(app)
//     .put(`/api/tickets/${response.body.id}`)
//     .set("Cookie", cookie)
//     .send({
//       title: "dfasdf",
//       price: -20,
//     })
//     .expect(400);
// });

it("updates the ticket with the provided inputs", async () => {});
