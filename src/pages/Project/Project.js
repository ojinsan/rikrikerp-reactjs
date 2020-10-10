import React, { useState } from "react";
import { ProjectForm } from "../../elements";

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

const Project = () => {
    const [showProjectForm, setShowProjectForm] = useState(false);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h4>This is List of Projects Page</h4>
                <Button
                    type="primary"
                    className="d-flex p-2 align-items-center"
                    onClick={() => {
                        setShowProjectForm(!showProjectForm);
                    }}
                >
                    <PlusOutlined /> New Projects
                </Button>
            </div>
            <ProjectForm
                showDrawer={() => {
                    setShowProjectForm(true);
                }}
                onClose={() => {
                    setShowProjectForm(false);
                }}
                visible={showProjectForm}
            />
        </>
    );
};

export default Project;
