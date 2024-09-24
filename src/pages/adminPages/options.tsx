import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { addOption, fetchOptions, removeOption } from "../../api/admin";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from "@nextui-org/react";
import { AiFillBank } from "react-icons/ai";
import { MdPeopleAlt, MdBedroomParent } from "react-icons/md";
import { IoMdAddCircle, IoMdTrash } from "react-icons/io";
import { Popconfirm, Button } from "antd";
import { FaClock } from "react-icons/fa";
import { CiCircleMore } from "react-icons/ci";

interface Options {
  securityDeposit: string[];
  genders: string[];
  roomType: string[];
  noticePeriod: string[];
  AdditionalOptions:string[];
}

const OptionsManager: React.FC = () => {
  const [options, setOptions] = useState<Options>({
    securityDeposit: [],
    genders: [],
    roomType: [],
    noticePeriod: [],
    AdditionalOptions:[]
  });

  const [newdeposit, setNewdeposit] = useState("");
  const [newGender, setNewGender] = useState("");
  const [newRoomtype, setNewRoomtype] = useState("");
  const [newNoticeperiod, setNewNoticeperiod] = useState("");
  const [newAdditionaOptions,setAdditionalOptions] = useState("")

  useEffect(() => {
    const fetchOptionsData = async () => {
      try {
        const response = await fetchOptions();
        setOptions(response.data);
      } catch (error) {
        toast.error("Failed to fetch options");
      }
    };

    fetchOptionsData();
  }, []);

  const handleAdd = async (category: keyof Options, newValue: string) => {
    
    if (!newValue.trim()) {
      toast.error("Please enter a valid option");
      return;
    }

    let response = await addOption(category, newValue);

    if (response) {
      setOptions((prevOptions) => ({
        ...prevOptions,
        [category]: [...prevOptions[category], newValue],
      }));
      toast.success("Option added successfully");
      if (category === "securityDeposit") {
        setNewdeposit("");
      } else if (category === "genders") {
        setNewGender("");
      } else if (category === "roomType") {
        setNewRoomtype("");
      } else if (category === "noticePeriod") {
        setNewNoticeperiod("");
      } else if (category === "AdditionalOptions") {
        setAdditionalOptions("");
      } 
    }
  };

  const handleRemoveOption = async (
    category: keyof Options,
    valueToRemove: string
  ) => {
   
    
    let response = await removeOption(category, valueToRemove);

    if (response) {
      setOptions((prevOptions) => ({
        ...prevOptions,
        [category]: prevOptions[category].filter(
          (option) => option !== valueToRemove
        ),
      }));
      toast.success("Option removed successfully");
    }
  };

  return (
    <div className="md:flex gap-4">
      <Card className="max-w-[200px] min-w-[170px]">
        <CardHeader className="flex gap-3">
          <AiFillBank />
          <div className="flex flex-col">
            <p className="text-md">Security Deposit</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <ul>
            {options.securityDeposit.map((option, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <span>{option}</span>
                <Popconfirm
                  placement="topRight"
                  title="Are you sure?"
                  description="This action cannot be undone."
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() =>
                    handleRemoveOption("securityDeposit", option)
                  }
                >
                  <IoMdTrash className="hover:cursor-pointer" />
                </Popconfirm>
              </li>
            ))}
          </ul>
        </CardBody>
        <Divider />
        <CardFooter>
          <div className="flex w-full gap-2 items-center">
            <input
              type="text"
              placeholder="Add Security Deposit"
              className="w-[150px] bg-slate-100 border border-gray-300 rounded px-2 py-1 placeholder:text-sm"
              value={newdeposit}
              onChange={(e) => setNewdeposit(e.target.value)}
            />
            <IoMdAddCircle
              className="hover:cursor-pointer"
              onClick={() => handleAdd("securityDeposit", newdeposit)}
            />
          </div>
        </CardFooter>
      </Card>

      <Card className="max-w-[200px] min-w-[170px]">
        <CardHeader className="flex gap-3">
          <MdPeopleAlt />
          <div className="flex flex-col">
            <p className="text-md">Genders</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <ul>
            {options.genders.map((option, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <span>{option}</span>
                <Popconfirm
                  placement="topRight"
                  title="Are you sure?"
                  description="This action cannot be undone."
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleRemoveOption("genders", option)}
                >
                  <IoMdTrash className="hover:cursor-pointer" />
                </Popconfirm>
              </li>
            ))}
          </ul>
        </CardBody>
        <Divider />
        <CardFooter>
          <div className="flex w-full gap-2 items-center">
            <input
              type="text"
              placeholder="Add Gender"
              className="w-[150px] bg-slate-100 border border-gray-300 rounded px-2 py-1 placeholder:text-sm "
              value={newGender}
              onChange={(e) => setNewGender(e.target.value)}
            />

            <IoMdAddCircle
              className="hover:cursor-pointer"
              onClick={() => handleAdd("genders", newGender)}
            />
          </div>
        </CardFooter>
      </Card>

      <Card className="max-w-[200px] min-w-[170px]">
        <CardHeader className="flex gap-3">
          <MdBedroomParent />
          <div className="flex flex-col">
            <p className="text-md">Room Types</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <ul>
            {options.roomType.map((option, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <span>{option}</span>
                <Popconfirm
                  placement="topRight"
                  title="Are you sure?"
                  description="This action cannot be undone."
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleRemoveOption("roomType", option)}
                >
                  <IoMdTrash className="hover:cursor-pointer" />
                </Popconfirm>
              </li>
            ))}
          </ul>
        </CardBody>
        <Divider />
        <CardFooter>
          <div className="flex w-full gap-2 items-center">
            <input
              type="text"
              placeholder="Add Room Type"
              className="w-[150px] bg-slate-100 border border-gray-300 rounded px-2 py-1 placeholder:text-sm"
              value={newRoomtype}
              onChange={(e) => setNewRoomtype(e.target.value)}
            />
            <IoMdAddCircle
              className="hover:cursor-pointer"
              onClick={() => handleAdd("roomType", newRoomtype)}
            />
          </div>
        </CardFooter>
      </Card>

      <Card className="max-w-[200px] min-w-[170px]">
        <CardHeader className="flex gap-3">
          <FaClock />
          <div className="flex flex-col">
            <p className="text-md">Notice Periods</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <ul>
            {options.noticePeriod.map((option, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <span>{option}</span>
                <Popconfirm
                  placement="topRight"
                  title="Are you sure?"
                  description="This action cannot be undone."
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleRemoveOption("noticePeriod", option)}
                >
                  <IoMdTrash className="hover:cursor-pointer" />
                </Popconfirm>
              </li>
            ))}
          </ul>
        </CardBody>
        <Divider />
        <CardFooter>
          <div className="flex w-full gap-2 items-center">
            <input
              type="text"
              placeholder="Add Notice Period"
              className="w-[150px] bg-slate-100 border  border-gray-300 rounded px-2 py-1 placeholder:text-sm"
              value={newNoticeperiod}
              onChange={(e) => setNewNoticeperiod(e.target.value)}
            />
            <IoMdAddCircle
              className="hover:cursor-pointer"
              onClick={() => handleAdd("noticePeriod", newNoticeperiod)}
            />
          </div>
        </CardFooter>
      </Card>

      <Card className="max-w-[200px] min-w-[170px]">
        <CardHeader className="flex gap-3">
        <CiCircleMore />
          <div className="flex flex-col">
            <p className="text-md">Additional Options</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <ul>
            {options.AdditionalOptions.map((option, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <span>{option}</span>
                <Popconfirm
                  placement="topRight"
                  title="Are you sure?"
                  description="This action cannot be undone."
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleRemoveOption("AdditionalOptions", option)}
                >
                  <IoMdTrash className="hover:cursor-pointer" />
                </Popconfirm>
              </li>
            ))}
          </ul>
        </CardBody>
        <Divider />
        <CardFooter>
          <div className="flex w-full gap-2 items-center">
            <input
              type="text"
              placeholder="Add Additional Options"
              className="w-[150px] bg-slate-100 border  border-gray-300 rounded px-2 py-1 placeholder:text-sm"
              value={newAdditionaOptions}
              onChange={(e) => setAdditionalOptions(e.target.value)}
            />
            <IoMdAddCircle
              className="hover:cursor-pointer"
              onClick={() => handleAdd("AdditionalOptions", newAdditionaOptions)}
            />
          </div>
        </CardFooter>
      </Card>

    </div>
  );
};

export default OptionsManager;
