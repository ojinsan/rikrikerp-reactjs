import React, { useState, useEffect } from "react";
import { Table, Input, InputNumber, Popconfirm, Form, Tooltip } from "antd";
import { PlusCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons";
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
        dataIndex == "noAHS" ||
        dataIndex == "satuan" ||
        dataIndex == "koefisien" ||
        dataIndex == "sumber" ||
        dataIndex == "keterangan" ||
        dataIndex == "gambar"
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

const AHSProjectTable = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState("");

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            name: "",
            noAHS: "",
            kelompok: "",
            satuan: "",
            koefisien: "",
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey("");
    };

    const handleDelete = (key) => {
        console.log(key);
        try {
            const newData = [...data];
            const keysTemp = key.split("-");
            if (keysTemp.length == 2) {
                var childIndex = null;
                const index = newData.findIndex((item) => {
                    if (item.children !== undefined && item.children !== null) {
                        console.log(item);
                        childIndex = item.children.findIndex((child) => {
                            console.log(child);
                            return key === child.key;
                        });
                        if (childIndex === -1) {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        // ga mungkin kesini harusnya
                        console.log("it's weird");
                        return key === item.key;
                    }
                });

                console.log(index);
                console.log(childIndex);

                if (index > -1) {
                    console.log("jol delete");
                    newData[index].children.splice(childIndex, 1);
                    setData(newData);
                } else {
                    console.log("situ");
                }
            } else {
                console.log("utama delete");
                const index = newData.findIndex((item) => key === item.key);
                if (index > -1) {
                    console.log("ketemu");
                    newData.splice(index, 1);
                    setData(newData);
                } else {
                    console.log("situ");
                }
            }
        } catch (errInfo) {
            console.log("Validate Failed:", errInfo);
        }

        // const keysTemp = key.split("-");
        // console.log(keysTemp);
        // const dataSource = [...data];
        // if (keysTemp.length == 2) {
        //     const index = dataSource.findIndex((item) => {
        //         if (item.children !== undefined && item.children !== null) {
        //             const childIndex = item.children.findIndex(
        //                 (child) => key === child.key
        //             );
        //             if (childIndex == null) {
        //                 return false;
        //             } else {
        //                 return true;
        //             }
        //         } else {
        //             return key === item.key;
        //         }
        //     });

        //     console.log(index);

        //     dataSource[index].children = dataSource[index].children.filter(
        //         (child) => {
        //             console.log(child.key);
        //             console.log(key);
        //             return child.key !== key;
        //         }
        //     );

        //     console.log(dataSource[index].children);
        //     if (dataSource[index].children.length == 0) {
        //         console.log("nah");
        //         delete dataSource[index]["children"];
        //     }

        //     console.log(key);
        //     console.log(dataSource);

        //     setData(dataSource);
        // } else {
        //     setData(dataSource.filter((item) => item.key !== key));
        // }
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            console.log(row);
            const newData = [...data];
            const keysTemp = key.split("-");
            if (keysTemp.length == 2) {
                var childIndex = null;
                const index = newData.findIndex((item) => {
                    if (item.children !== undefined && item.children !== null) {
                        childIndex = item.children.findIndex((child) => {
                            return key === child.key;
                        });
                        if (childIndex === -1) {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return row.key === item.key;
                    }
                });
                console.log(index);
                console.log(childIndex);

                if (index > -1) {
                    console.log("sini");
                    const item = newData[index].children[childIndex];
                    console.log(item);
                    console.log({ ...item, ...row });
                    newData[index].children.splice(childIndex, 1, {
                        ...item,
                        ...row,
                    });
                    console.log(newData);
                    setData(newData);

                    setEditingKey("");
                } else {
                    console.log("situ");
                    newData.push(row);
                    setData(newData);
                    setEditingKey("");
                }
            } else {
                console.log("utama ngedit");
                const index = newData.findIndex((item) => key === item.key);
                if (index > -1) {
                    console.log("ketemu");
                    const item = newData[index];
                    newData.splice(index, 1, { ...item, ...row });
                    setData(newData);
                    setEditingKey("");
                } else {
                    newData.push(row);
                    setData(newData);
                    setEditingKey("");
                }
            }
        } catch (errInfo) {
            console.log("Validate Failed:", errInfo);
        }
    };

    const columns = [
        {
            title: "No Urut",
            dataIndex: "noUrut",
            width: 48,
            editable: true,
            required: false,
        },
        {
            title: "No AHS",
            dataIndex: "noAHS",
            width: 70,
            editable: true,
            required: false,
        },
        {
            title: "Sumber",
            dataIndex: "sumber",
            width: 100,
            editable: true,
            required: false,
        },
        {
            title: "Nama AHS / Nama Uraian Editan",
            dataIndex: "nameBaru",
            width: "40%",
            editable: true,
            required: true,
        },
        {
            title: "Nama AHS / Nama Uraian Original",
            dataIndex: "nameOri",
            width: "40%",
            editable: true,
            required: true,
        },
        {
            title: "Kelompok",
            dataIndex: "kelompok",
            width: 80,
            editable: true,
            required: true,
        },
        {
            title: "Satuan",
            dataIndex: "satuan",
            width: 65,
            editable: true,
            required: false,
        },
        {
            title: "Koef",
            dataIndex: "koefisien",
            width: 65,
            editable: true,
            required: false,
        },
        {
            title: "Harga Satuan",
            dataIndex: "HS",
            width: 65,
            editable: true,
            required: false,
        },
        {
            title: "Keterangan",
            dataIndex: "keterangan",
            width: 150,
            editable: true,
            required: false,
            ellipsis: {
                showTitle: true,
            },
            render: (keterangan) => (
                <Tooltip placement="topLeft" title={keterangan}>
                    {keterangan}
                </Tooltip>
            ),
        },
        {
            title: " ",
            dataIndex: "gambar",
            width: 30,
            editable: false,
            required: false,
            ellipsis: {
                showTitle: true,
            },
            render: (gambar, record) =>
                gambar !== undefined && (
                    <Tooltip placement="topLeft" title={<img src={gambar} />}>
                        {/* {"[]"} */}
                        {record.name}
                    </Tooltip>
                ),
        },
        {
            title: "operation",
            width: 120,
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
                ) : data.length >= 1 ? (
                    <div>
                        <a
                            disabled={editingKey !== ""}
                            onClick={() => edit(record)}
                        >
                            Edit
                        </a>
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => handleDelete(record.key)}
                        >
                            <a> Delete </a>
                        </Popconfirm>
                    </div>
                ) : null;
            },
        },
        {
            title: " ",
            dataIndex: "khusus",
            width: 35,
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
                inputType: col.dataIndex === "koefisien" ? "number" : "text",
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    useEffect(() => {
        fetch(hostname + "/project/get-ahs-project-full-data?TAHUN=" + "2010", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
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
                                HS: ahsd.HS.HARGA,
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

    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                rowClassName={(record) => record.color.replace("#", "")}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                    onChange: cancel,
                }}
                expandable={{
                    expandIconColumnIndex: columns.length - 1,
                }}
                size="small"
            />
        </Form>
    );
};

export default AHSProjectTable;
