import React from "react";
import Lottie from "lottie-react";
import AddQuiz from "../../../quiz/AddQuiz";
import CodeColor from "./Animation/CodeColor.json";
import puzzle from "./Animation/puzzle.json";
import "./slider.scss";
import Tutorial from "../../../quiz/TestQuestion/Tutorial";

const FlashCard: React.FC = () => {
  return (
    <div className="flashcard-container">
      <div className="flashcard-left">
        <div className="earth-day-section">
          <Tutorial />
        </div>
      </div>
      <div className="flashcard-right">
        <h1>Create Your Flashcard</h1>
        <p>
          A unique event filled with networking, workshops, seminars, and
          engaging conversations with the industry's leading experts.
        </p>
        <div className="add-quiz-container">
          <AddQuiz />
        </div>
    
      </div>
    </div>
  );
};

export default FlashCard;
