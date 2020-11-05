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
var AHSDform = null; // form reference

const AHSSumberDetailForm = (props) => {
    const [AHSDetails, setAHSDetails] = useState(
        props.AHSDetails ? props.AHSDetails : []
    );
    const [namaAHSD, setNamaAHSD] = useState("");
    const [satuanAHSD, setSatuanAHSD] = useState("");
    const [kelompokAHSD, setKelompokAHSD] = useState("");
    const [koefisienAHSD, setKoefisienAHSD] = useState("");
    const [kodeUraianAHSD, setKodeUraianAHSD] = useState("");
    const [deskripsiAHSD, setDeskripsiAHSD] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setNamaAHSD("");
        setSatuanAHSD("");
        setKelompokAHSD("");
        setKoefisienAHSD("");
        setDeskripsiAHSD("");
        AHSDform.resetFields();
    };

    const onSubmit = async () => {
        // Check whether the form is from existing AHS
        // Back to AHS form if new
        console.log("on submit");
        if (props.isNewAHS) {
            props.setAHSDetails(AHSDetails);
            props.onClose();
        } else {
            if (AHSDetails) {
                try {
                    // Start sednding
                    const AHS_SUMBER_DETAILs = AHSDetails;
                    setIsLoading(true);
                    try {
                        console.log("submit to backend");
                        const response = await fetch(
                            hostname +
                                "/data-source/post-new-ahs-sumber-detail/",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    AHS_SUMBER_DETAILs: AHS_SUMBER_DETAILs,
                                    ID_AHS_SUMBER_UTAMA: props.AHSUtamaId,
                                }),
                            }
                        );
                        if (response.ok) {
                            console.log(
                                "berhasil ahs sumber detail form, response ok"
                            );
                            const responseBody = await response.json();
                            console.log(responseBody);
                            resetForm();
                            props.dispatch({
                                type: "ACTION_SELECTED",
                                payload: {
                                    option: "FETCH",
                                    index: -1,
                                    newData: {},
                                    row: {},
                                },
                            });
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
                } catch (err) {
                    console.log(err);
                }
            }
        }

        // Submit, if existing
        const AHSDetailsTemp = JSON.parse(JSON.stringify(AHSDetails));
    };

    const onAddAHSD = () => {
        const AHSDetailsTemp = JSON.parse(JSON.stringify(AHSDetails));
        AHSDform.validateFields([
            "namaAHSD",
            "kodeUraianAHSD",
            "kelompokAHSD",
            "satuanAHSD",
            "koefisienAHSD",
            "deskripsiAHSD",
        ]).then(() => {
            AHSDetailsTemp.push({
                URAIAN: namaAHSD,
                KODE_URAIAN: kodeUraianAHSD,
                KELOMPOK_URAIAN: kelompokAHSD,
                SATUAN_URAIAN: satuanAHSD,
                KOEFISIEN_URAIAN: koefisienAHSD,
                KETERANGAN_URAIAN: deskripsiAHSD,
            });
            setAHSDetails(AHSDetailsTemp);
        });
    };

    return (
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
                                Save
                            </Button>
                        </div>
                    )}
                </div>
            }
        >
            {/* AHS Detail Form */}

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
                                            message: "Nama uraian harus terisi",
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
                                        onChange={(e) =>
                                            setKodeUraianAHSD(e.target.value)
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
                                        onChange={(e) =>
                                            setSatuanAHSD(e.target.value)
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
                                            message: "No AHS harus terisi",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        placeholder="Bil. bulat"
                                        onChange={(e) => setKoefisienAHSD(e)}
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
                                        onChange={(e) => setKelompokAHSD(e)}
                                    >
                                        <Option value="Upah">Upah</Option>
                                        <Option value="Bahan">Bahan</Option>
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
                                            setDeskripsiAHSD(e.target.value)
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
        </Drawer>
    );
};

export default AHSSumberDetailForm;
