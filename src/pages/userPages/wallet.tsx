import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchWallet } from "../../api/user";
import { IWallet } from "../../services/types";
import { Empty, Pagination } from "antd";

// Wallet section
const Wallet = () => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const transactionsPerPage = 5; // Number of transactions per page

  useEffect(() => {
    const FetchWallet = async () => {
      const walletResponse = await fetchWallet(userInfo._id);
      setWallet(walletResponse?.data.data || null);
    };
    FetchWallet();
  }, [userInfo]);

  // Calculate the transactions to display for the current page
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = wallet?.transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    { key: "date", label: "Date" },
    { key: "amount", label: "Amount" },
    { key: "description", label: "Description" },
  ];

  return (
    <div className="flex justify-center min-h-screen">
      <div className="bg-white mt-[30px] p-6 rounded-lg shadow-lg w-full h-fit max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4">Wallet</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Balance:</h3>
            <p className="text-lg font-bold ">
              ₹{wallet ? wallet.balance : "Loading..."}
            </p>
          </div>

          <div>
            <h4 className="text-md font-medium mb-2">Transaction History:</h4>
            {wallet?.transactions.length ? (
              <>
                <Table aria-label="Transaction History">
                  <TableHeader>
                    {columns.map((column) => (
                      <TableColumn key={column.key}>{column.label}</TableColumn>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {currentTransactions && currentTransactions.length > 0 ? (
                      currentTransactions.map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {transaction?.date
                              ? new Date(transaction.date).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell
                            className={`${
                              transaction.transactionType === "credit"
                                ? "text-green-500"
                                : "text-red-500"
                            } p-1`}
                          >
                            {transaction.transactionType === "credit"
                              ? "+"
                              : "-"}
                            ₹{Math.abs(transaction.amount)}
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Pagination controls */}
                <Pagination
                  current={currentPage}
                  pageSize={transactionsPerPage}
                  total={wallet.transactions.length}
                  onChange={handlePageChange}
                  className="mt-4"
                />
              </>
            ) : (
              <>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                <p className="text-gray-500 text-center">
                  No transactions available.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
