// import React from "react";
import "antd/dist/reset.css";
import { ConfigProvider, Layout/*, Typography*/ } from "antd";
import TodoTree from "./components/TodoTree";

const { Header, Content } = Layout;

/*
          <Layout style={{minHeight: "100vh"}}>
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
 */

export default function App() {
  return (
      <ConfigProvider>
          <div className="min-h-screen flex flex-col">
              <header className="bg-blue-600 text-white text-lg font-semibold text-center py-4">
                  Todo Checklist
              </header>
              <main className="flex-grow p-4 max-w-2xl mx-auto w-full">
                  <TodoTree/>
              </main>
          </div>
      </ConfigProvider>
  )
}
