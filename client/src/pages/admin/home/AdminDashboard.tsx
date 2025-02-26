import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Divider,
  DatePicker,
  Typography,
} from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  PieChartOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import {
  getUserStats,
  getQuizStats,
  getBlogsStats,
  getTopQuizCreator,
  getNewUsersInLastMonth,
  getNewQuizzes,
} from "../../../services/admin/dashboardServices";
import {
  UserStats,
  QuizStats,
  BlogStats,
  TopQuizCreatorStats,
} from "../../../types/dashboard";
import moment from "moment";
import "./dashboard.scss";

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [quizStats, setQuizStats] = useState<QuizStats | null>(null);
  const [blogStats, setBlogStats] = useState<BlogStats | null>(null);
  const [topQuizCreator, setTopQuizCreator] =
    useState<TopQuizCreatorStats | null>(null);
  const [newUserStats, setNewUserStats] = useState<{
    newUserCount: number;
  } | null>(null);

  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(
    moment()
  );

  useEffect(() => {
    async function fetchData() {
      const userStatsRes = await getUserStats();
      const quizStatsRes = await getQuizStats();
      const blogStatsRes = await getBlogsStats();
      const topQuizCreatorRes = await getTopQuizCreator();

      setUserStats(userStatsRes);
      setQuizStats(quizStatsRes);
      setBlogStats(blogStatsRes);
      setTopQuizCreator(topQuizCreatorRes);
      fetchNewUsersStats(moment());
    }
    fetchData();
  }, []);

  const fetchNewUsersStats = async (date: moment.Moment) => {
    const year = date.year();
    const month = date.month() + 1;
    const newUserStatsRes = await getNewUsersInLastMonth(year, month);
    setNewUserStats(newUserStatsRes);
  };

  const handleDateChange = (date: moment.Moment | null) => {
    setSelectedDate(date);
    if (date) {
      fetchNewUsersStats(date);
    }
  };

  return (
    <div style={{ padding: "24px", fontFamily: "'Poppins', sans-serif" }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} style={{ fontWeight: "600", marginBottom: 0 }}>
            Admin Dashboard
          </Title>
        </Col>
      </Row>

      <Divider />
      <div>
        <h4 style={{ fontWeight: "550", marginBottom: 10 }}>Total Stats</h4>
      </div>
      <Row gutter={[16, 16]} justify="center">
        <Col span={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Users"
              value={userStats?.totalUsers ?? 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Admins"
              value={userStats?.totalAdmins ?? 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card">
            <Statistic
              title="All Accounts"
              value={userStats?.allAccounts ?? 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} justify="center" style={{ marginTop: "24px" }}>
        <Col span={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Blogs"
              value={blogStats?.totalBlogs ?? 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#fa541c" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Quizzes"
              value={quizStats?.totalQuizzes ?? 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#cc99ff" }}
            />
          </Card>
        </Col>
      </Row>

      <Divider />
      <div>
        <h4 style={{ fontWeight: "550", marginBottom: 20 }}>
          Additional Stats
        </h4>
      </div>
      <Row gutter={[16, 16]} justify="center">
        <Col span={12}>
          <Card className="stat-card">
            <h4 style={{ fontWeight: "500", marginBottom: 10, fontSize: "14px" }}>
              Top Quiz Creators
            </h4>
            {topQuizCreator?.length > 0 ? (
              topQuizCreator?.map((creator, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: "14px",
                        color:
                          index === 0
                            ? "#efbf04" 
                            : index === 1
                            ? "#8c8c8c" 
                            : "#ce8946", 
                      }}
                    >
                      {`${index + 1}. ${creator.userName}`}
                    </Text>
                    {index === 0 && (
                      <TrophyOutlined
                        style={{
                          fontSize: "20px",
                          color: "#efbf04",
                          marginLeft: "8px",
                        }}
                      />
                    )}
                  </div>
                  <Text type="secondary">{`Quizzes: ${creator.quizCount}`}</Text>
                </div>
              ))
            ) : (
              <Text type="secondary">No quiz creators available.</Text>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card className="stat-card">
            <Statistic
              title="New Users This Month"
              value={newUserStats?.newUserCount ?? 0}
              prefix={<PieChartOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
            <DatePicker.MonthPicker
              value={selectedDate}
              onChange={handleDateChange}
              placeholder="Select Month/Year"
              format="YYYY-MM"
              className="compact-date-picker"
            />
          </Card>
        </Col>
      </Row>

      <Divider />
      <div>
        <h4 style={{ fontWeight: "550", marginBottom: 20 }}>Charts</h4>
      </div>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card
            title={
              <Text style={{ fontWeight: "600", fontSize: "18px" }}>
                User Growth Over Time
              </Text>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={userStats?.creationStats ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                <XAxis
                  dataKey="date"
                  axisLine={{ stroke: "#ddd", strokeWidth: 1 }}
                  tickLine={{ stroke: "#ddd", strokeWidth: 1 }}
                  tick={{
                    fontSize: 12,
                    fontFamily: "'Poppins', sans-serif",
                    fill: "#333",
                    angle: -45,
                    textAnchor: "end",
                  }}
                  interval={
                    userStats?.creationStats.length > 10
                      ? "preserveStartEnd"
                      : 0
                  }
                />
                <YAxis
                  yAxisId="left"
                  axisLine={{ stroke: "#ddd", strokeWidth: 1 }}
                  tickLine={{ stroke: "#ddd", strokeWidth: 1 }}
                  tick={{
                    fontSize: 12,
                    fontFamily: "'Poppins', sans-serif",
                    fill: "#333",
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={{ stroke: "#ddd", strokeWidth: 1 }}
                  tickLine={{ stroke: "#ddd", strokeWidth: 1 }}
                  tick={{
                    fontSize: 12,
                    fontFamily: "'Poppins', sans-serif",
                    fill: "#333",
                  }}
                />
                <ChartTooltip />
                <Legend wrapperStyle={{ paddingTop: "35px" }} />
                <Bar
                  dataKey="count"
                  yAxisId="left"
                  fill="#3498db"
                  barSize={40}
                  radius={[5, 5, 0, 0]}
                  name="User Count"
                />
                <Line
                  type="monotone"
                  dataKey="growthPercentage"
                  yAxisId="right"
                  stroke="#e74c3c"
                  strokeWidth={2}
                  name="Growth (%)"
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={
              <Text style={{ fontWeight: "600", fontSize: "18px" }}>
                Quiz Creation Trends
              </Text>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={quizStats?.creationStats ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                <XAxis
                  dataKey="date"
                  axisLine={{ stroke: "#ddd", strokeWidth: 1 }}
                  tickLine={{ stroke: "#ddd", strokeWidth: 1 }}
                  tick={{
                    fontSize: 12,
                    fontFamily: "'Poppins', sans-serif",
                    fill: "#333",
                    angle: -45,
                    textAnchor: "end",
                  }}
                  interval={
                    quizStats?.creationStats.length > 10
                      ? "preserveStartEnd"
                      : 0
                  }
                />
                <YAxis
                  yAxisId="left"
                  axisLine={{ stroke: "#ddd", strokeWidth: 1 }}
                  tickLine={{ stroke: "#ddd", strokeWidth: 1 }}
                  tick={{
                    fontSize: 12,
                    fontFamily: "'Poppins', sans-serif",
                    fill: "#333",
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={{ stroke: "#ddd", strokeWidth: 1 }}
                  tickLine={{ stroke: "#ddd", strokeWidth: 1 }}
                  tick={{
                    fontSize: 12,
                    fontFamily: "'Poppins', sans-serif",
                    fill: "#333",
                  }}
                />
                <ChartTooltip />
                <Legend wrapperStyle={{ paddingTop: "35px" }} />
                <Bar
                  dataKey="count"
                  yAxisId="left"
                  fill="#148548"
                  barSize={40}
                  radius={[5, 5, 0, 0]}
                  name="Quiz Count"
                />
                <Line
                  type="monotone"
                  dataKey="growthPercentage"
                  yAxisId="right"
                  stroke="#e74c3c"
                  strokeWidth={2}
                  name="Growth (%)"
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
