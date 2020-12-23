import React, { useState, useEffect } from "react";

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
  const [noUrut1, setNoUrut1] = useState(1);
  const [noUrut2, setNoUrut2] = useState(0);
  const [noUrut3, setNoUrut3] = useState(0);
  const [noUrut4, setNoUrut4] = useState(0);
  const [noUrut5, setNoUrut5] = useState(0);
  const [detail, setDetail] = useState(false);
  const [ahsUtamaProjectId, setAhsUtamaProjectId] = useState(null);
  const [satuan, setSatuan] = useState("");
  const [volume, setVolume] = useState("");
  const [upahNonTdp, setUpahNonTdp] = useState(true);
  const [bahanNonTdp, setBahanNonTdp] = useState(false);
  const [pm, setPm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState([]);

  function onChange(value) {
    console.log(`selected ${value}`);
    setAhsUtamaProjectId(value);
  }

  function onBlur() {
    console.log("blur");
  }

  function onFocus() {
    console.log("focus");
  }

  function onSearch(val) {
    console.log("search:", val);
  }

  const resetForm = () => {
    setItemPekerjaan("");
    setNoUrut1(0);
    setNoUrut2(0);
    setNoUrut3(0);
    setNoUrut4(0);
    setNoUrut5(0);
    setDetail(false);
    setAhsUtamaProjectId(null);
    setSatuan("");
    setVolume("");
    setUpahNonTdp(true);
    setBahanNonTdp(false);
    setPm(false);
    Pform.resetFields();
  };

  useEffect(() => {
    fetch(
      hostname + "/project/get-ahs-project-full-data?TAHUN=" + props.tahun,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        var tableData = response.AHS_PROJECT_UTAMA.map((ahs, idx) => {
          const data = {
            noUrut: ahs.NO_URUT,
            id: ahs.ID_AHS_PROJECT_UTAMA,
            isAHS: true,
            key: idx.toString(),
            nameBaru: ahs.NAMA_AHS_PROJECT,
            nameOri: ahs.AHS_SUMBER_UTAMA.NAMA_AHS,
            noAHS: ahs.NOMOR_AHS_PROJECT,
            kelompok: ahs.KHUSUS ? "Khusus" : "Non-Khusus",
            satuan: ahs.AHS_SUMBER_UTAMA.SATUAN_AHS,
            sumber: ahs.AHS_SUMBER_UTAMA.SUMBER_AHS,
            koefisien: ahs.KOEFISIEN_AHS,
            keterangan: ahs.PENJELASAN_KOEFISIEN_AHS,

            children: ahs.AHS_PROJECT_DETAIL.map((ahsd, i) => {
              return {
                key: idx.toString() + "-" + i.toString(),
                id: ahsd.ID_AHS_PROJECT_DETAIL,
                isAHS: false,
                name: ahsd.P_URAIAN,
                kodeUraian: ahsd.KODE_URAIAN,
                //noAHS: ahsd.ID_AHS_SUMBER_UTAMA,
                kelompok: ahsd.P_KELOMPOK_URAIAN,
                satuan: ahsd.P_SATUAN_URAIAN,
                koefisien: ahsd.P_KOEFISIEN_URAIAN,
                keterangan: ahsd.P_KETERANGAN_URAIAN,
                HS: ahsd.hs ? ahsd.HS.HARGA : 0,
              };
            }),
          };
          if (data.children.length == 0) {
            delete data.children;
          }
          return data;
        });
        return tableData;
      })
      .then((tableData) => {
        setData(tableData);
      });
  }, []);

  const onSubmit = () => {
    console.log(props.RABPB_ID);
    console.log(ahsUtamaProjectId);
    const project = {
      ITEM_PEKERJAAN: itemPekerjaan,
      NO_URUT_1: noUrut1,
      NO_URUT_2: noUrut2,
      NO_URUT_3: noUrut3,
      NO_URUT_4: noUrut4,
      NO_URUT_5: 0,
      DETAIL: detail,
      ID_AHS_PROJECT_UTAMA: ahsUtamaProjectId,
      SATUAN: satuan,
      VOLUME: volume,
      UPAH_NON_TDP: upahNonTdp,
      BAHAN_NON_TDP: bahanNonTdp,
      PM: pm,
      ID_RAB_PROJECT_BAGIAN: props.RABPB_ID,
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
                  onChange={(e) => setItemPekerjaan(e.target.value)}
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
                <Select
                  placeholder="Apakah Ada Detail?"
                  onChange={(e) => setDetail(e)}
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
            {detail && (
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
            )}
            {detail && (
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
            )}
            {detail && (
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
            )}
            {detail && (
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
            )}

            {detail && (
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
                  <Select placeholder="Pilih PM" onChange={(e) => setPm(e)}>
                    <Option key="false" value={false}>
                      TIDAK
                    </Option>
                    <Option key="true" value={true}>
                      YA
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            )}

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
          {detail && (
            <Row gutter={16}>
              <Col span={4}>
                <Form.Item
                  //name="ahsUtamaProjectId"
                  label="AHS Utama Project ID"
                  rules={[
                    {
                      required: true,
                      message: "Pilihan harus terisi",
                    },
                  ]}
                  initialValue={false}
                >
                  <Select
                    showSearch
                    style={{ width: 600 }}
                    placeholder="Select a person"
                    optionFilterProp="children"
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      data.length > 0
                        ? option.alias
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        : ""
                    }
                  >
                    {data.length > 0 &&
                      data.map((item) => (
                        <Option
                          value={item.id}
                          key={item.id}
                          alias={item.nameBaru}
                        >
                          <div>{item.nameBaru}</div>
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Drawer>
    </div>
  );
};

export default RABForm;
