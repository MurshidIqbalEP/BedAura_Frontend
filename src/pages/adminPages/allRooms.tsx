import React, { useState, useEffect } from "react";
import { Button,Space, Table, Popconfirm, Input, Modal } from "antd";


import {
  FaCalendar,
  FaDollarSign,
  FaEye,
  FaHome,
  FaMapPin,
  FaShieldAlt,
  FaUser,
} from "react-icons/fa";
import type { TableColumnsType, TableProps } from "antd";
import {  fetchAllRooms, ListRoom, UnlistRoom } from "../../api/admin";
import { toast } from "react-toastify";

interface DataType {
  _id:string;
  name: string;
  mobile: string;
  userId: string;
  maintenanceCharge: string;
  securityDeposit: string;
  gender: string;
  slots: number;
  roomType: string;
  noticePeriod: string;
  location: string;
  description: string;
  coordinates: { lat: number; lng: number };
  images: string[];
  isAdmin: boolean;
  isEdited: boolean;
  isListed:boolean;
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DataType | null>(null);

  useEffect(() => {
    const FetchEditRequests = async () => {
      try {
        const response = await fetchAllRooms();
        console.log(response);
        setData(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch users");
      }
    };

    FetchEditRequests();
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

  // Filter data based on search text
  const filteredData = data.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const showModal = (user: DataType) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleUnlistRoom = async(id:string)=>{
  let unlisted = await UnlistRoom(id);
  if(unlisted){
    setData((prevData) =>
      prevData.map((room) =>
        room._id === id ? { ...room, isListed: false } : room
      )
    );
    toast.success("Room unlisted successfully!");
  }
  
  
   
  }

  const handleListRoom = async (id:string)=>{
    let listed = await ListRoom(id)
    if(listed){
      setData((prevData) =>
        prevData.map((room) =>
          room._id === id ? { ...room, isListed: true } : room
        )
      );
      toast.success("Room listed successfully!");
    }
  }

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
      title: "Slots",
      dataIndex: "slots",
      key: "slots",
      ellipsis: true,
      align: "center",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      ellipsis: true,
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <FaEye size={20} onClick={() => showModal(record)} />
          {record.isListed ? (
            <Popconfirm
            title="Are you sure you want to unlist this room?"
            onConfirm={() => handleUnlistRoom(record._id)}
          >
            <Button type="link">Unlist</Button>
          </Popconfirm>
            
          ) : (
            <Popconfirm
              title="Are you sure you want to list this room?"
              onConfirm={() => handleListRoom(record._id)}
            >
              <Button type="link">list</Button>
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
        <h1 className="text-lg font-bold ml-2 "> Rooms  :</h1>
        <Space>
          <Input
            placeholder="Search by name"
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

      <Modal
       
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        {selectedUser && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{selectedUser.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-100 rounded-lg shadow-lg">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <FaUser className="text-blue-500" size={18} />
                      <span className="font-bold text-gray-700">User ID:</span>
                    </div>
                    <div className="text-gray-600">{selectedUser.userId}</div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <FaMapPin className="text-green-500" size={18} />
                      <span className="font-bold text-gray-700">Location:</span>
                    </div>
                    <div className="text-gray-600">{selectedUser.location}</div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <FaCalendar className="text-yellow-500" size={18} />
                      <span className="font-bold text-gray-700">
                        Notice Period:
                      </span>
                    </div>
                    <div className="text-gray-600">
                      {selectedUser.noticePeriod}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <FaHome className="text-purple-500" size={18} />
                      <span className="font-bold text-gray-700">
                        Room Type:
                      </span>
                    </div>
                    <div className="text-gray-600">{selectedUser.roomType}</div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-700">Gender:</span>
                    </div>
                    <div className="text-gray-600">{selectedUser.gender}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <FaDollarSign className="text-red-500" size={18} />
                      <span className="font-bold text-gray-700">
                        Maintenance:
                      </span>
                    </div>
                    <div className="text-gray-600">
                      {selectedUser.maintenanceCharge}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <FaShieldAlt className="text-indigo-500" size={18} />
                      <span className="font-bold text-gray-700">
                        Security Deposit:
                      </span>
                    </div>
                    <div className="text-gray-600">
                      {selectedUser.securityDeposit}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-700">Mobile:</span>
                    </div>
                    <div className="text-gray-600">{selectedUser.mobile}</div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-700">
                        Description:
                      </span>
                    </div>
                    <div className="text-gray-600">
                      {selectedUser.description}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-700">Slots:</span>
                    </div>
                    <div className="text-gray-600">{selectedUser.slots}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 p-4">
              <h3 className="text-lg font-semibold mb-3">Images</h3>
              <div className="flex justify-around">
                {selectedUser.images.slice(0, 3).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`User image ${index + 1}`}
                    className="w-28 h-28 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default App;
