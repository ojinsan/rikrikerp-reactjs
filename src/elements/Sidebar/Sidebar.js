import React from "react";

import { Layout, Menu, Breadcrumb } from "antd";
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";

import { Link } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar = (props) => {
    const [collapsed, changeCollapsed] = React.useState(false);
    const onCollapse = (collapsed) => {
        changeCollapsed(collapsed);
    };
    console.log("Sidebar");
    return (
        <>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={onCollapse}
                style={{ backgroundColor: "white" }}
            >
                <div className="logo" />
                <Menu theme="white" defaultSelectedKeys={["1"]} mode="inline">
                    <Menu.Item key="1" icon={<PieChartOutlined />}>
                        <Link to="/dashboard">Dashboard</Link>
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<UserOutlined />} title="Project">
                        <Menu.Item key="2">
                            <Link to="/project">Project</Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to="/project/rab-project-bagian">
                                RAB Project Bagian
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Link to="/project/ahs-project">AHS Project</Link>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="sub2"
                        icon={<TeamOutlined />}
                        title="Data Source"
                    >
                        <Menu.Item key="5" icon={<PieChartOutlined />}>
                            <Link to="/ahs-sumber">AHS Sumber</Link>
                        </Menu.Item>
                        <Menu.Item key="6">
                            <Link to="/hs">Harga Satuan</Link>
                        </Menu.Item>
                    </SubMenu>
                    {/* <Menu.Item key="9" icon={<FileOutlined />} /> */}
                </Menu>
            </Sider>
        </>
    );
};

export default Sidebar;
