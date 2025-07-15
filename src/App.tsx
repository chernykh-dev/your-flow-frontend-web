// import React from "react";
import "antd/dist/reset.css";
import { ConfigProvider, Layout/*, Typography*/ } from "antd";
import TodoTree from "./components/TodoTree";

const { Header, Content } = Layout;

export default function App() {
  return (
      <ConfigProvider>
          <Layout>
              <Header style={{ color: "#fff", fontSize: 20 }}>Todo Checklist</Header>
              <Content style={{ padding: 20 }}>
                  <TodoTree />
              </Content>
          </Layout>
      </ConfigProvider>
  )
}
