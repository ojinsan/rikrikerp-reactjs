import React, { useState, useEffect } from "react";

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
import { WilayahForm, WilayahTable } from "../../elements";

const hostname = globalVariable("backendAddress");

const Wilayah = () => {
    const [showWilayahForm, setShowWilayahForm] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        console.log("atau disiini");
        fetch(hostname + "/base/get-wilayah-full-data", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
            .then((response) => response.json())
            .then((response) => {
                var j = 0;
                var tableData = [];
                response.wilayah &&
                    (tableData = response.wilayah.map((item) => {
                        j++;
                        return {
                            idWilayah: item.ID_WILAYAH,
                            wilayah: item.WILAYAH,
                            divreDaop: item.DIVRE_DAOP,
                            kecamatan: item.KECAMATAN,
                            kabupatenKotamadya: item.KABUPATEN_KOTAMADYA,
                            provinsi: item.PROVINSI,
                            key: j.toString() - 1,
                        };
                    }));
                return tableData;
            })
            .then((tableData) => {
                setData(tableData);
            });
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <h4>This is HS</h4>
                <Button
                    type="primary"
                    className="d-flex p-2 align-items-center"
                    onClick={() => {
                        setShowWilayahForm(!showWilayahForm);
                    }}
                >
                    <PlusOutlined /> New Wilayah Record
                </Button>
            </div>

            <WilayahTable
                setData={(data) => {
                    setData(data);
                }}
                data={data}
            />

            <WilayahForm
                showDrawer={() => {
                    setShowWilayahForm(true);
                }}
                onClose={() => {
                    setShowWilayahForm(false);
                }}
                visible={showWilayahForm}
            />
        </div>
    );
};

export default Wilayah;
