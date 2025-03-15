import React, { useState } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const InputSearch: React.FC = () => {
  const [valueSearch, setValueSearch] = useState<string>("");
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueSearch(e.target.value.trim());
  };

  const handlePressEnter = () => {
    if (valueSearch) {
      navigate(`/search/${encodeURIComponent(valueSearch)}`);
    }
  };

  return (
    <Input
      value={valueSearch}
      onChange={handleSearch}
      onPressEnter={handlePressEnter}
      placeholder="Search for quizzes"
      style={{ width: "300px", textAlign: "center" }}
      prefix={<SearchOutlined />}
    />
  );
};

export default InputSearch;
