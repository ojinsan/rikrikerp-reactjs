import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useReducer,
} from "react";

import { Table, Input, InputNumber, Popconfirm, Form } from "antd";
import { globalVariable } from "../../utils/global-variable";

const hostname = globalVariable("backendAddress");

//     "WILAYAH":"Tubagus Ismail",
//     "DIVRE_DAOP":"Cimahi",
//     "KECAMATAN":"Cimindi",
//     "KABUPATEN_KOTAMADYA":"Bandung",
//     "PROVINSI":"Jawa Barat"

function dataReducer(state, action) {
    console.log(state);
    switch (action.type) {
        case "ACTION_SELECTED": {
            return {
                ...state,
                selectedOption: action.payload,
            };
        }
        case "DELETE": {
            return {
                ...state,
                loading: true,
            };
        }
        case "DELETE_SUCCESS": {
            return {
                ...state,
                loading: false,
                data: action.payload,
            };
        }
        case "FETCH_DATA": {
            return {
                ...state,
                loading: true,
                data: null,
            };
        }
        case "FETCH_DATA_SUCCESS": {
            return {
                ...state,
                loading: false,
                data: action.payload,
            };
        }
        case "RESET": {
            return { loading: false, selectedOption: "", data: null };
        }
        default:
            throw new Error(`Not supported action ${action.type}`);
    }
}

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
    if (dataIndex !== "wilayah") {
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

const WilayahTable = (props) => {
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState("");
    const [data, setData] = useState([]);
    const isEditing = (record) => record.key === editingKey;
    const isMounted = useRef(true);
    const [wilayahs, dispatch] = useReducer(dataReducer, {
        loading: false,
        selectedOption: "FETCH",
        data: null,
    });
    var newData = [];
    var index = -1;

    useEffect(() => {
        console.log("this is use effect");
        if (wilayahs.selectedOption == "FETCH") {
            console.log("fetch");
            dispatch({ type: "FETCH_DATA" });
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
                .then((data) => {
                    console.log("do dispatch");
                    dispatch({
                        type: "FETCH_DATA_SUCCESS",
                        payload: data,
                    });
                });
        } else if (wilayahs.selectedOption == "DELETE") {
            console.log("delete mang");
            console.log(index);
            dispatch({ type: "DELETE" });
            if (index > -1) {
                console.log("ketemu");
                fetch(hostname + "/base/delete-wilayah", {
                    //signal: controller.signal,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ID_WILAYAH: newData[index].idWilayah,
                    }),
                }).then((response) => {
                    if (response.ok) {
                        console.log("Success to back end");
                        console.log("mounted");
                        newData.splice(index, 1);

                        if (isMounted.current) {
                            dispatch({
                                type: "DELETE_SUCCESS",
                                payload: newData,
                            });
                        }
                    }
                });
            } else {
                console.log("situ");
            }
        } else {
            dispatch({ type: "RESET" });
        }
    }, [wilayahs.selectedOption]);

    // useEffect(() => {
    //     //setHe(false);
    //     console.log("atau disiini");
    //     fetch(hostname + "/base/get-wilayah-full-data", {
    //         headers: {
    //             "Content-Type": "application/json",
    //             Accept: "application/json",
    //         },
    //     })
    //         .then((response) => response.json())
    //         .then((response) => {
    //             var j = 0;
    //             var tableData = [];
    //             response.wilayah &&
    //                 (tableData = response.wilayah.map((item) => {
    //                     j++;
    //                     return {
    //                         idWilayah: item.ID_WILAYAH,
    //                         wilayah: item.WILAYAH,
    //                         divreDaop: item.DIVRE_DAOP,
    //                         kecamatan: item.KECAMATAN,
    //                         kabupatenKotamadya: item.KABUPATEN_KOTAMADYA,
    //                         provinsi: item.PROVINSI,
    //                         key: j.toString() - 1,
    //                     };
    //                 }));
    //             return tableData;
    //         })
    //         .then((tableData) => {
    //             setData(tableData);
    //         });
    //     return () => {
    //         isMounted.current = false;
    //     };
    // }, []);

    const edit = (record) => {
        form.setFieldsValue({
            wilayah: "",
            divreDaop: "",
            kecamatan: "",
            kabupatenKotamadya: "",
            provinsi: "",
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey("");
    };

    const save = async (key, controller) => {
        try {
            // const row = await form.validateFields();
            // const newData = [...data];
            // const index = newData.findIndex((item) => key === item.key);
            // const editedContent = {
            //     ID_WILAYAH: row.idWilayah,
            //     WILAYAH: row.wilayah,
            //     DIVRE_DAOP: row.divreDaop,
            //     KECAMATAN: row.kecamatan,
            //     KABUPATEN_KOTAMADYA: row.kabupatenKotamadya,
            //     PROVINSI: row.provinsi,
            // };
            // console.log(editedContent);
            // if (index > -1) {
            //     fetch(hostname + "/base/update-wilayah", {
            //         signal: controller.signal,
            //         method: "POST",
            //         headers: {
            //             "Content-Type": "application/json",
            //         },
            //         body: JSON.stringify(editedContent),
            //     })
            //         .then((response) => {
            //             if (response.ok) {
            //                 const item = newData[index];
            //                 newData.splice(index, 1, { ...item, ...row });
            //                 setData(newData);
            //             }
            //         })
            //         .catch((error) => console.log(error));
            //     setEditingKey("");
            // } else {
            //     console.log("Index not found, failed to edit");
            //     setEditingKey("");
            // }
        } catch (errInfo) {
            console.log("Validate Failed:", errInfo);
        }
    };

    const handleDelete = async (key, controller) => {
        console.log(key);
        // try {
        newData = JSON.parse(JSON.stringify(wilayahs.data));
        //const keysTemp = key.split("-");
        console.log("utama delete");
        index = newData.findIndex((item) => key === item.key);
        console.log(index);

        dispatch({ type: "ACTION_SELECTED", payload: "DELETE" });
    };

    const columns = [
        {
            title: "ID Wil",
            dataIndex: "idWilayah",
            width: "10%",
            editable: true,
        },
        {
            title: "Wilayah",
            dataIndex: "wilayah",
            width: "30%",
            editable: true,
        },
        {
            title: "Divre / Daop",
            dataIndex: "divreDaop",
            width: "30%",
            editable: true,
        },
        {
            title: "Kecamatan",
            dataIndex: "kecamatan",
            width: "40%",
            editable: true,
        },
        {
            title: "Kabupaten / Kotamadya",
            dataIndex: "kabupatenKotamadya",
            width: "40%",
            editable: true,
        },
        {
            title: "provinsi",
            dataIndex: "provinsi",
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
                            onClick={() => {
                                const controller = new AbortController();
                                save(record.key, controller);
                                return () => controller.abort();
                            }}
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
                    <div>
                        <a
                            disabled={editingKey !== ""}
                            onClick={() => edit(record)}
                        >
                            Edit
                        </a>
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => {
                                const controller = new AbortController();
                                handleDelete(record.key, controller);
                                return () => controller.abort();
                            }}
                        >
                            <a> Delete </a>
                        </Popconfirm>
                    </div>
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

    console.log(wilayahs.data);
    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                bordered
                dataSource={wilayahs.data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                    onChange: cancel,
                }}
            />
        </Form>
    );
};

export default WilayahTable;
