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
var HSform = null; // form reference

// ===================== MAIN COMPONENT ====================
const HSForm = (props) => {
  const [uraian, setUraian] = useState("");
  const [satuan, setSatuan] = useState("");
  const [harga, setHarga] = useState("");
  const [type, setType] = useState("Bahan");
  const [idWilayah, setIdWilayah] = useState("");
  const [tahun, setTahun] = useState("");
  const [sumberHarga, setSumberHarga] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [screenshotHS, setScreenshotHS] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setUraian("");
    setSatuan("");
    setHarga("");
    setType("Bahan");
    setIdWilayah("");
    setTahun("");
    setSumberHarga("");
    setKeterangan("");
    setScreenshotHS("");
    HSform.resetFields();
  };

  const onSubmit = () => {
    const hs = {
      URAIAN: uraian,
      SATUAN: satuan,
      HARGA: harga,
      TYPE: type,
      ID_WILAYAH: props.wilayahProject,
      TAHUN: props.tahun,
      SUMBER_HARGA: sumberHarga,
      KETERANGAN: keterangan,
      SCREENSHOT_HS: screenshotHS,
    };

    HSform.validateFields([
      "uraian",
      "satuan",
      "harga",
      "type",
      "sumberHarga",
      "keterangan",
      "screenshotHS",
    ])
      .then(async (valid) => {
        console.log("entry valid");
        setIsLoading(true);
        try {
          const response = await fetch(hostname + "/data-source/post-new-hs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(hs),
          });
          if (response.ok) {
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
            //props.onClose();
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

  console.log(props.tahun);
  console.log(props.wilayahProject);

  return (
    <div>
      <Drawer
        title={
          "Create New HS Record," + props.tahun + " " + props.wilayahProject
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
                <Button onClick={props.onClose} style={{ marginRight: 8 }}>
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
            HSform = el;
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="uraian"
                label="Uraian"
                rules={[
                  {
                    required: true,
                    message: "Uraian harus terisi",
                  },
                ]}
              >
                <Input
                  placeholder="Masukan uraian"
                  onChange={(e) => setUraian(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
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
                  style={{ width: "100%" }}
                  placeholder="Satuan HS"
                  value={satuan}
                  onChange={(e) => setSatuan(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="type"
                label="Type HS"
                rules={[
                  {
                    required: true,
                    message: "Type HS harus terisi",
                  },
                ]}
                initialValue="Bahan"
              >
                <Select
                  placeholder="Select"
                  onChange={(e) => setType(e)}
                  value={type}
                >
                  <Option value="Upah">UPAH / JASA</Option>
                  <Option value="Bahan">ALAT / BAHAN</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="harga"
                label="Harga"
                rules={[
                  {
                    required: true,
                    message: "Silahkan pilih salah satu",
                  },
                ]}
              >
                <Input
                  style={{ width: "100%" }}
                  placeholder="Harga"
                  value={type}
                  onChange={(e) => setHarga(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="sumberHarga"
                label="Sumber Harga"
                rules={[
                  {
                    required: true,
                    message: "Sumber Harga harus terisi",
                  },
                ]}
              >
                <Input
                  placeholder="Masukan sumber harga"
                  onChange={(e) => setSumberHarga(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="keterangan"
                label="Keterangan"
                rules={[
                  {
                    required: false,
                    message: "Masukan keterangan",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Masukan keterangan"
                  onChange={(e) => setKeterangan(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default HSForm;
