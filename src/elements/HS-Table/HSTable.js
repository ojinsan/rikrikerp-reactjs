import React, { useState } from "react";

import {
    Table,
    Input,
    InputNumber,
    Popconfirm,
    Form,
    Space,
    Button,
} from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";

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

const HSTable = (props) => {
    const [editingKey, setEditingKey] = useState("");
    const isEditing = (record) => record.key === editingKey;
    const [form] = Form.useForm();

    const [sortedInfo, setSortedInfo] = useState(null);
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    var searchInput = "";

    // MARK: Filter Set Up
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={(node) => {
                        searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{ width: 188, marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{ color: filtered ? "#1890ff" : undefined }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex]
                      .toString()
                      .toLowerCase()
                      .includes(value.toLowerCase())
                : "",
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    // MARK: Column Set Up
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

    // MARK: Default Action Setup
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();

        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

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

    // MARK: Enhanced Action Setup
    const save = async (key) => {
        try {
            var row = await form.validateFields();
            const newData = [...props.HSs.data];
            row = { ...row, key: key };

            const index = newData.findIndex((item) => key === item.key);

            const editedContent = {
                ID_HS: row.idHS,
                URAIAN: row.uraian,
                SATUAN: row.satuan,
                HARGA: row.harga,
                TYPE: row.kelompok,
                //ID_WILAYAH: "1",
                TAHUN: props.tahun,
                SUMBER_HARGA: row.sumberHarga,
                KETERANGAN: row.keterangan,
                SCREENSHOT_HS: row.screenshot,
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
            // if (index > -1) {
            //     fetch(hostname + "/data-source/update-hs", {
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
            //                 props.setData(newData);
            //             }
            //         })
            //         .catch((error) => console.log(error));

            //     setEditingKey("");
            // } else {
            //     console.log("Index not found, failed to edit");
            //     //newData.push(row);
            //     //setData(newData);
            //     setEditingKey("");
            // }
        } catch (errInfo) {
            setEditingKey("");
            console.log("Validate Failed:", errInfo);
        }
    };

    const handleDelete = (key, controller) => {
        const newData = JSON.parse(JSON.stringify(props.HSs.data));
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
        // if (index > -1) {
        //     console.log("ketemu");
        //     fetch(hostname + "/data-source/delete-hs", {
        //         signal: controller.signal,
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({
        //             TAHUN: props.tahun,
        //             ID_HS: newData[index].idHS,
        //         }),
        //     })
        //         .then((response) => {
        //             if (response.ok) {
        //                 newData.splice(index, 1);
        //                 props.setData(newData);
        //             }
        //         })
        //         .catch((err) => {
        //             console.log(err);
        //         });
        // } else {
        //     console.log("situ");
        // }
    };

    console.log(props.tahun, props.wilayahProject);

    // useEffect(() => {}, [props.tahun, props.wilayahProject, props.data]);

    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                bordered
                dataSource={props.HSs.data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                    onChange: cancel,
                }}
                size="small"
            />
        </Form>
    );
};

export default HSTable;
