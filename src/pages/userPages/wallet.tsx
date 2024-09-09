import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchWallet } from "../../api/user";
import { IWallet } from "../../services/types";
import { Empty } from 'antd';

// Wallet section
const Wallet = () => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const [wallet, setWallet] = useState<IWallet | null>(null);

  useEffect(() => {
    const FetchWallet = async () => {
      const walletResponse = await fetchWallet(userInfo._id);
      console.log(walletResponse?.data.data);
      setWallet(walletResponse?.data.data || null);
    };
    FetchWallet();
  }, [userInfo]);


  const columns = [
    { key: "date", label: "Date" },
    { key: "amount", label: "Amount" },
    { key: "description", label: "Description" }
  ];

  return (
    <div className="flex justify-center min-h-screen">
      <div className="bg-white mt-[30px] p-6 rounded-lg shadow-lg w-full h-fit max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4">Wallet</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Balance:</h3>
            <p className="text-lg font-bold ">₹{wallet ? wallet.balance : 'Loading...'}</p>
          </div>

          <div>
            <h4 className="text-md font-medium mb-2">Transaction History:</h4>
            {wallet?.transactions.length ? (
              <Table aria-label="Transaction History">
                <TableHeader>
                  {columns.map((column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  ))}
                </TableHeader>
                <TableBody>
                  {wallet.transactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(transaction?.date).toLocaleDateString()}</TableCell>
                      <TableCell
                        className={`${
                          transaction.amount < 0 ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {transaction.amount < 0 ? "-" : "+"}₹{Math.abs(transaction.amount)}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
            
              <>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                <p className="text-gray-500 text-center">No transactions available.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
