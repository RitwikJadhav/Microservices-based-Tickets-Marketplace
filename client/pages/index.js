import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
  const allTickets = tickets.map((ticket) => {
    return (
      <Link
        key={ticket.id}
        href="/tickets/[ticketId]"
        as={`/tickets/${ticket.id}`}
      >
        <tr key={ticket.id}>
          <td>{ticket.title}</td>
          <td>{ticket.price}</td>
        </tr>
      </Link>
    );
  });

  return (
    <div>
      <div>
        <h2>Tickets</h2>
        <table className="table table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Title</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>{allTickets}</tbody>
        </table>
      </div>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};

export default LandingPage;
