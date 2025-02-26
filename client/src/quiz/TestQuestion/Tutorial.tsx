import React, { useState } from "react";
import { Button, Modal, Steps } from "antd";
import { useTranslation } from "react-i18next"; // Hook for translations
import "./Tutorial.scss";
import ExcelDemo from "../../../../client/src/assets/Screenshot 2024-12-05 000009.png"
const { Step } = Steps;

type HelpType = "defineTerm" | "multiChoice" | "trueFalse" | "addExcel" | "";

const Tutorial: React.FC = () => {
  const [isHelpVisible, setHelpVisible] = useState<boolean>(false);
  const [helpType, setHelpType] = useState<HelpType>("");
  const [currentStep, setCurrentStep] = useState<number>(0); // Track the current step
  const { t } = useTranslation("learnquiz"); // Hook to fetch translation
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  // Show tutorial based on the selected help type
  const showHelp = (type: HelpType) => {
    setHelpType(type);
    setCurrentStep(0); // Reset the step to 0 when a new help type is chosen
    setHelpVisible(true);
  };

  // Close tutorial modal
  const closeHelp = () => {
    setHelpVisible(false);
    setHelpType("");
  };

  // Handle step change
  const onStepChange = (current: number) => {
    setCurrentStep(current); // Update the current step
  };

const handleImageClick = () => {
  setImageModalVisible(true); // Show the image modal
};

const closeImageModal = () => {
  setImageModalVisible(false); // Close the image modal
};

  // Render steps based on the selected help type
  const renderSteps = () => {
    const commonSteps = [
      {
        title: t("QuizTitle"),
        description: (
          <>
            <strong>{t("QuizTitle")}</strong> - {t("QuizTitleDesc")}
          </>
        ),
      },
      {
        title: t("InputAnswer"),
        description: (
          <>
            <strong>{t("Description")}</strong> - {t("DescriptionDesc")}
          </>
        ),
      },

      {
        title: t("QuestionText"),
        description: (
          <>
            <strong>{t("QuestionText")}</strong> - {t("QuestionTextDesc")}
          </>
        ),
      },
    ];

    if (helpType === "defineTerm") {
      return (
        <Steps
          current={currentStep}
          direction="vertical"
          onChange={onStepChange}
        >
          {commonSteps.map((step, index) => (
            <Step
              key={index}
              title={step.title}
              description={step.description}
            />
          ))}
          <Step
            title={t("InputAnswer")}
            description={
              <>
                {t("FillCorrectAnswer")} <strong>{t("CorrectAnswer")}</strong>.
                <br />
                {t("ClickSaveQuiz")}
              </>
            }
          />
        </Steps>
      );
    }

    if (helpType === "multiChoice") {
      return (
        <Steps
          current={currentStep}
          direction="vertical"
          onChange={onStepChange}
        >
          {commonSteps.map((step, index) => (
            <Step
              key={index}
              title={step.title}
              description={step.description}
            />
          ))}
          <Step
            title={t("ChooseImage")}
            description={
              <>
                <strong>{t("ImageOptional")}</strong> - {t("ImageOptionalDesc")}
              </>
            }
          />
          <Step
            title={t("FillAnswer")}
            description={
              <>
                {t("FillAnswerText")}: <strong>{t("AnswerA")}</strong>,{" "}
                <strong>{t("AnswerB")}</strong>,<strong>{t("AnswerC")}</strong>,{" "}
                <strong>{t("AnswerD")}</strong>.
                <br />
                {t("MarkCorrectAnswer")} {t("ClickSaveQuiz")}
              </>
            }
          />
        </Steps>
      );
    }

    if (helpType === "trueFalse") {
      return (
        <Steps
          current={currentStep}
          direction="vertical"
          onChange={onStepChange}
        >
          {commonSteps.map((step, index) => (
            <Step
              key={index}
              title={step.title}
              description={step.description}
            />
          ))}
          <Step
            title={t("ChooseImage")}
            description={
              <>
                <strong>{t("ImageOptional")}</strong> - {t("ImageOptionalDesc")}
              </>
            }
          />
          <Step
            title={t("ChooseTrueFalse")}
            description={
              <>
                {t("ChooseTrue")} {t("OrFalse")} {t("CorrectAnswer")}
                <br />
                {t("ClickSaveQuiz")}
              </>
            }
          />
        </Steps>
      );
    }
    if (helpType === "addExcel") {
      return (
        <Steps
          current={currentStep}
          direction="vertical"
          onChange={onStepChange}
        >
          {commonSteps.map((step, index) => (
            <Step
              key={index}
              title={step.title}
              description={step.description}
            />
          ))}
          <Step
            title={t("AddFromExcel")}
            description={
              <>
                <strong>{t("ExcelFile")}</strong> - {t("ExcelFileForm")}
                <img
                  src={ExcelDemo}
                  alt="Excel Template Example"
                  onClick={handleImageClick} // Add click handler
                
                />
                <Modal
                  visible={isImageModalVisible}
                  footer={null}
                  onCancel={closeImageModal}
                  width={800}
                  centered
                >
                  <img
                    src={ExcelDemo}
                    alt="Enlarged Excel Template Example"
                    style={{ width: "200%", height: "auto" }}
                  />
                </Modal>
              </>
            }
          />
          ;
          <Step
            title={t("Save")}
            description={
              <>
                <strong>{t("Save")}</strong> - {t("SaveExcel")}
                <br />
                {t("ClickSaveQuiz")}
              </>
            }
          />
        </Steps>
      );
    }
    

    return null;
  };

  return (
    <div className="tutorial-container">
      <h2>{t("tutorial")}</h2>
      <p>
        {t("choice3")}: '{t("Define")}', '{t("MultiChoice")}' {t("or")}'
        {t("TrueFalse")}'.
      </p>

      <div className="button-container">
        <Button
          type="primary"
          onClick={() => showHelp("defineTerm")}
          className="help-button define"
        >
          {t("Define")}
        </Button>
        <div className="line-divider"></div>
        <Button
          type="primary"
          onClick={() => showHelp("multiChoice")}
          className="help-button multi"
        >
          {t("MultiChoice")}
        </Button>
        <div className="line-divider"></div>
        <Button
          type="primary"
          onClick={() => showHelp("trueFalse")}
          className="help-button true-false"
        >
          {t("TrueFalse")}
        </Button>
        <div className="line-divider"></div>
        <Button
          type="primary"
          onClick={() => showHelp("addExcel")}
          className="help-button add-excel"
        >
          {t("AddtoExcel")}
        </Button>
      </div>

      <Modal
        title={t("tutorial")}
        visible={isHelpVisible}
        onCancel={closeHelp}
        
        footer={[
          <Button key="close" onClick={closeHelp}>
            {t("Close")}
          </Button>,
        ]}
        width={600}
      >
        {renderSteps()}
      </Modal>
    </div>
  );
};

export default Tutorial;
