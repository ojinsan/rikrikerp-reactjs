import React, { useState } from "react";
import { AHSSumberForm } from "../../elements";
import {
    Drawer,
    Form,
    Button,
    Col,
    Row,
    Input,
    Select,
    DatePicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

const AHSSumber = (props) => {
    const [showAHSSumberForm, setShowAHSSumberForm] = useState(false);
    console.log(showAHSSumberForm);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h4>This is AHS Sumber</h4>
                <Button
                    type="primary"
                    className="d-flex p-2 align-items-center"
                    onClick={() => {
                        setShowAHSSumberForm(!showAHSSumberForm);
                    }}
                >
                    <PlusOutlined /> New AHS Sumber Record
                </Button>
            </div>
            <AHSSumberForm
                showDrawer={() => {
                    setShowAHSSumberForm(true);
                }}
                onClose={() => {
                    setShowAHSSumberForm(false);
                }}
                visible={showAHSSumberForm}
            />
        </>
    );
};

export default AHSSumber;
