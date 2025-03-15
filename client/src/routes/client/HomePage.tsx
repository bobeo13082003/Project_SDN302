import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../../pages/client/home/page";
import Library from "../../pages/client/homeAuth/Library";
import CardContent from "../../pages/client/homeAuth/Card";
import Not from "../../pages/client/homeAuth/Notification";
import FlashCard from "../../pages/client/homeAuth/FlashCard";
<<<<<<< HEAD
import Explanations from "../../pages/client/homeAuth/Explanations";
import Card  from "../../pages/client/homeAuth/Card";
import QuizletExamList1 from "../../quiz/TestQuestion/Question";
=======
import Explanations from "../../pages/client/homeAuth/BlogPage";
import HomeQuizList from "../../pages/client/homeAuth/HomeQuizList";
>>>>>>> ab45c2fde53531fa4155d29f98cbb608bf25e450

const HomePage = () => {
  return (
    <Routes>
      <Route path="/home" element={<HomeQuizList />} />
      <Route path="/library" element={<Library />} />
      <Route path="/card" element={<CardContent />} />
      <Route path="/notifications" element={<Not />} />
      <Route path="/flash-card" element={<FlashCard />} />
      <Route path="/explanations" element={<Explanations />} />

    </Routes>
  );
};

export default HomePage;
