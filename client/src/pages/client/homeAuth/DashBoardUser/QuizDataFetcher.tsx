import React, { useEffect, useState } from "react";
import QuizChart from "./QuizChart";
import { getQuiz } from "../../../../services/client/ApiServies";

interface QuizData {
  date: string;
  count: number;
}

const QuizDataFetcher: React.FC<{ currentUserId: string }> = ({ currentUserId }) => {
  const [quizData, setQuizData] = useState<QuizData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const processData = (data: any[]) => {
    if (!Array.isArray(data)) {
      console.error("Invalid data format:", data);
      return [];
    }

    const filteredData = data.filter((quiz) => quiz.userId?._id === currentUserId);

    const groupedData = filteredData.reduce((acc: Record<string, number>, quiz) => {
      const date = new Date(quiz.createdAt).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const dates = [];
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split("T")[0]);
    }

    return dates.map((date) => ({
      date,
      count: groupedData[date] || 0,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getQuiz();
        const processed = processData(response.data);
        setQuizData(processed);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setQuizData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUserId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (quizData.length === 0) {
    return <p>No quizzes found for this month.</p>;
  }

  return <QuizChart data={quizData} />;
};

export default QuizDataFetcher;
