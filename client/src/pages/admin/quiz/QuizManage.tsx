import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  getAllQuizByAdmin,
  removeQuizByAdmin,
  toggleStatusQuizByAdmin,
} from "../../../services/client/ApiServies";
import { Quiz, User, Question } from "./quiz.type";
import {
  Modal,
  Table,
  Button,
  Input,
  message,
  Tag,
  Empty,
  DatePicker,
  Switch,
  Dropdown,
  Menu,
} from "antd";
import { SettingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const QuizManage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);
  const [visibleColumns, setVisibleColumns] = useState({
    created: true,
    updated: true,
  });

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getAllQuizByAdmin();
      setQuizzes(data.data || []);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const matchesSearch =
        quiz.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
      const createdAtTimestamp = new Date(quiz.createdAt).getTime();
      const startDateTimestamp = dateRange[0]?.startOf("day").valueOf();
      const endDateTimestamp = dateRange[1]?.endOf("day").valueOf();
      const matchesDateRange =
        !startDateTimestamp ||
        !endDateTimestamp ||
        (createdAtTimestamp >= startDateTimestamp &&
          createdAtTimestamp <= endDateTimestamp);
      return matchesSearch && matchesDateRange;
    });
  }, [quizzes, searchTerm, dateRange]);

  const handleToggleStatus = useCallback(
    async (quizId: string, currentStatus: boolean) => {
      try {
        setQuizzes((prevQuizzes) =>
          prevQuizzes.map((quiz) =>
            quiz._id === quizId ? { ...quiz, deleted: !currentStatus } : quiz
          )
        );
        await toggleStatusQuizByAdmin(quizId);
        message.success(
          `Quiz has been ${currentStatus ? "made available" : "hidden"}`
        );
      } catch (error) {
        console.error(error);
        message.error("Failed to toggle quiz status");
        setQuizzes((prevQuizzes) =>
          prevQuizzes.map((quiz) =>
            quiz._id === quizId ? { ...quiz, deleted: currentStatus } : quiz
          )
        );
      }
    },
    []
  );

  const showDeleteConfirm = useCallback((id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this quiz?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      maskClosable: true,
      centered: true,
      onOk: async () => {
        try {
          await removeQuizByAdmin(id);
          setQuizzes((prev) => prev.filter((quiz) => quiz._id !== id));
          message.success("Quiz deleted successfully");
        } catch (error) {
          console.error(error);
          message.error("Failed to delete quiz");
        }
      },
    });
  }, []);

  const toggleColumnVisibility = (column: "created" | "updated") => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const columnVisibilityMenu = (
    <Menu>
      <Menu.Item
        key="created"
        onClick={() => toggleColumnVisibility("created")}
      >
        {visibleColumns.created ? "Hide" : "Show"} Created Column
      </Menu.Item>
      <Menu.Item
        key="updated"
        onClick={() => toggleColumnVisibility("updated")}
      >
        {visibleColumns.updated ? "Hide" : "Show"} Updated Column
      </Menu.Item>
    </Menu>
  );

  const columns = useMemo(
    () => [
      { title: "Title", dataIndex: "title", key: "title" },
      {
        title: "Created By",
        dataIndex: "userId",
        key: "userId",
        render: (data: User) => (
          <Tag color={data?.userName ? "green" : "red-inverse"}>
            {data?.userName || "Unknown"}
          </Tag>
        ),
      },
      {
        title: "Questions",
        dataIndex: "questions",
        key: "questions",
        render: (data: Question[]) => data.length,
        align: "center" as const,
      },
      {
        title: "Traffic",
        dataIndex: "traffic",
        key: "traffic",
        align: "center" as const,
      },
      {
        title: "Status",
        dataIndex: "deleted",
        key: "deleted",
        render: (deleted: boolean, record: Quiz) => (
          <Switch
            checked={!deleted}
            onChange={() => handleToggleStatus(record._id, deleted)}
            checkedChildren="Available"
            unCheckedChildren="Hidden"
          />
        ),
        align: "center" as const,
      },
      ...(visibleColumns.created
        ? [
            {
              title: "Created",
              dataIndex: "createdAt",
              key: "createdAt",
              render: (createdAt: string) =>
                new Date(createdAt).toLocaleDateString(),
              align: "center" as const,
            },
          ]
        : []),
      ...(visibleColumns.updated
        ? [
            {
              title: "Updated",
              dataIndex: "updatedAt",
              key: "updatedAt",
              render: (updatedAt: string) =>
                new Date(updatedAt).toLocaleDateString(),
              align: "center" as const,
            },
          ]
        : []),
      {
        title: "Actions",
        key: "actions",
        render: (_: unknown, record: Quiz) => (
          <Button onClick={() => showDeleteConfirm(record._id)} danger>
            Delete
          </Button>
        ),
      },
    ],
    [handleToggleStatus, showDeleteConfirm, visibleColumns]
  );

  return (
    <>
      <h2>Quiz Management</h2>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Input
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
        />
        <RangePicker
          onChange={(dates) => setDateRange(dates || [null, null])}
        />
        <Dropdown overlay={columnVisibilityMenu} placement="bottomRight">
          <Button icon={<SettingOutlined />}>Column Settings</Button>
        </Dropdown>
      </div>

      <Table
        loading={loading}
        dataSource={filteredQuizzes}
        columns={columns}
        rowKey="_id"
        locale={{ emptyText: <Empty description="No quiz found" /> }}
        pagination={filteredQuizzes.length > 10 ? { pageSize: 10 } : false}
      />
    </>
  );
};

export default QuizManage;
