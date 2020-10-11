import React from "react";

import { Layout, Menu, Breadcrumb } from "antd";
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";

import { Link, useLocation } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar = (props) => {
    const [collapsed, changeCollapsed] = React.useState(false);
    const onCollapse = (collapsed) => {
        changeCollapsed(collapsed);
    };
    const location = useLocation();
    console.log("Sidebar");
    console.log(location.pathname);
    return (
        <>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={onCollapse}
                style={{ backgroundColor: "white" }}
            >
                <div className="logo" />
                <Menu
                    theme="white"
                    defaultSelectedKeys={[location.pathname]}
                    mode="inline"
                >
                    <Menu.Item key="/dashboard" icon={<PieChartOutlined />}>
                        <Link to="/dashboard">Dashboard</Link>
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<UserOutlined />} title="Project">
                        <Menu.Item key="/project">
                            <Link to="/project">Project</Link>
                        </Menu.Item>
                        <Menu.Item key="/project/rab-project-bagian">
                            <Link to="/project/rab-project-bagian">
                                RAB Project Bagian
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/project/rab">
                            <Link to="/project/rab">RAB</Link>
                        </Menu.Item>
                        <Menu.Item key="/project/ahs-project">
                            <Link to="/project/ahs-project">AHS Project</Link>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="sub2"
                        icon={<TeamOutlined />}
                        title="Data Source"
                    >
                        <Menu.Item
                            key="/ahs-sumber"
                            icon={<PieChartOutlined />}
                        >
                            <Link to="/ahs-sumber">AHS Sumber</Link>
                        </Menu.Item>
                        <Menu.Item key="/hs">
                            <Link to="/hs">Harga Satuan</Link>
                        </Menu.Item>
                        <Menu.Item key="/wilayah">
                            <Link to="/wilayah">Wilayah</Link>
                        </Menu.Item>
                    </SubMenu>
                    {/* <Menu.Item key="9" icon={<FileOutlined />} /> */}
                </Menu>
            </Sider>
        </>
    );
};

export default Sidebar;
