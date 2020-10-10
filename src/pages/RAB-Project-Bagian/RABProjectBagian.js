import React, { useState } from "react";
import { RABProjectBagianForm } from "../../elements";

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

const RABProjectBagian = () => {
    const [showRABPBForm, setShowRABPBForm] = useState(false);

    return (
        <>
            <div className="d-flex flex-column justify-content-between align-items-center">
                <h4>This is RABProjectBagian</h4>
                <h6>
                    Disini nanti bisa ada dropdown project mana yang lagi
                    dikerjain
                </h6>
                <h6>bisa liat project mana yang dikerjain dari slug url</h6>

                <Button
                    type="primary"
                    className="d-flex p-2 align-items-center"
                    onClick={() => {
                        setShowRABPBForm(!showRABPBForm);
                    }}
                >
                    <PlusOutlined /> New RAB Project Bagian
                </Button>
            </div>
            <RABProjectBagianForm
                showDrawer={() => {
                    setShowRABPBForm(true);
                }}
                onClose={() => {
                    setShowRABPBForm(false);
                }}
                visible={showRABPBForm}
            />
        </>
    );
};

export default RABProjectBagian;
