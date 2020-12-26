import { Ticket } from "../ticket";

it("Implements optimistic concurrency control", async (done) => {
  const ticket = Ticket.build({
    title: "concert",
    price: 5,
    userId: "12sdf",
  });

  await ticket.save();

  const ticketOne = await Ticket.findById(ticket.id);
  const ticketTwo = await Ticket.findById(ticket.id);

  ticketOne!.set({ price: 10 });
  ticketTwo!.set({ price: 20 });

  await ticketOne!.save();

  try {
    await ticketTwo!.save();
  } catch (err) {
    return done();
  }

  throw new Error("Should not reach this point");
});

it("Incremenets the version number", async () => {
  const ticket = Ticket.build({ title: "concert", price: 10, userId: "wfefw" });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
