import React from "react";
import Lottie from "lottie-react";
import animationData from "./Animation.json";
import "./Animation.scss";
import { useTranslation } from "react-i18next";

const Animation = () => {
  const {t} = useTranslation("home");

  return (
    <div className="container">
      <div className="animation-header">
        <div className="content">
          <h1>Quizlet !</h1>
          <h2> {t('Welcome to Quizlet')}</h2>
          <p>
            {t('Your one-stop')}
          </p>
          <p>
            {t('Enhance your learning')}
          </p>
          <button className="cta-button">{t('Get start')}</button>
          <button className="cta-button">{t('Contact')}</button>
        </div>
        <div className="animation">
          <Lottie animationData={animationData} loop autoplay />
        </div>
      </div>
    </div>
  );
};

export default Animation;
