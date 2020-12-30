import React, { useState } from "react";
import "./App.css";
import AppRoutes from "./AppRoutes";
import { Sidebar } from "./elements";

import { Layout, Menu, Breadcrumb, Button } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { useParams, useHistory } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function App() {
  let history = useHistory();
  return (
    <div>
      <Layout style={{ minHeight: "100vh", backgroundColor: "pink" }}>
        <Sidebar />
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            <Button
              type="primary"
              className="d-flex p-2 align-items-center"
              onClick={() => {
                history.goBack();
              }}
              style={{ margin: 10 }}
            >
              {/* <PlusOutlined /> Print */}
              Back
            </Button>
          </Header>
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}></Breadcrumb>
            {/* <div
                            className="site-layout-background"
                            style={{
                                margin: "16px 0",
                                padding: 24,
                                minHeight: 360,
                            }}
                        >
                            Bill is a cat.
                            
                        </div> */}
            <AppRoutes />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Framadhan ©2020 Created by Fauzan Ramadhan
          </Footer>
        </Layout>

        {/* <AppRoutes /> */}
      </Layout>
    </div>
  );
}

export default App;
