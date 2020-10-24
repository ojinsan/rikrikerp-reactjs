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
    var required = false;
    if (
        dataIndex == "idHS" ||
        dataIndex == "screenshot" ||
        dataIndex == "sumberHarga" ||
        dataIndex == "keterangan"
    ) {
        required = true;
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

const RABProjectBagianTable = (props) => {
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
            title: "Jenis",
            dataIndex: "jenis",
            width: "25%",
            editable: true,
            sorter: {
                compare: (a, b) => a.jenis.localeCompare(b.jenis),
            },
            ...getColumnSearchProps("jenis"),
        },
        {
            title: "bagian",
            dataIndex: "bagian",
            width: "15%",
            editable: true,
            sorter: {
                compare: (a, b) => a.bagian.localeCompare(b.bagian),
            },
            ...getColumnSearchProps("bagian"),
        },
        {
            title: "subBagian",
            dataIndex: "subBagian",
            width: "40%",
            editable: true,
            sorter: {
                compare: (a, b) => a.subBagian.localeCompare(b.subBagian),
            },
            ...getColumnSearchProps("subBagian"),
        },
        {
            title: "ID TTD",
            dataIndex: "idTtd",
            width: "40%",
            editable: true,
            sorter: {
                compare: (a, b) => a.idTtd - b.idTtd,
            },
            ...getColumnSearchProps("idTtd"),
        },
        {
            title: "Keterangan Judul Rekap",
            dataIndex: "keteranganJudulRekap",
            width: "40%",
            editable: true,
            sorter: {
                compare: (a, b) =>
                    a.keteranganJudulRekap.localeCompare(
                        b.keteranganJudulRekap
                    ),
            },
            ...getColumnSearchProps("keteranganJudulRekap"),
        },
        {
            title: "Keterangan Bagian Bawah Rekap",
            dataIndex: "keteranganBagBawahRab",
            width: "40%",
            editable: true,
            sorter: {
                compare: (a, b) =>
                    a.keteranganBagBawahRab.localeCompare(
                        b.keteranganBagBawahRab
                    ),
            },
            ...getColumnSearchProps("keteranganBagBawahRab"),
        },
        {
            title: "Jumlah RAB",
            dataIndex: "jumlahRab",
            width: "40%",
            editable: true,
            sorter: {
                compare: (a, b) => a.jumlahRab - b.jumlahRab,
            },
            ...getColumnSearchProps("jumlahRab"),
        },
        {
            title: "Total Upah TDP",
            dataIndex: "totalUpahTdp",
            width: "40%",
            editable: true,
            sorter: {
                compare: (a, b) => a.totalUpahTdp - b.totalUpahTdp,
            },
            ...getColumnSearchProps("totalUpahTdp"),
        },
        {
            title: "Total Bahan Tdp",
            dataIndex: "totalBahanTdp",
            width: "40%",
            editable: true,
            sorter: {
                compare: (a, b) => a.totalBahanTdp - b.totalBahanTdp,
            },
            ...getColumnSearchProps("totalBahanTdp"),
        },
        {
            title: "Total Upah Non Tdp",
            dataIndex: "totalUpahNonTdp",
            width: "40%",
            editable: true,
            sorter: {
                compare: (a, b) => a.totalUpahNonTdp - b.totalUpahNonTdp,
            },
            ...getColumnSearchProps("totalUpahNonTdp"),
        },
        {
            title: "Total Bahan Non Tdp",
            dataIndex: "totalBahanNonTdp",
            width: "40%",
            editable: true,
            sorter: {
                compare: (a, b) => a.totalBahanNonTdp - b.totalBahanNonTdp,
            },
            ...getColumnSearchProps("totalBahanNonTdp"),
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
            jenis: "",
            bagian: "",
            subBagian: "",
            ID_TTD: 1, //later
            keteranganJudulRekap: "",
            jumlahRab: "",
            keteranganBagBawahRab: "",
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
            const newData = [...props.RABPBs.data];
            row = { ...row, key: key };

            const index = newData.findIndex((item) => key === item.key);

            console.log(row);
            const editedContent = {
                TAHUN: props.tahun,
                ID_RAB_PROJECT_BAGIAN: newData[index].idRABPB,
                JENIS: row.jenis,
                BAGIAN: row.bagian,
                SUB_BAGIAN: row.subBagian,
                ID_TTD: row.idTtd,
                KETERANGAN_JUDUL_REKAP: row.keteranganJudulRekap,
                JUMLAH_RAB: row.jumlahRab,
                TOTAL_UPAH_TDP: row.totalUpahTdp,
                TOTAL_BAHAN_TDP: row.totalBahanTdp,
                TOTAL_UPAH_NON_TDP: row.totalUpahNonTdp,
                TOTAL_BAHAN_NON_TDP: row.totalBahanNonTdp,
                KETERANGAN_BAG_BAWAH_RAB: row.keteranganBagBawahRab,
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

    const handleDelete = (key, controller) => {
        const newData = JSON.parse(JSON.stringify(props.RABPBs.data));
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

    //console.log(props.tahun, props.wilayahProject);

    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                bordered
                dataSource={props.RABPBs.data}
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

export default RABProjectBagianTable;
