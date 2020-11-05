import React, { useState } from "react";
import "./App.css";
import AppRoutes from "./AppRoutes";
import { Sidebar } from "./elements";

import { Layout, Menu, Breadcrumb } from "antd";
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function App() {
    return (
        <div>
            <Layout style={{ minHeight: "100vh", backgroundColor: "pink" }}>
                <Sidebar />
                <Layout className="site-layout">
                    <Header
                        className="site-layout-background"
                        style={{ padding: 0 }}
                    >
                        This is header
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
