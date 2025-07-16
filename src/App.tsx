// import React from "react";
import "antd/dist/reset.css";
import { ConfigProvider, Layout/*, Typography*/ } from "antd";
import TodoTree from "./components/TodoTree";

const { Header, Content } = Layout;

export default function App() {
  return (
      <ConfigProvider>
          <Layout style={{ minHeight: "100vh" }}>
              <Header style={{
                  color: "#fff",
                  fontSize: 20,
                  textAlign: "center",
                  padding: "12px 16px",
              }}>Todo Checklist</Header>
              <Content style={{
                  padding: "16px",
                  maxWidth: 768,
                  margin: "0 auto",
                  width: "100%",
              }}>
                  <TodoTree />
              </Content>
          </Layout>
      </ConfigProvider>
  )
}
