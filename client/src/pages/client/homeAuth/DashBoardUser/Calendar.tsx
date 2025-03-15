import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import CSS of react-calendar
import { CalendarOutlined } from "@ant-design/icons";
import Chart from "./Chart.json";
import Pie from "./PieChart.json";
import Lottie from "lottie-react";
import "./calendar.scss";

const MyCalendar: React.FC = () => {
  const [date, setDate] = useState<Date | Date[]>(new Date());

  // const onChange = (newDate: Date | Date[]) => {
  //   setDate(newDate);
  // };

  return (
    <div className="my-calendar-container">
      <div className="calendar">
        <h2>
          React Calendar
          <CalendarOutlined />
        </h2>
        <Calendar />
        <div className="selected">
          <h2>
            {Array.isArray(date)
              ? date.map((d) => d.toDateString()).join(" - ")
              : date.toDateString()}
          </h2>
        </div>
      </div>
      <div className="chart">
        <Lottie animationData={Chart} loop autoplay />
      </div>
      <div className="pie-chart">
        <Lottie animationData={Pie} loop autoplay />
      </div>
    </div>
  );
};

export default MyCalendar;
