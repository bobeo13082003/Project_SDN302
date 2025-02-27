// MatchCard.tsx
import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { Question } from "../../QuestionModal";
import "./examMatch.scss";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
interface MatchCardProps {
  questions: Question[];
}

const MatchCard1: React.FC<MatchCardProps> = ({
  questions: originalQuestions,
}) => {
  const [cards, setCards] = useState<any[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
const { t } = useTranslation("learnquiz");
const navigate = useNavigate();
  useEffect(() => {
    // Shuffle and initialize the cards
    const shuffledQuestions = [...originalQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
    const cardPairs = shuffledQuestions.flatMap((question, index) => [
      {
        id: index * 2,
        type: "question",
        text: question.questionText,
        quizID: index + 1,
      },
      {
        id: index * 2 + 1,
        type: "answer",
        text: question.correctAnswer.split(`/"'\\`).join(" ,"),
        quizID: index + 1,
      },
    ]);
    setCards(cardPairs.sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (gameFinished) return; // Stop the timer when the game is finished

    const timer = window.setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameFinished]);

  const handleCardClick = (index: number) => {
    if (
      flippedCards.length === 2 ||
      matchedCards.includes(index) ||
      gameFinished
    )
      return;

    setFlippedCards((prev) => [...prev, index]);

    if (flippedCards.length === 1) {
      const firstCard = cards[flippedCards[0]];
      const secondCard = cards[index];

      if (
        firstCard.quizID === secondCard.quizID &&
        ((firstCard.type === "question" && secondCard.type === "answer") ||
          (firstCard.type === "answer" && secondCard.type === "question"))
      ) {
        setMatchedCards((prev) => [...prev, flippedCards[0], index]);
      }

      setTimeout(() => setFlippedCards([]), 1000);
    }
  };

  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      setGameFinished(true); // Stop the game when all cards are matched
    }
  }, [matchedCards, cards]);

  return (
    <div className="match-card">
      <h1>{t("CardMatchingGame")}</h1>
<Button className="btnFlash" onClick={() => navigate.back()}>{t("Back")}</Button>
      <div style={{ fontSize: "20px", fontWeight: "bold", color: "red" }}>
        {t("Time")}: {elapsedTime}s
      </div>
      <div className="gridMatch">
        {cards.map(
          (card, index) =>
            !matchedCards.includes(index) && (
              <div
                key={index}
                className={`cardMatch ${flippedCards.includes(index) ? "flipped" : ""}`}
                onClick={() => handleCardClick(index)}
              >
                <span>{card.text}</span>
              </div>
            )
        )}
      </div>
      {gameFinished && <div>{t("GameComplete")}</div>}
    </div>
  );
};

export default MatchCard1;
