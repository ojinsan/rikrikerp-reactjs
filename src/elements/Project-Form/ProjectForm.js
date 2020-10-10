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
    Collapse,
    List,
} from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

// IMPORT: Utilities
import { globalVariable } from "../../utils/global-variable";

// IMPORT: Other Components
import { LoadingSpinner } from "../../components";

// SETUP: Initial
const hostname = globalVariable("backendAddress");
const { Option } = Select;
const { Panel } = Collapse;
var Pform = null; // form reference

// ===================== MAIN COMPONENT ====================
const ProjectForm = (props) => {
    const [namaProject, setNamaProject] = useState("");
    const [wilayahProject, setWilayahProject] = useState("");
    const [tahun, setTahun] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setNamaProject("");
        setWilayahProject("");
        setTahun("");
        Pform.resetFields();
    };

    const onSubmit = () => {
        const project = {
            ID_WILAYAH: wilayahProject,
            NAMA_PROJECT: namaProject,
        };

        Pform.validateFields(["namaProject", "wilayahProject", "tahun"])
            .then(async (valid) => {
                console.log("entry valid");
                setIsLoading(true);
                try {
                    const response = await fetch(
                        hostname + "/project/post-new-project?TAHUN=2010",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(project),
                        }
                    );
                    if (response.ok) {
                        const responseBody = await response.json();
                        console.log(responseBody);
                        resetForm();
                        props.onClose();
                    }
                } catch (err) {
                    alert(err.message);
                    console.log(err);
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <Drawer
                title="Create New Project Record"
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
                        Pform = el;
                    }}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="namaProject"
                                label="Nama Project"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nama project harus terisi",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Masukan uraian"
                                    onChange={(e) =>
                                        setNamaProject(e.target.value)
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="wilayahProject"
                                label="Wilayah Project"
                                rules={[
                                    {
                                        required: true,
                                        message: "Wilayah Project harus terisi",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Select"
                                    onChange={(e) => setWilayahProject(e)}
                                >
                                    <Option value="1">Jakarta</Option>
                                    <Option value="2">Bandung</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="tahun"
                                label="Tahun"
                                rules={[
                                    {
                                        required: true,
                                        message: "Tahun harus terisi",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Select"
                                    onChange={(e) => setTahun(e)}
                                >
                                    <Option value="2010">2010</Option>
                                    <Option value="2011">2011</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    );
};

export default ProjectForm;
