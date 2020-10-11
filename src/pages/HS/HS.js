import React, { useState, useEffect } from "react";
import {
    HSTable,
    HSForm,
    HSWilayahTahunSelector,
    HSSort,
} from "../../elements";
import { SortBox } from "../../components";

import { globalVariable } from "../../utils/global-variable";

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

const hostname = globalVariable("backendAddress");

const HS = (props) => {
    const [showHSForm, setShowHSForm] = useState(false);
    const [wilayahProject, setWilayahProject] = useState(null);
    const [tahun, setTahun] = useState(null);
    const [data, setData] = useState([]);
    const originData = data;

    useEffect(() => {
        fetch(
            hostname +
                "/data-source/get-hs-specific-group-by-wilayah?TAHUN=" +
                tahun +
                "&ID_WILAYAH=" +
                wilayahProject,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        )
            .then((response) => response.json())
            .then((response) => {
                var j = 0;
                var tableData = [];
                response.Wilayah &&
                    response.Wilayah.forEach((wilayah) => {
                        tableData.push(
                            ...wilayah.HS.map((hs, idx) => {
                                const data = {
                                    idHS: hs.ID_HS,
                                    uraian: hs.URAIAN,
                                    satuan: hs.SATUAN,
                                    harga: hs.HARGA,
                                    kelompok: hs.TYPE,
                                    sumberHarga: hs.SUMBER_HARGA,
                                    keterangan: hs.KETERANGAN,
                                    screenshot: hs.SCREENSHOT_HS,
                                    key: j.toString(),
                                    // ID_WILAYAH
                                };
                                j++;
                                return data;
                            })
                        );
                    });
                return tableData;
            })
            .then((tableData) => {
                setData(tableData);
            });
    }, [tahun, wilayahProject]);

    return (
        <>
            <HSWilayahTahunSelector
                onWilayahChangeValue={(value) => {
                    setWilayahProject(value);
                }}
                onTahunChangeValue={(value) => {
                    setTahun(value);
                }}
            />

            <div className="d-flex justify-content-between align-items-center">
                <h4>This is HS</h4>
                {tahun && wilayahProject && (
                    <Button
                        type="primary"
                        className="d-flex p-2 align-items-center"
                        onClick={() => {
                            setShowHSForm(!showHSForm);
                        }}
                    >
                        <PlusOutlined /> New HS Record
                    </Button>
                )}
            </div>

            <HSSort
                onChange={(newDatas) => {
                    const newDatasTemp = JSON.parse(JSON.stringify(newDatas));
                    console.log(newDatasTemp);
                    setData(newDatasTemp);
                }}
                datas={originData}
            />
            {/* <SortBox /> */}
            {tahun && wilayahProject && (
                <HSTable
                    setData={(data) => {
                        setData(data);
                    }}
                    data={data}
                    tahun={tahun}
                    wilayahProject={wilayahProject}
                />
            )}

            {tahun && wilayahProject && (
                <HSForm
                    tahun={tahun}
                    wilayahProject={wilayahProject}
                    showDrawer={() => {
                        setShowHSForm(true);
                    }}
                    onClose={() => {
                        setShowHSForm(false);
                    }}
                    visible={showHSForm}
                />
            )}
        </>
    );
};

export default HS;
