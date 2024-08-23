import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Popconfirm } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { getAllUsers } from '../../api/admin';
import { blockUser } from '../../api/admin';
import { unBlockUser } from '../../api/admin';

import { toast } from 'react-toastify';

interface DataType {
  key: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

type OnChange = NonNullable<TableProps<DataType>['onChange']>;
type Filters = Parameters<OnChange>[1];
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const App: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setData(fetchedUsers.data.data);
      } catch (error) {
        toast.error('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };

  const clearFilters = () => setFilteredInfo({});
  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const handleBlock =async (email: string) => {
        let blocked =  await blockUser(email)
        if(blocked){
            setData((prevData) => 
                prevData.map((user) => 
                  user.email === email ? { ...user, isBlocked: true } : user
                )
              );
              toast.success("User blocked successfully!");
        }
        
  };

  const handleUnblock = async(email: string) => {
    let unBlocked =  await unBlockUser(email)
    if(unBlocked){
        setData((prevData) => 
            prevData.map((user) => 
              user.email === email ? { ...user, isBlocked: false } : user
            )
          );
          toast.success("User unblocked successfully!",);
    }

  };

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      ellipsis: true,
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortOrder: sortedInfo.columnKey === 'email' ? sortedInfo.order : null,
      ellipsis: true,
      align: 'center',
    },
    {
      title: 'Action',
      key: 'action',
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
      align: 'center',
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <h1 className="text-lg font-bold">Users</h1>
        <Button onClick={clearFilters}>Clear Filters</Button>
        <Button onClick={clearAll}>Clear Filters and Sorters</Button>
      </Space>
      <Table
        columns={columns}
        dataSource={data}
        onChange={handleChange}
        bordered
        pagination={{ 
            position: ['bottomCenter'], 
            size: 'small' 
          }}
      />
    </>
  );
};

export default App;
