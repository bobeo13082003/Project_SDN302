import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Select,
  message,
  Tag,
  DatePicker,
} from "antd";
import {
  getUsers,
  updateUser,
  deleteUser,
  updateUserStatus,
} from "../../../services/admin/userServices";
import { User } from "../../../types/user";
import moment from "moment";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [dateRange, setDateRange] = useState<
    [moment.Moment | null, moment.Moment | null]
  >([null, null]);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    role: "user" as "admin" | "user",
    status: "active" as "active" | "inactive",
  });

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      userName: user.userName,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
    });
    setIsEditModalVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: "admin" | "user") =>
    setFormData((prev) => ({ ...prev, role: value }));

  const handleUpdateUser = async () => {
    try {
      const { userName, email, role, status } = formData;
      if (!selectedUser) return;

      const updatedUser = await updateUser(
        selectedUser._id,
        userName,
        email,
        role,
        status
      );

      setUsers((prev) => {
        const updatedUsers = prev.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
        return updatedUsers;
      });

      message.success("User updated successfully");
      applyFilters();
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Failed to update user";
      message.error(errorMsg);
    }
    setIsEditModalVisible(false);
  };

  const handleDeleteUser = async (_id: string) => {
    if (!_id) return;

    try {
      await deleteUser(_id);
      setUsers((prev) => prev.filter((user) => user._id !== _id));
      message.success("User deleted successfully");
      applyFilters();
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleStatusFilterChange = (value: "all" | "active" | "inactive") =>
    setStatusFilter(value);
  const handleDateRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null]
  ) => {
    setDateRange(dates || [null, null]);
  };

  const handleToggleStatus = async (
    userId: string,
    currentStatus: "active" | "inactive"
  ) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );

      message.success(`User status updated to ${newStatus}.`);
    } catch (error: any) {
      console.error("Error toggling user status:", error);
      message.error("Failed to update user status.");
    }
  };

  const applyFilters = () => {
    const filtered = users.filter((user) => {
      const matchesSearch =
        user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false;

      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      const createdAtTimestamp = new Date(user.createdAt).getTime();

      const startDateTimestamp = dateRange[0]
        ? dateRange[0].startOf("day").toDate().getTime()
        : null;
      const endDateTimestamp = dateRange[1]
        ? dateRange[1].endOf("day").toDate().getTime()
        : null;

      const matchesDateRange =
        startDateTimestamp && endDateTimestamp
          ? createdAtTimestamp >= startDateTimestamp &&
            createdAtTimestamp <= endDateTimestamp
          : true;

      return matchesSearch && matchesStatus && matchesDateRange;
    });

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        message.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchTerm, statusFilter, dateRange]);

  const columns = [
    { title: "UserName", dataIndex: "userName", key: "userName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: "active" | "inactive", record: User) => (
        <Button
          type="link"
          onClick={() => handleToggleStatus(record._id, status)}
          style={{ padding: 0 }}
        >
          <Tag color={status === "active" ? "green" : "red"}>
            {status === "active" ? "Active" : "Inactive"}
          </Tag>
        </Button>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => new Date(createdAt).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => (
        <>
          <Button
            onClick={() => openEditModal(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button onClick={() => handleDeleteUser(record._id)} danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <h2>Users Management</h2>
      <div style={{ marginBottom: 16, textAlign: "center" }}>
        <Input
          placeholder="Search by user name"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ width: 200, marginRight: 8 }}
        />
        <Select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          style={{ width: 120, marginRight: 8 }}
        >
          <Option value="all">All</Option>
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
        <RangePicker
          onChange={handleDateRangeChange}
          style={{ marginRight: 8 }}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div>No users found</div>
      ) : (
        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="_id"
          style={{ marginTop: 16 }}
        />
      )}

      <Modal
        title="Edit User"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleUpdateUser}
      >
        <Input
          name="userName"
          placeholder="Name"
          value={formData.userName}
          onChange={handleInputChange}
          style={{ marginBottom: 8 }}
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          style={{ marginBottom: 8 }}
        />
        <Select
          value={formData.role}
          onChange={handleRoleChange}
          style={{ width: "100%", marginBottom: 8 }}
        >
          <Option value="admin">Admin</Option>
          <Option value="user">User</Option>
        </Select>
      </Modal>
    </>
  );
};

export default UserManagement;
