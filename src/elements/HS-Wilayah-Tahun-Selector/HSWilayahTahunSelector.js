import React, { useState, useEffect } from "react";

import { Table, Input, InputNumber, Popconfirm, Form, Select } from "antd";
import { globalVariable } from "../../utils/global-variable";

const hostname = globalVariable("backendAddress");

const HSWilayahTahunSelector = (props) => {
    const onSelectedWilayahValue = (value) => {
        props.onWilayahChangeValue && props.onWilayahChangeValue(value);
    };

    const onSelectedTahunValue = (value) => {
        props.onTahunChangeValue && props.onTahunChangeValue(value);
    };

    const [wilayahs, setWilayahs] = useState([]);
    const [tahuns, setTahuns] = useState([]);

    useEffect(() => {
        fetch(hostname + "/base/get-wilayah-full-data", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
                setWilayahs(response.wilayah);
            })
            .catch((error) => {
                console.log(error);
            });

        fetch(hostname + "/base/get-year", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
                setTahuns(response.TAHUNS);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div>
            <div className="d-flex">
                <Form.Item label="Tahun" className="flex-fill">
                    <Select
                        onChange={(e) => {
                            onSelectedTahunValue(e);
                        }}
                    >
                        {tahuns.map((atahun) => (
                            <Select.Option key={atahun} value={atahun}>
                                {atahun}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Wilayah" className="flex-fill">
                    <Select
                        onChange={(e) => {
                            onSelectedWilayahValue(e);
                        }}
                    >
                        {wilayahs.map((satuWilayah) => (
                            <Select.Option
                                key={satuWilayah.ID_WILAYAH}
                                value={satuWilayah.ID_WILAYAH}
                            >
                                {satuWilayah.WILAYAH}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>
        </div>
    );
};

export default HSWilayahTahunSelector;
