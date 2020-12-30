import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const NewTicket = (currentUser) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = (e) => {
    e.preventDefault();
    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };

  let current;
  if (currentUser.currentUser === null) {
    current = (
      <div>
        <b>Please sign in to create a new ticket</b>
      </div>
    );
  } else {
    current = (
      <div>
        <h3>Create a new Ticket</h3>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              style={{ width: "50%" }}
              required
              value={title}
              className="form-control"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              style={{ width: "50%" }}
              required
              value={price}
              className="form-control"
              onChange={(e) => setPrice(e.target.value)}
              onBlur={onBlur}
              type="number"
            />
          </div>
          {errors}
          <button className="btn btn-primary">Create</button>
        </form>
      </div>
    );
  }

  return <div>{current}</div>;
};

export default NewTicket;
