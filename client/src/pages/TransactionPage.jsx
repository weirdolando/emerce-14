import Transaction from "../components/Transaction";
import Navbar from "../components/Navbar";

function TransactionPage() {
  return (
    <>
      <Navbar page="Order History" />
      <Transaction />
    </>
  );
}

export default TransactionPage;
