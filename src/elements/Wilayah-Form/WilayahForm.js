import React, { useState } from "react";
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

// IMPORT: Utilities
import { globalVariable } from "../../utils/global-variable";

// IMPORT: Other Components
import { LoadingSpinner } from "../../components";

// SETUP: Initial
const hostname = globalVariable("backendAddress");
const { Option } = Select;
const { Panel } = Collapse;
var Wform = null; // form reference

// "WILAYAH":"Tubagus Ismail",
//     "DIVRE_DAOP":"Cimahi",
//     "KECAMATAN":"Cimindi",
//     "KABUPATEN_KOTAMADYA":"Bandung",
//     "PROVINSI":"Jawa Barat"

const WilayahForm = (props) => {
    const [wilayah, setWilayah] = useState("");
    const [divreDaop, setDivreDaop] = useState("");
    const [kecamatan, setKecamatan] = useState("");
    const [kabupatenKotamadya, setKabupatenKotamadya] = useState("");
    const [provinsi, setProvinsi] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setWilayah("");
        setDivreDaop("");
        setKecamatan("");
        setKabupatenKotamadya("");
        setProvinsi("");
        Wform.resetFields();
    };

    const onSubmit = () => {
        const wilayahdata = {
            WILAYAH: wilayah,
            DIVRE_DAOP: divreDaop,
            KECAMATAN: kecamatan,
            KABUPATEN_KOTAMADYA: kabupatenKotamadya,
            PROVINSI: provinsi,
        };

        Wform.validateFields(["wilayah"])
            .then(async (valid) => {
                console.log("entry valid");
                setIsLoading(true);
                try {
                    const response = await fetch(
                        hostname + "/base/post-new-wilayah",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(wilayahdata),
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
                title={
                    "Create New Wilayah Record," +
                    props.tahun +
                    " " +
                    props.wilayahProject
                }
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
                        Wform = el;
                    }}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="wilayah"
                                label="Nama Wilayah"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nama wilayah harus terisi",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Masukan nama wilayah"
                                    onChange={(e) => setWilayah(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="divreDaop"
                                label="DivreDaop"
                                rules={[
                                    {
                                        required: false,
                                        message: "Uraian harus terisi",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Masukan nama wilayah"
                                    onChange={(e) =>
                                        setDivreDaop(e.target.value)
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="kecamatan"
                                label="Kecamatan"
                                rules={[
                                    {
                                        required: false,
                                        message: "Uraian harus terisi",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Masukan nama Kecamatan"
                                    onChange={(e) =>
                                        setKecamatan(e.target.value)
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="kabupatenKotamadya"
                                label="Kabupaten / Kotamadya"
                                rules={[
                                    {
                                        required: false,
                                        message: "Uraian harus terisi",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Masukan nama kabupaten / kotamadya"
                                    onChange={(e) =>
                                        setKabupatenKotamadya(e.target.value)
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="provinsi"
                                label="Provinsi"
                                rules={[
                                    {
                                        required: false,
                                        message: "Uraian harus terisi",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Masukan nama provinsi"
                                    onChange={(e) =>
                                        setProvinsi(e.target.value)
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

export default WilayahForm;
