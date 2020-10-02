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
    Spin,
} from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

// IMPORT: Utilities
import { globalVariable } from "../../utils/global-variable";

// IMPORT: Other Components
import { LoadingSpinner } from "../../components";

// SETUP: Initial
const hostname = globalVariable("backendAddress");
const { Option } = Select;
var AHSform = null; // form reference

// ===================== MAIN COMPONENT ====================
const AHSSumberForm = (props) => {
    const [sumberAHS, setSumberAHS] = useState("");
    const [namaAHS, setNamaAHS] = useState("");
    const [nomorAHS, setNomorAHS] = useState("");
    const [satuanAHS, setSatuanAHS] = useState("");
    const [AHSkhusus, setAHSkhusus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setSumberAHS("");
        setNamaAHS("");
        setNomorAHS("");
        setSatuanAHS("");
        setAHSkhusus(null);
        AHSform.resetFields();
    };

    const onSubmit = () => {
        const ahs = {
            NAMA_AHS: namaAHS,
            NOMOR_AHS: nomorAHS,
            SUMBER_AHS: sumberAHS,
            SATUAN_AHS: satuanAHS,
            SCREENSHOT_AHS:
                "https://images.unsplash.com/photo-1566114560338-2cf0b11aecb8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3090&q=80",
            KHUSUS: AHSkhusus,
        };

        AHSform.validateFields([
            "namaAHS",
            "sumberAHS",
            "satuanAHS",
            "nomorAHS",
            "AHSkhusus",
        ]).then(async (x) => {
            setIsLoading(true);
            console.log("validating: ");
            console.log(x);
            try {
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
                if (response.ok) {
                    const responseBody = await response.json();
                    console.log(responseBody);
                    resetForm();
                    props.onClose();
                } else {
                    throw new Error(
                        "Gagal menyimpan dalam database. Status:" +
                            response.status
                    );
                }
            } catch (err) {
                alert(err); // TypeError: failed to fetch
                console.log(err);
            }
            setIsLoading(false);
        });
    };

    return (
        <div>
            <Drawer
                title="Create New AHS Record"
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
                        {isLoading ? (
                            <LoadingSpinner isOverlay={false} />
                        ) : (
                            <div>
                                <Button
                                    onClick={props.onClose}
                                    style={{ marginRight: 8 }}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    onClick={() => {
                                        onSubmit();
                                    }}
                                    type="primary"
                                >
                                    Submit
                                </Button>
                            </div>
                        )}
                    </div>
                }
            >
                <Form
                    layout="vertical"
                    hideRequiredMark
                    ref={(el) => {
                        AHSform = el;
                    }}
                >
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
                                    value={nomorAHS}
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
                                    value={satuanAHS}
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
                                    value={AHSkhusus}
                                >
                                    <Option value="true">YA</Option>
                                    <Option value="false">TIDAK</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </div>
    );
};

export default AHSSumberForm;
