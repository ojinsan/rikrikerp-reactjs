import React, { useState, useEffect } from "react";
import { HSTable, HSForm, HSWilayahTahunSelector } from "../../elements";

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
    const [wilayahProject, setWilayahProject] = useState(null);
    const [tahun, setTahun] = useState(null);

    return (
        <>
            <HSWilayahTahunSelector
                onWilayahChangeValue={(value) => {
                    setWilayahProject(value);
                }}
                onTahunChangeValue={(value) => {
                    setTahun(value);
                }}
            />

            <div className="d-flex justify-content-between align-items-center">
                <h4>This is HS</h4>
                {tahun && wilayahProject && (
                    <Button
                        type="primary"
                        className="d-flex p-2 align-items-center"
                        onClick={() => {
                            setShowHSForm(!showHSForm);
                        }}
                    >
                        <PlusOutlined /> New HS Record
                    </Button>
                )}
            </div>

            {tahun && wilayahProject && (
                <HSTable tahun={tahun} wilayahProject={wilayahProject} />
            )}

            {tahun && wilayahProject && (
                <HSForm
                    tahun={tahun}
                    wilayahProject={wilayahProject}
                    showDrawer={() => {
                        setShowHSForm(true);
                    }}
                    onClose={() => {
                        setShowHSForm(false);
                    }}
                    visible={showHSForm}
                />
            )}
        </>
    );
};

export default HS;
