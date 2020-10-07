import React, { useState, useEffect } from "react";
import { HSTable, HSForm } from "../../elements";

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

const HS = (props) => {
    const [showHSForm, setShowHSForm] = useState(false);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h4>This is HS</h4>
                <Button
                    type="primary"
                    className="d-flex p-2 align-items-center"
                    onClick={() => {
                        setShowHSForm(!showHSForm);
                    }}
                >
                    <PlusOutlined /> New HS Record
                </Button>
            </div>
            <HSForm
                showDrawer={() => {
                    setShowHSForm(true);
                }}
                onClose={() => {
                    setShowHSForm(false);
                }}
                visible={showHSForm}
            />
            <HSTable />
        </>
    );
};

export default HS;
