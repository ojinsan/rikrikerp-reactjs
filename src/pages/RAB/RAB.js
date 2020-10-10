import React, { useState } from "react";
import ProjectForm from "../../elements/Project-Form/ProjectForm";

// IMPORT: Material Kit from ant-design
import {
    Drawer,
    Form,
    Button,
    Col,
    Row,
    Input,
    Select,
    DatePicker,
    InputNumber,
    Spin,
    Collapse,
    List,
} from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

const RAB = () => {
    const [showRABForm, setShowRABForm] = useState(false);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h4>This is List of Projects Page</h4>
                <Button
                    type="primary"
                    className="d-flex p-2 align-items-center"
                    onClick={() => {
                        setShowRABForm(!showRABForm);
                    }}
                >
                    <PlusOutlined /> New Projects
                </Button>
            </div>
            <ProjectForm
                showDrawer={() => {
                    setShowRABForm(true);
                }}
                onClose={() => {
                    setShowRABForm(false);
                }}
                visible={showRABForm}
            />
        </>
    );
};

export default RAB;
