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
var AHSform = null; // form reference
var AHSDform = null; // form reference

// ===================== MAIN COMPONENT ====================
const AHSSumberForm = (props) => {
    const [sumberAHS, setSumberAHS] = useState("");
    const [namaAHS, setNamaAHS] = useState("");
    const [nomorAHS, setNomorAHS] = useState("");
    const [satuanAHS, setSatuanAHS] = useState("");
    const [AHSkhusus, setAHSkhusus] = useState("");
    const [AHSDetails, setAHSDetails] = useState([]);

    const [namaAHSD, setNamaAHSD] = useState("");
    const [satuanAHSD, setSatuanAHSD] = useState("");
    const [kelompokAHSD, setKelompokAHSD] = useState("");
    const [koefisienAHSD, setKoefisienAHSD] = useState("");
    const [kodeUraianAHSD, setKodeUraianAHSD] = useState("");
    const [deskripsiAHSD, setDeskripsiAHSD] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setSumberAHS("");
        setNamaAHS("");
        setNomorAHS("");
        setSatuanAHS("");
        setAHSkhusus(null);

        setNamaAHSD("");
        setSatuanAHSD("");
        setKelompokAHSD("");
        setKoefisienAHSD("");
        setDeskripsiAHSD("");
        AHSform.resetFields();
        //AHSDform.resetFields();
        console.log(AHSDform);
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
            AHSDetails: AHSDetails,
        };

        AHSform.validateFields([
            "namaAHS",
            "sumberAHS",
            "satuanAHS",
            "nomorAHS",
            "AHSkhusus",
        ])
            .then(async (x) => {
                // Start sednding
                setIsLoading(true);
                console.log("success validating: ");
                console.log(x);
                try {
                    const response = await fetch(
                        hostname +
                            "/data-source/post-new-ahs-sumber-utama-detail/",
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
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onAddAHSD = () => {
        const AHSDetailsTemp = JSON.parse(JSON.stringify(AHSDetails));
        AHSDetailsTemp.push({
            URAIAN: namaAHSD,
            KODE_URAIAN: kodeUraianAHSD,
            KELOMPOK_URAIAN: kelompokAHSD,
            SATUAN_URAIAN: satuanAHSD,
            KOEFISIEN_URAIAN: koefisienAHSD,
            KETERANGAN_URAIAN: deskripsiAHSD,
        });
        setAHSDetails(AHSDetailsTemp);
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
                <Collapse
                    key="1"
                    defaultActiveKey={["1"]}
                    bordered={false}
                    expandIconPosition={"right"}
                    ghost
                    onChange={() => {
                        console.log("On Change");
                    }}
                >
                    <Panel header={<h4>Data AHS Utama</h4>} key="1">
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
                                                message:
                                                    "Sumber AHS harus terisi",
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
                                                message:
                                                    "Nama AHS harus terisi",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Masukan nama AHS"
                                            onChange={(e) =>
                                                setNamaAHS(e.target.value)
                                            }
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
                                        <Input
                                            style={{ width: "100%" }}
                                            placeholder="Nomor"
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
                                                message:
                                                    "Satuan AHS harus terisi",
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
                                                message:
                                                    "Silahkan pilih salah satu",
                                            },
                                        ]}
                                        initialValue={false}
                                    >
                                        <Select
                                            placeholder="Select"
                                            onChange={(e) => setAHSkhusus(e)}
                                            //value={AHSkhusus}
                                            //defaultValue={AHSkhusus}
                                        >
                                            <Option value={true}>YA</Option>
                                            <Option value={false}>TIDAK</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Panel>
                </Collapse>

                {/* AHS Detail Form */}
                {AHSkhusus == false && (
                    <Collapse
                        key="2"
                        defaultActiveKey={["1"]}
                        ghost
                        expandIconPosition={"right"}
                        onChange={() => {
                            console.log("On Change");
                        }}
                    >
                        <Panel header={<h4>Data AHS Detail</h4>} key="1">
                            <Form
                                layout="vertical"
                                hideRequiredMark
                                ref={(al) => {
                                    AHSDform = al;
                                }}
                            >
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            name="namaAHSD"
                                            label="Uraian AHS Detail"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Nama uraian harus terisi",
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Masukan nama AHS"
                                                onChange={(e) =>
                                                    setNamaAHSD(e.target.value)
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Form.Item
                                            name="kodeUraianAHSD"
                                            label="Kode Uraian"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Satuan AHS Detail harus terisi",
                                                },
                                            ]}
                                        >
                                            <Input
                                                style={{ width: "100%" }}
                                                placeholder="Satuan"
                                                value={satuanAHS}
                                                onChange={(e) =>
                                                    setKodeUraianAHSD(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name="satuanAHSD"
                                            label="Satuan AHS Detail"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Satuan AHS Detail harus terisi",
                                                },
                                            ]}
                                        >
                                            <Input
                                                style={{ width: "100%" }}
                                                placeholder="Satuan"
                                                value={satuanAHS}
                                                onChange={(e) =>
                                                    setSatuanAHSD(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name="koefisienAHSD"
                                            label="Koefisien AHS Detail"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "No AHS harus terisi",
                                                },
                                            ]}
                                        >
                                            <InputNumber
                                                style={{ width: "100%" }}
                                                placeholder="Bil. bulat"
                                                value={nomorAHS}
                                                onChange={(e) =>
                                                    setKoefisienAHSD(e)
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            name="kelompokAHSD"
                                            label="Kelompok AHS Detail"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Silahkan pilih salah satu",
                                                },
                                            ]}
                                        >
                                            <Select
                                                placeholder="Select"
                                                onChange={(e) =>
                                                    setKelompokAHSD(e)
                                                }
                                            >
                                                <Option value="Upah">
                                                    Upah
                                                </Option>
                                                <Option value="Bahan">
                                                    Bahan
                                                </Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            name="deskripsiAHSD"
                                            label="Description"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "please enter url description",
                                                },
                                            ]}
                                        >
                                            <Input.TextArea
                                                rows={4}
                                                placeholder="please enter url description"
                                                onChange={(e) =>
                                                    setDeskripsiAHSD(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                            <Button
                                onClick={() => {
                                    console.log("hei");
                                    onAddAHSD();
                                }}
                                style={{ marginRight: 8 }}
                            >
                                Add
                            </Button>
                        </Panel>

                        {AHSDetails.map((item, index) => (
                            <div key={index}>
                                {item.KODE_URAIAN +
                                    " " +
                                    item.KELOMPOK_URAIAN +
                                    " " +
                                    item.URAIAN +
                                    " - " +
                                    item.KOEFISIEN_URAIAN +
                                    " - " +
                                    item.SATUAN_URAIAN}
                            </div>
                        ))}
                        {/* <List
                            itemLayout="horizontal"
                            dataSource={AHSDetails}
                            renderItem={(AHSdetails) => (
                                <List.Item key={AHSdetails.namaAHSD}>
                                    <List.Item.Meta
                                        title={<a>{AHSdetails.namaAHSD}</a>}
                                        description={toString(
                                            AHSdetails.satuanAHSD +
                                                " - " +
                                                AHSdetails.koefisienAHSD +
                                                " - " +
                                                AHSdetails.kelompokAHSD
                                        )}
                                    />
                                </List.Item>
                            )}
                        /> */}
                    </Collapse>
                )}
            </Drawer>
        </div>
    );
};

export default AHSSumberForm;
