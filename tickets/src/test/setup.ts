import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

let mongo: any;

declare global {
  namespace NodeJS {
    interface Global {
      signup(): string[];
    }
  }
}

beforeAll(async () => {
  process.env.JWT_KEY = "asdf";
  mongo = new MongoMemoryServer();
  const mongoURI = await mongo.getUri();
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signup = () => {
  // build our own payload
  const id = new mongoose.Types.ObjectId().toHexString();
  const payload = {
    id: id,
    email: "test@test.com",
  };

  // create our own JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build session object
  const session = { jwt: token };

  // turn session into JSON
  const sessionJSON = JSON.stringify(session);

  // take JSON and encode it in base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string thats a cookie with the encoded data
  return [`express:sess=${base64}`];
};
