import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useReducer,
} from "react";

import { Table, Input, InputNumber, Popconfirm, Form } from "antd";
// import { globalVariable } from "../../utils/global-variable";

// const hostname = globalVariable("backendAddress");

// MARK: Initial Setup Function
function dataReducer(state, action) {
    switch (action.type) {
        case "ACTION_SELECTED": {
            return {
                ...state,
                selectedOption: action.payload.option,
                selectedIndex: action.payload.index,
                newData: action.payload.newData,
                row: action.payload.row,
            };
        }
        case "DELETE": {
            return {
                ...state,
                loading: true,
            };
        }
        case "DELETE_SUCCESS": {
            console.log("dispatch delete success");
            console.log(action.payload);
            return {
                ...state,
                loading: false,
                data: action.payload,
                selectedOption: "",
            };
        }
        case "UPDATE": {
            return {
                ...state,
                loading: true,
            };
        }
        case "UPDATE_SUCCESS": {
            console.log("dispatch update success");
            console.log(action.payload);
            return {
                ...state,
                loading: false,
                data: action.payload,
                selectedOption: "",
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
            console.log("dispatch fetch success");
            console.log(action.payload);
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

// ======================= MARK: Component =======================
const WilayahTable = (props) => {
    const [editingKey, setEditingKey] = useState("");
    const isEditing = (record) => record.key === editingKey;
    const [form] = Form.useForm();
    // const [wilayahs, dispatch] = useReducer(dataReducer, {
    //     loading: false,
    //     selectedOption: "FETCH",
    //     data: null,
    //     selectedIndex: -1,
    //     newData: {},
    //     row: {},
    // });

    // MARK: Column Set Up
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
                                // const controller = new AbortController();
                                save(record.key);
                                // return () => controller.abort();
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
                        {/* {isMountedRef.current && ( */}
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => {
                                handleDelete(record.key);
                            }}
                        >
                            <a> Delete</a>
                        </Popconfirm>
                        {/* )} */}
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

    // MARK: State Manager
    // const isMountedRef = useRef(null);
    // useEffect(() => {
    //     //let mounted = true;
    //     isMountedRef.current = true;
    //     console.log(
    //         "Info: wilayah(dot)selectedOption is changed to " +
    //             wilayahs.selectedOption
    //     );
    //     if (wilayahs.selectedOption === "FETCH") {
    //         // dispatch({ type: "FETCH_DATA" });
    //         fetch(hostname + "/base/get-wilayah-full-data", {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Accept: "application/json",
    //             },
    //         })
    //             .then((response) => response.json())
    //             .then((response) => {
    //                 var j = 0;
    //                 var tableData = [];
    //                 response.wilayah &&
    //                     (tableData = response.wilayah.map((item) => {
    //                         j++;
    //                         return {
    //                             idWilayah: item.ID_WILAYAH,
    //                             wilayah: item.WILAYAH,
    //                             divreDaop: item.DIVRE_DAOP,
    //                             kecamatan: item.KECAMATAN,
    //                             kabupatenKotamadya: item.KABUPATEN_KOTAMADYA,
    //                             provinsi: item.PROVINSI,
    //                             key: j.toString() - 1,
    //                         };
    //                     }));
    //                 return tableData;
    //             })
    //             .then((data) => {
    //                 console.log("Fetch Success!");
    //                 if (isMountedRef.current) {
    //                     dispatch({
    //                         type: "FETCH_DATA_SUCCESS",
    //                         payload: data,
    //                     });
    //                 }
    //             });
    //     } else if (wilayahs.selectedOption == "DELETE") {
    //         console.log("delete the index " + wilayahs.selectedIndex);
    //         // dispatch({ type: "DELETE" });
    //         if (wilayahs.selectedIndex > -1) {
    //             console.log("ketemu");
    //             fetch(hostname + "/base/delete-wilayah", {
    //                 //signal: controller.signal,
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     ID_WILAYAH:
    //                         wilayahs.data[wilayahs.selectedIndex].idWilayah,
    //                 }),
    //             }).then((response) => {
    //                 if (response.ok) {
    //                     console.log("Success from back end");
    //                     const newData = JSON.parse(
    //                         JSON.stringify(wilayahs.data)
    //                     );
    //                     newData.splice(wilayahs.selectedIndex, 1);
    //                     console.log(newData);

    //                     if (isMountedRef.current) {
    //                         dispatch({
    //                             type: "DELETE_SUCCESS",
    //                             payload: newData,
    //                         });
    //                     }
    //                 }
    //             });
    //         } else {
    //             console.log("situ");
    //         }
    //     } else if (wilayahs.selectedOption == "UPDATE") {
    //         console.log(wilayahs.selectedIndex);
    //         if (wilayahs.selectedIndex > -1) {
    //             fetch(hostname + "/base/update-wilayah", {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify(wilayahs.newData),
    //             })
    //                 .then((response) => {
    //                     if (response.ok) {
    //                         var newDatas = JSON.parse(
    //                             JSON.stringify(wilayahs.data)
    //                         );
    //                         const item = newDatas[wilayahs.selectedIndex];

    //                         newDatas.splice(wilayahs.selectedIndex, 1, {
    //                             ...item,
    //                             ...wilayahs.row,
    //                         });
    //                         console.log(newDatas);
    //                         dispatch({
    //                             type: "UPDATE_SUCCESS",
    //                             payload: newDatas,
    //                         });
    //                     }
    //                 })
    //                 .catch((error) => console.log(error));
    //             setEditingKey("");
    //         } else {
    //             console.log("Index not found, failed to edit");
    //             setEditingKey("");
    //         }
    //     } else {
    //         //dispatch({ type: "RESET" });
    //     }
    //     return () => (isMountedRef.current = false);
    // }, [wilayahs.selectedOption]);

    // MARK: Handlers

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

    const save = async (key) => {
        try {
            var row = await form.validateFields();
            const newData = [...props.wilayahs.data];
            row = {
                ...row,
                key: key,
            };
            console.log(row);

            const index = newData.findIndex((item) => key === item.key);

            const editedContent = {
                ID_WILAYAH: row.idWilayah,
                WILAYAH: row.wilayah,
                DIVRE_DAOP: row.divreDaop,
                KECAMATAN: row.kecamatan,
                KABUPATEN_KOTAMADYA: row.kabupatenKotamadya,
                PROVINSI: row.provinsi,
            };
            props.dispatch({
                type: "ACTION_SELECTED",
                payload: {
                    option: "UPDATE",
                    index: index,
                    newData: editedContent,
                    row: { ...row, key: key },
                },
            });
            setEditingKey("");
        } catch (errInfo) {
            setEditingKey("");
            console.log("Validate Failed:", errInfo);
        }
    };

    const handleDelete = (key) => {
        const newData = JSON.parse(JSON.stringify(props.wilayahs.data));
        const index = newData.findIndex((item) => key === item.key);
        console.log(
            "try deleting record with key: " + key + " at index: " + index
        );
        props.dispatch({
            type: "ACTION_SELECTED",
            payload: {
                option: "DELETE",
                index: index,
                newData: {},
            },
        });
    };

    // MARK: Render the object
    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                bordered
                dataSource={props.wilayahs.data}
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
