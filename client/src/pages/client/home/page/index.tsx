import { Button } from "antd";
import HomeContent from "../components/HomeContent";
import SwiperSlider from "../components/SwiperSlider";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Home() {
  const { t } = useTranslation('home');
  return (
    <div style={{ width: "100%" }}>
      <div className="first text-center " style={{ padding: "10% 0 5% 0" }}>
        <h1>{t("how do you want to learn")}</h1>
        <p>{t("master what you're leanring")}</p>
        <Link to="/register">
          <Button type="primary" className="button">
            {t("sign up free")}
          </Button>
        </Link>
        <br />
      </div>
      <SwiperSlider />
      <div
        className="main"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ width: "100%" }}>
            <div
              style={{
                marginTop: "50px",
                marginBottom: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            ></div>

            <HomeContent
              title={t("every class, every test ,one ultimate learning app")}
              image="https://img.freepik.com/free-photo/still-life-books-versus-technology_23-2150063039.jpg?semt=ais_hybrid"
              content={t("create your own flashcards")}
            />

            <HomeContent
              title={t("choose the way you want to learn")}
              image="https://img.freepik.com/free-photo/classroom-class-study-academic-schedule_53876-132153.jpg?semt=ais_hybrid"
              content={t("turn flashcards into")}
              rotate={true}
              button={
                <Button type="primary" className="button">
                  {t("begin")}
                </Button>
              }
            />

            <HomeContent
              title={t("prepare for exams for any subject")}
              image="https://img.freepik.com/free-photo/top-view-woman-working-bed_23-2149476736.jpg?semt=ais_hybrid"
              content={t("Remember everything")}
              button={
                <Button type="primary" className="button">
                  {t("begin")}
                </Button>
              }
            />

            <div className="home-content-last">
              <HomeContent
                title={t("Learn for free")}
                image="https://images.prismic.io/quizlet-web/ZpFqjB5LeNNTxHvk_teacher-image-LOH.png?auto=format,compress"
                content={t("Help every student")}
                button={
                  <Button type="primary" className="button">
                    {t("register")}
                  </Button>
                }
              />
            </div>
          </div>

          <div style={{ height: 300 }}></div>
        </div>
      </div>
    </div>
  );
}
