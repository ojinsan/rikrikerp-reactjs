import React, { useState } from "react";

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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

// IMPORT: Utilities
import { globalVariable } from "../../utils/global-variable";

// IMPORT: Other Components

// SETUP: Initial
const hostname = globalVariable("backendAddress");
const { Option } = Select;

// ===================== MAIN COMPONENT ====================
const AHSSumberForm = (props) => {
    const [sumberAHS, setSumberAHS] = useState("");
    const [namaAHS, setNamaAHS] = useState("");
    const [nomorAHS, setNomorAHS] = useState("");
    const [satuanAHS, setSatuanAHS] = useState("");
    const [AHSkhusus, setAHSkhusus] = useState(false);

    console.log(AHSkhusus);

    const onSubmit = async () => {
        const ahs = {
            NAMA_AHS: namaAHS,
            NOMOR_AHS: nomorAHS,
            SUMBER_AHS: sumberAHS,
            SATUAN_AHS: satuanAHS,
            SCREENSHOT_AHS:
                "https://images.unsplash.com/photo-1566114560338-2cf0b11aecb8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3090&q=80",
            KHUSUS: AHSkhusus,
        };

        const response = await fetch(
            hostname + "/data-source/post-new-ahs-sumber-utama/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ahs),
            }
        );
        const responseBody = await response.json();
        console.log(responseBody);
    };

    return (
        <>
            <Drawer
                title="Create a new AHS"
                width={720}
                onClose={props.onClose}
                visible={props.visible}
                bodyStyle={{ paddingBottom: 80 }}
                footer={
                    <div
                        style={{
                            textAlign: "right",
                        }}
                    >
                        <Button
                            onClick={props.onClose}
                            style={{ marginRight: 8 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                onSubmit().then(() => {
                                    props.onClose();
                                });
                            }}
                            type="primary"
                        >
                            Submit
                        </Button>
                    </div>
                }
            >
                <Form layout="vertical" hideRequiredMark>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="sumberAHS"
                                label="Sumber AHS"
                                rules={[
                                    {
                                        required: true,
                                        message: "Sumber AHS harus terisi",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Masukan sumber AHS"
                                    onChange={(e) =>
                                        setSumberAHS(e.target.value)
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="namaAHS"
                                label="Nama AHS"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nama AHS harus terisi",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Masukan nama AHS"
                                    onChange={(e) => setNamaAHS(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="nomorAHS"
                                label="Nomor AHS"
                                rules={[
                                    {
                                        required: true,
                                        message: "No AHS harus terisi",
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder="Bil. bulat"
                                    onChange={(e) => setNomorAHS(e)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="satuanAHS"
                                label="Satuan AHS"
                                rules={[
                                    {
                                        required: true,
                                        message: "Satuan AHS harus terisi",
                                    },
                                ]}
                            >
                                <Input
                                    style={{ width: "100%" }}
                                    placeholder="Satuan"
                                    onChange={(e) =>
                                        setSatuanAHS(e.target.value)
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="AHSkhusus"
                                label="AHS Khusus"
                                rules={[
                                    {
                                        required: true,
                                        message: "Silahkan pilih salah satu",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Select"
                                    onChange={(e) => setAHSkhusus(e)}
                                >
                                    <Option value="true">YA</Option>
                                    <Option value="false">TIDAK</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    );
};

export default AHSSumberForm;
