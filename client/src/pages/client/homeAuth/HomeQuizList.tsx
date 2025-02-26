import React, { useState } from "react";
import ListQuiz from "../../../quiz/ListQuiz";
import MostQuiz from "../../../quiz/MostQuiz";
import LastesQuiz from "../../../quiz/LastesQuiz";
import QuestionsByQuizId from "../../../quiz/QuestionsByQuizId";
import UpdateQuiz from "../../../quiz/UpdateQuiz";
import Animation from "./Animation/Animation";
import QuizDetail from "../../../quiz/QuizDetails";
import { countTraffic, lastesQuiz } from "../../../services/client/ApiQuiz";
import { useNavigate } from "react-router-dom";
import "../../../quiz/UserQuiz";
import "../../../quiz/SearchQuiz";
const HomeQuizList: React.FC = () => {
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleQuizSelect = async (quizId: string) => {
    setLoading(true);
    try {
      setSelectedQuizId(quizId);
      setIsUpdating(false);
      await countTraffic(quizId);
      await lastesQuiz(quizId);
      navigate(`/quiz/quiz-details/${quizId}`);
    } catch (error) {
      console.error("Error handling quiz selection:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleUpdateQuiz = (quizId: string) => {
  //   setSelectedQuizId(quizId);
  //   setIsUpdating(true);
  // };

  const handleBack = () => {
    setSelectedQuizId(null);
    setIsUpdating(false);
  };

  return (
    <div className="home-quiz-list-container">
      {!selectedQuizId && (
        <div className="animation-container">
          <Animation />
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      ) : (
        // ) : isUpdating ? (
        //   <UpdateQuiz quizId={selectedQuizId!} onBack={handleBack} />
        // ) : selectedQuizId ? (
        //   <QuizDetail quizId={selectedQuizId} onBack={handleBack} />
        <div className="quiz-list-section">
          <MostQuiz
            onQuizSelect={handleQuizSelect}
            // onUpdateQuiz={handleUpdateQuiz}
          />
          <LastesQuiz
            onQuizSelect={handleQuizSelect}
            // onUpdateQuiz={handleUpdateQuiz}
          />
          <ListQuiz
            onQuizSelect={handleQuizSelect}
          // onUpdateQuiz={handleUpdateQuiz}
          />
          <ListQuiz
            onQuizSelect={handleQuizSelect}
          // onUpdateQuiz={handleUpdateQuiz}
          />
        </div>
      )}
    </div>
  );
};

export default HomeQuizList;
