import useRequest from "../../hooks/use-request";
import Router from "next/router";

const TicketShow = ({ ticket, currentUser }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });
  if (currentUser !== null) {
    return (
      <div className="card" style={{ width: "50%" }}>
        <div className="card-body">
          <h3 className="card-title">
            <b>{ticket.title}</b>
          </h3>
          <p className="card-text">Ticket Price: ${ticket.price}</p>
          <button onClick={() => doRequest()} className="btn btn-primary">
            Purchase
          </button>
          <hr />
          {errors}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <b>Please sign in to view the ticket</b>
      </div>
    );
  }
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default TicketShow;
