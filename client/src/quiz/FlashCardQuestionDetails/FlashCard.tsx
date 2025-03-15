import React, { useState } from "react";
import { Card, Button, Typography, Progress } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import "./examFlashCard.scss";
import { Question } from "../QuestionModal";
import { current } from "@reduxjs/toolkit";
import {useTranslation} from "react-i18next";
const { Title } = Typography;

interface FlashCardQuestionProps {
  questions: Question[];
}

const FlashCardQuestionDetail: React.FC<FlashCardQuestionProps> = ({ questions }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
const { t } = useTranslation("learnquiz");
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  const handleFlip = () => {
    setIsFlipped((prevState) => !prevState);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setCurrentProgress((prevProgress) => prevProgress + 1);
    } else if (currentIndex === totalQuestions - 1) {
      setCurrentProgress(totalQuestions); // Đánh dấu hoàn thành
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCurrentProgress(0);
  };

  return (
    <>
      <h1>{t("FlashCardReview")}</h1>
      <div className="flash-card-container">
      
        <div className="flip-card" onClick={handleFlip}>
          <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
            <div className="flip-card-front">
              <div className="card-question">
                {currentQuestion.questionText}
              </div>
              {currentQuestion.image && (
                <img
                className="flash-card-image"
                  src={currentQuestion.image}
                  alt={currentQuestion.questionText}
                />
              )}
            </div>
            <div className="flip-card-back">
              <div className="card-answer">{currentQuestion.correctAnswer.split(`/"'\\`).join(`,`)}</div>
            </div>
          </div>
        </div>

        <div className="navigation-buttons">
          

          {currentProgress < totalQuestions ? (
           <>
           <Button
            className="btnFlash"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ArrowLeftOutlined />
          </Button>
            <Button className="btnFlash" onClick={handleNext}>
              <ArrowRightOutlined />
            </Button>
            </>
          ) : (
            <Button className="btnFlash" onClick={handleRetry}>
              <ReloadOutlined /> {t("Retry")}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default FlashCardQuestionDetail;