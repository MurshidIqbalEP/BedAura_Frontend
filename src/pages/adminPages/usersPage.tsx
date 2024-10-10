import React, { useState, useEffect } from "react";
import { Button, Space, Table, Popconfirm, Input } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { getAllUsers, blockUser, unBlockUser } from "../../api/admin";
import { toast } from "react-toastify";

interface DataType {
  key: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

type OnChange = NonNullable<TableProps<DataType>["onChange"]>;
type Filters = Parameters<OnChange>[1];
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const App: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setData(fetchedUsers.data.data);
      } catch (error) {
        toast.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
    setSearchText("");
  };

  const handleBlock = async (email: string) => {
    let blocked = await blockUser(email);
    if (blocked) {
      setData((prevData) =>
        prevData.map((user) =>
          user.email === email ? { ...user, isBlocked: true } : user
        )
      );
      toast.success("User blocked successfully!");
    }
  };

  const handleUnblock = async (email: string) => {
    let unBlocked = await unBlockUser(email);
    if (unBlocked) {
      setData((prevData) =>
        prevData.map((user) =>
          user.email === email ? { ...user, isBlocked: false } : user
        )
      );
      toast.success("User unblocked successfully!");
    }
  };

  // Filter data based on search text
  const filteredData = data.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: TableColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
      align: "center",
      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.name.includes(value as string),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortOrder: sortedInfo.columnKey === "email" ? sortedInfo.order : null,
      ellipsis: true,
      align: "center",
      filteredValue: filteredInfo.email || null,
      onFilter: (value, record) => record.email.includes(value as string),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.isBlocked ? (
            <Popconfirm
              title="Are you sure you want to unblock this user?"
              onConfirm={() => handleUnblock(record.email)}
            >
              <Button type="link">Unblock</Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Are you sure you want to block this user?"
              onConfirm={() => handleBlock(record.email)}
            >
              <Button type="link">Block</Button>
            </Popconfirm>
          )}
        </Space>
      ),
      align: "center",
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 9,
        }}
      >
        <h1 className="text-lg font-bold ml-2 ">Users :</h1>
        <Space>
          <Input
            placeholder="Search by name or email"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Button onClick={clearAll}>Clear Search and Sorters</Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        onChange={handleChange}
        bordered
        pagination={{
          position: ["bottomCenter"],
          size: "small",
        }}
      />
    </>
  );
};

export default App;
