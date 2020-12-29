const OrderIndex = ({ orders }) => {
  const myOrders = orders.map((order) => {
    return (
      <tr key={order.id}>
        <td>{order.ticket.title}</td>
        <td>{order.status}</td>
      </tr>
    );
  });
  return (
    <div>
      <div>
        <h2>My Orders</h2>
        <table className="table table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Ticket</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{myOrders}</tbody>
        </table>
      </div>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");
  return { orders: data };
};

export default OrderIndex;
