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
const RABProjectBagian = (props) => {
    const [jenis, setJenis] = useState("");
    const [bagian, setBagian] = useState("");
    const [subBagian, setSubBagian] = useState("");
    const [idTtd, setIdTtd] = useState("");
    const [keteranganJudulRekap, setKeteranganJudulRekap] = useState("");
    const [jumlahRab, setJumlahRab] = useState("");
    const [keteranganBagBawahRab, setKeteranganBagBawahRab] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    // "ID_PROJECT": 1, //props
    // "JENIS": "Telkomunikasi",
    // "BAGIAN": "Nama Bagian",
    // "SUB_BAGIAN": "Nama Sub bagian",
    // "ID_TTD": 1,
    // "KETERANGAN_JUDUL_REKAP": "Keterangan judul rekap",
    // "JUMLAH_RAB": "JUMLAH_RAB",
    // "TOTAL_UPAH_TDP": "TOTAL_UPAH_TDP",
    // "TOTAL_BAHAN_TDP": "TOTAL_BAHAN_TDP",
    // "TOTAL_UPAH_NON_TDP": "TOTAL_UPAH_NON_TDP",
    // "TOTAL_BAHAN_NON_TDP": "TOTAL_BAHAN_NON_TDP",
    // "KETERANGAN_BAG_BAWAH_RAB": "Keterangan Bagian Bawah"

    const resetForm = () => {
        setJenis("");
        setBagian("");
        setSubBagian("");
        setIdTtd("");
        setKeteranganJudulRekap("");
        setJumlahRab("");
        setKeteranganBagBawahRab("");
        Pform.resetFields();
    };

    const onSubmit = () => {
        const project = {
            ID_PROJECT: props.PROJECT_ID, //props
            JENIS: jenis,
            BAGIAN: bagian,
            SUB_BAGIAN: subBagian,
            ID_TTD: 1, //later
            KETERANGAN_JUDUL_REKAP: keteranganJudulRekap,
            JUMLAH_RAB: jumlahRab,
            KETERANGAN_BAG_BAWAH_RAB: keteranganBagBawahRab,
        };

        Pform.validateFields(["jenis", "bagian", "subBagian"])
            .then(async (valid) => {
                console.log("entry valid");
                setIsLoading(true);
                try {
                    const response = await fetch(
                        hostname +
                            "/project/post-new-rab-project-bagian?TAHUN=" +
                            props.tahun,
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
                        props.dispatch({
                            type: "ACTION_SELECTED",
                            payload: {
                                option: "FETCH",
                                index: -1,
                                newData: {},
                                row: {},
                            },
                        });
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
                        <Col span={8}>
                            <Form.Item
                                name="jenis"
                                label="Jenis"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nama project harus terisi",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Pilih jenis"
                                    onChange={(e) => setJenis(e)}
                                >
                                    {["RAB", "BQQ"].map((name) => (
                                        <Option key={name} value={name}>
                                            {name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="bagian"
                                label="Bagian"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nama project harus terisi",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Pilih jenis"
                                    onChange={(e) => setBagian(e)}
                                >
                                    {[
                                        "Track",
                                        "Bangunan",
                                        "Bangunan Hikmat",
                                        "Mekanikal Elektrikal",
                                        "Sinyal",
                                        "Telekomunikasi",
                                        "Listrik Aliran Atas",
                                    ].map((name) => (
                                        <Option key={name} value={name}>
                                            {name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="subBagian"
                                label="Sub Bagian"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nama subbagian harus terisi",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Masukan sub bagian"
                                    onChange={(e) =>
                                        setSubBagian(e.target.value)
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="keteranganJudulRekap"
                                label="Keterangan Judul Rekap"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Keterangan Judul Rekap harus terisi",
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Masukan keterangan judul rekap"
                                    onChange={(e) =>
                                        setKeteranganJudulRekap(e.target.value)
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="keteranganBagBawahRab"
                                label="Keterangan Bagian Bawah RAB"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Keterangan Bagian Bawah harus terisi",
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Masukan keterangan bagian bawah"
                                    onChange={(e) =>
                                        setKeteranganBagBawahRab(e.target.value)
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    );
};

export default RABProjectBagian;
