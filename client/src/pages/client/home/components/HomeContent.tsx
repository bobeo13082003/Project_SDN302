import React from "react";
import { Row, Col, Typography } from "antd";

export interface IHomeContentProps {
  title: string;
  image: string;
  content: string;
  button?: React.ReactNode;
  rotate?: boolean;
}

export default React.memo(function HomeContent({
  title,
  image,
  content,
  button,
  rotate,
}: IHomeContentProps) {
  const isMedium = window.matchMedia("(min-width: 768px)").matches;
  return (
    <Row
      gutter={[16, 16]}
      justify="center"
      align="middle"
      style={{
        flexDirection: isMedium
          ? !rotate
            ? "row"
            : "row-reverse"
          : "column-reverse",
      }}
    >
      <Col
        sm={12}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

        }}
      >
        <div
          style={{
            padding: isMedium ? "10px 80px" : "10px 60px",
          }}
        >
          <Typography.Title
            level={2}
            style={{ marginBottom: "24px", fontWeight: "bold", color: 'inherit' }}
          >
            {title}
          </Typography.Title>

          <div> <Typography.Text style={{ fontSize: 20, fontWeight: 400, color: 'inherit' }}>
            {content}
            <div>{button}</div>
          </Typography.Text></div>

        </div>
      </Col>
      <Col sm={12}>
        <div style={{ padding: isMedium ? "60px" : "40px" }}>
          <img width="100%" src={image} alt={title} />
        </div>
      </Col>
    </Row>
  );
});
