import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useReducer,
} from "react";

import {
    Table,
    Input,
    InputNumber,
    Popconfirm,
    Form,
    Space,
    Button,
} from "antd";
// import { globalVariable } from "../../utils/global-variable";
import Highlighter from "react-highlight-words";

import { SearchOutlined } from "@ant-design/icons";

// const hostname = globalVariable("backendAddress");

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

    const [sortedInfo, setSortedInfo] = useState(null);
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    var searchInput = "";

    // MARK: Column Set Up
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
            sorter: {
                compare: (a, b) => a.wilayah.localeCompare(b.wilayah),
            },
            ...getColumnSearchProps("wilayah"),
            //sortOrder: "descend",
        },
        {
            title: "Divre / Daop",
            dataIndex: "divreDaop",
            width: "30%",
            editable: true,
            sorter: {
                compare: (a, b) => a.divreDaop.localeCompare(b.divreDaop),
            },
            ...getColumnSearchProps("divreDaop"),
        },
        {
            title: "Kabupaten / Kotamadya",
            dataIndex: "kabupatenKotamadya",
            width: "40%",
            editable: true,
            sorter: {
                compare: (a, b) =>
                    a.kabupatenKotamadya.localeCompare(b.kabupatenKotamadya),
            },
            ...getColumnSearchProps("kabupatenKotamadya"),
        },
        {
            title: "provinsi",
            dataIndex: "provinsi",
            width: "40%",
            editable: true,
            sorter: {
                compare: (a, b) => a.provinsi.localeCompare(b.provinsi),
            },
            ...getColumnSearchProps("provinsi"),
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
                    <div className="d-flex flex-row justify-content-between align-items-center">
                        <a
                            className="m-1"
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
                            <a className="m-1">Delete</a>
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
                size="small"
            />
        </Form>
    );
};

export default WilayahTable;
