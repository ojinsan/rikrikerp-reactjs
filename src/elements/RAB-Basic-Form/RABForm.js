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

// "ID_RAB_PROJECT_BAGIAN"  : 1,
//     "ITEM_PEKERJAAN"  : "Pengecoran jalan",
//     "NO_URUT_1"  : "1",
//     "NO_URUT_2"  : "1",
//     "NO_URUT_3"  : "1",
//     "NO_URUT_4"  : "1",
//     "NO_URUT_5"  : "1",
//     "DETAIL"  : "2",

//     "AHS_UTAMA_PROJECT_ID"  : "1",
//     "SATUAN"  : "m",
//     "VOLUME"  : "20",
//     "UPAH_NON_TDP"  : true,
//     "BAHAN_NON_TDP"  : false,
//     "PM"  : false

const RABForm = (props) => {
    // const pro = {
    //     ID_RAB_PROJECT_BAGIAN: 1,
    //     ITEM_PEKERJAAN: "Pengecoran jalan",
    //     NO_URUT_1: "1",
    //     NO_URUT_2: "1",
    //     NO_URUT_3: "1",
    //     NO_URUT_4: "1",
    //     NO_URUT_5: "1",
    //     DETAIL: "2",

    //     AHS_UTAMA_PROJECT_ID: "1",
    //     SATUAN: "m",
    //     VOLUME: "20",
    //     UPAH_NON_TDP: true,
    //     BAHAN_NON_TDP: false,
    //     PM: false,
    // };
    const idRabProjectBagian = 1;

    //const [idRabProjectBagian, setIdRabProjectBagian] = useState("")
    const [itemPekerjaan, setItemPekerjaan] = useState("");
    const [noUrut1, setNoUrut1] = useState("");
    const [noUrut2, setNoUrut2] = useState("");
    const [noUrut3, setNoUrut3] = useState("");
    const [noUrut4, setNoUrut4] = useState("");
    const [noUrut5, setNoUrut5] = useState("");
    const [detail, setDetail] = useState("");
    const [ahsUtamaProjectId, setAhsUtamaProjectId] = useState("");
    const [satuan, setSatuan] = useState("");
    const [volume, setVolume] = useState("");
    const [upahNonTdp, setUpahNonTdp] = useState(true);
    const [bahanNonTdp, setBahanNonTdp] = useState(false);
    const [pm, setPm] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setItemPekerjaan("");
        setNoUrut1("");
        setNoUrut2("");
        setNoUrut3("");
        setNoUrut4("");
        setNoUrut5("");
        setDetail("");
        setAhsUtamaProjectId("");
        setSatuan("");
        setVolume("");
        setUpahNonTdp(true);
        setBahanNonTdp(false);
        setPm(false);
        Pform.resetFields();
    };

    const onSubmit = () => {
        const project = {
            ITEM_PEKERJAAN: itemPekerjaan,
            NO_URUT_1: noUrut1,
            NO_URUT_2: noUrut2,
            NO_URUT_3: noUrut3,
            NO_URUT_4: noUrut4,
            NO_URUT_5: noUrut5,
            DETAIL: detail,
            AHS_UTAMA_PROJECT_ID: ahsUtamaProjectId,
            SATUAN: satuan,
            VOLUME: volume,
            UPAH_NON_TDP: upahNonTdp,
            BAHAN_NON_TDP: bahanNonTdp,
            PM: pm,
        };

        Pform.validateFields([
            "itemPekerjaan",
            "noUrut1",
            "noUrut2",
            "noUrut3",
            "noUrut4",
            "noUrut5",
            "detail",
            "ahsUtamaProjectId",
            "satuan",
            "volume",
            "upahNonTdp",
            "bahanNonTdp",
            "pm",
        ])
            .then(async (valid) => {
                console.log("entry valid");
                setIsLoading(true);
                try {
                    const response = await fetch(
                        hostname +
                            "/project/post-new-rab-judul-detail?TAHUN=" +
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

    //     itemPekerjaan
    // noUrut1
    // noUrut2
    // noUrut3
    // noUrut4
    // noUrut5
    // detail
    // ahsUtamaProjectId
    // satuan
    // volume
    // upahNonTdp
    // bahanNonTdp
    // pm
    return (
        <div>
            <Drawer
                title="Create New RAB Record"
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
                                name="itemPekerjaan"
                                label="Item Pekerjaan"
                                rules={[
                                    {
                                        required: true,
                                        message: "Item pekerjaan harus terisi",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Masukan item pekerjaan"
                                    onChange={(e) =>
                                        setItemPekerjaan(e.target.value)
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item
                                name="nomorUrut1"
                                label="Nomor Urut 1"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nomor urut harus terisi",
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder="Masukan no Urut 1"
                                    onChange={(e) => setNoUrut1(e)}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                name="nomorUrut2"
                                label="Nomor Urut 2"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nomor urut harus terisi",
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder="Masukan no Urut 2"
                                    onChange={(e) => setNoUrut2(e)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="nomorUrut3"
                                label="Nomor Urut 3"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nomor urut harus terisi",
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder="Masukan no Urut 3"
                                    onChange={(e) => setNoUrut3(e)}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                name="nomorUrut4"
                                label="Nomor Urut 4"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nomor urut harus terisi",
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder="Masukan no Urut 4"
                                    onChange={(e) => setNoUrut4(e)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={4}>
                            <Form.Item
                                name="detail"
                                label="Jumlah Detail"
                                rules={[
                                    {
                                        required: true,
                                        message: "Jumlah Detail Harus Terisi",
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder="Masukan jumlah detail"
                                    onChange={(e) => setDetail(e)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="satuan"
                                label="Satuan"
                                rules={[
                                    {
                                        required: true,
                                        message: "Satuan harus terisi",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Satuan"
                                    onChange={(e) => setSatuan(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="volume"
                                label="Volume"
                                rules={[
                                    {
                                        required: true,
                                        message: "Masukan volume",
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder="Masukan nilai volume"
                                    onChange={(e) => setVolume(e)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="upahNonTdp"
                                label="Upah Non Tdp"
                                rules={[
                                    {
                                        required: true,
                                        message: "Pilihan harus terisi",
                                    },
                                ]}
                                initialValue={true}
                            >
                                <Select
                                    placeholder="Pilih jenis"
                                    onChange={(e) => setUpahNonTdp(e)}
                                >
                                    <Option key="false" value={false}>
                                        TIDAK
                                    </Option>
                                    <Option key="true" value={true}>
                                        YA
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="bahanNonTdp"
                                label="Bahan Non Tdp"
                                rules={[
                                    {
                                        required: true,
                                        message: "Pilihan harus terisi",
                                    },
                                ]}
                                initialValue={false}
                            >
                                <Select
                                    placeholder="Pilih jenis"
                                    onChange={(e) => setBahanNonTdp(e)}
                                >
                                    <Option key="false" value={false}>
                                        TIDAK
                                    </Option>
                                    <Option key="true" value={true}>
                                        YA
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="pm"
                                label="PM"
                                rules={[
                                    {
                                        required: true,
                                        message: "PM harus terisi",
                                    },
                                ]}
                                initialValue={false}
                            >
                                <Select
                                    placeholder="Pilih PM"
                                    onChange={(e) => setPm(e)}
                                >
                                    <Option key="false" value={false}>
                                        TIDAK
                                    </Option>
                                    <Option key="true" value={true}>
                                        YA
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        {
                            //detail
                            // satuan
                            // volume
                            // upahNonTdp
                            // bahanNonTdp
                            // pm
                            //                 "itemPekerjaan",
                            // "noUrut1",
                            // "noUrut2",
                            // "noUrut3",
                            // "noUrut4",
                            // "noUrut5",
                            // "detail",
                            // "ahsUtamaProjectId",
                            // "satuan",
                            // "volume",
                            // "upahNonTdp",
                            // "bahanNonTdp",
                            // "pm",
                        }
                    </Row>
                </Form>
            </Drawer>
        </div>
    );
};

export default RABForm;
