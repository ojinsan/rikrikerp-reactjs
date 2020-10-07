import React, { useState, useEffect } from "react";

import { Table, Input, InputNumber, Popconfirm, Form } from "antd";
import { globalVariable } from "../../utils/global-variable";

const hostname = globalVariable("backendAddress");

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    var required = true;
    if (
        dataIndex == "idHS" ||
        dataIndex == "screenshot" ||
        dataIndex == "sumberHarga" ||
        dataIndex == "keterangan"
    ) {
        required = false;
    }
    const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: required,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const HSTable = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState("");

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            idHS: "",
            uraian: "",
            satuan: "",
            harga: "",
            kelompok: "",
            sumberHarga: "",
            keterangan: "",
            screenshot: "",
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey("");
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                setEditingKey("");
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey("");
            }
        } catch (errInfo) {
            console.log("Validate Failed:", errInfo);
        }
    };

    const columns = [
        {
            title: "ID HS",
            dataIndex: "idHS",
            width: "25%",
            editable: true,
        },
        {
            title: "uraian",
            dataIndex: "uraian",
            width: "15%",
            editable: true,
        },
        {
            title: "satuan",
            dataIndex: "satuan",
            width: "40%",
            editable: true,
        },
        {
            title: "harga",
            dataIndex: "harga",
            width: "40%",
            editable: true,
        },
        {
            title: "kelompok",
            dataIndex: "kelompok",
            width: "40%",
            editable: true,
        },
        {
            title: "sumber harga",
            dataIndex: "sumberHarga",
            width: "40%",
            editable: true,
        },
        {
            title: "keterangan",
            dataIndex: "keterangan",
            width: "40%",
            editable: true,
        },
        {
            title: "screenshot",
            dataIndex: "screenshot",
            width: "40%",
            editable: true,
        },
        {
            title: "operation",
            dataIndex: "operation",
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <a
                            //href="javascript:;"
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </a>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <a
                        disabled={editingKey !== ""}
                        onClick={() => edit(record)}
                    >
                        Edit
                    </a>
                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === "age" ? "number" : "text",
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    useEffect(() => {
        fetch(
            hostname +
                "/data-source/get-hs-specific-group-by-wilayah?TAHUN=" +
                "2010" +
                "&ID_WILAYAH=" +
                "1",
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
                var j = 0;
                var tableData = [];
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
                                screenshotHS: hs.SCREENSHOT_HS,
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
                console.log(tableData);
                setData(tableData);
            });
    }, []);

    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                    onChange: cancel,
                }}
            />
        </Form>
    );
};

export default HSTable;
