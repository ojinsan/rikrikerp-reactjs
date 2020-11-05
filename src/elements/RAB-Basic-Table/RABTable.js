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

const RABTable = (props) => {
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
            title: "A",
            dataIndex: "noUrut1",
            width: 40,
            editable: true,
            sorter: {
                compare: (a, b) => a.noUrut1 - b.noUrut1,
            },
            ...getColumnSearchProps("noUrut1"),
        },
        {
            title: "B",
            dataIndex: "noUrut2",
            width: 40,
            editable: true,
            sorter: {
                compare: (a, b) => a.noUrut2 - b.noUrut2,
            },
            ...getColumnSearchProps("noUrut2"),
        },
        {
            title: "C",
            dataIndex: "noUrut3",
            width: 40,
            editable: true,
            sorter: {
                compare: (a, b) => a.noUrut3 - b.noUrut3,
            },
            ...getColumnSearchProps("noUrut3"),
        },
        {
            title: "D",
            dataIndex: "noUrut4",
            width: 40,
            editable: true,
            sorter: {
                compare: (a, b) => a.noUrut4 - b.noUrut4,
            },
            ...getColumnSearchProps("noUrut4"),
        },
        {
            title: "Item Pekerjaan",
            dataIndex: "itemPekerjaan",
            width: "25%",
            editable: true,
            sorter: {
                compare: (a, b) =>
                    a.itemPekerjaan.localeCompare(b.itemPekerjaan),
            },
            ...getColumnSearchProps("itemPekerjaan"),
        },
        {
            title: "detail",
            dataIndex: "detail",
            width: "15%",
            editable: true,
            sorter: {
                compare: (a, b) => a.detail.localeCompare(b.detail),
            },
            ...getColumnSearchProps("detail"),
        },
        {
            title: "satuan",
            dataIndex: "satuan",
            width: "40%",
            editable: true,
            sorter: {
                compare: (a, b) => a.satuan.localeCompare(b.satuan),
            },
            ...getColumnSearchProps("satuan"),
        },
        {
            title: "volume",
            dataIndex: "volume",
            width: "40%",
            editable: true,
            sorter: {
                compare: (a, b) => a.volume - b.volume,
            },
            ...getColumnSearchProps("volume"),
        },
        {
            title: "upahNonTdp",
            dataIndex: "upahNonTdp",
            width: "40%",
            editable: true,
            sorter: {
                compare: (a, b) => a.upahNonTdp.localeCompare(b.upahNonTdp),
            },
            ...getColumnSearchProps("upahNonTdp"),
        },
        {
            title: "bahanNonTdp",
            dataIndex: "bahanNonTdp",
            width: "40%",
            editable: true,
            sorter: {
                compare: (a, b) => a.bahanNonTdp.localeCompare(b.bahanNonTdp),
            },
            ...getColumnSearchProps("bahanNonTdp"),
        },
        {
            title: "pm",
            dataIndex: "pm",
            width: 50,
            editable: true,
            sorter: {
                compare: (a, b) => a.pm.localeCompare(b.pm),
            },
            ...getColumnSearchProps("pm"),
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
            itemPekerjaan: "",
            noUrut1: "",
            noUrut2: "",
            noUrut3: "",
            noUrut4: "",
            noUrut5: "",
            detail: "",
            ahsUtamaProjectId: "",
            satuan: "",
            volume: "",
            upahNonTdp: "",
            bahanNonTdp: "",
            pm: "",
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
            const newData = [...props.RABs.data];
            row = { ...row, key: key };

            const index = newData.findIndex((item) => key === item.key);

            console.log(newData);
            console.log(row);
            const editedContent = {
                TAHUN: props.tahun,
                ID_RAB_JUDUL: newData[index].idRabJudul,
                ID_RAB_DETAIL: newData[index].idRabDetail,

                ITEM_PEKERJAAN: row.itemPekerjaan,
                NO_URUT_1: row.noUrut1,
                NO_URUT_2: row.noUrut2,
                NO_URUT_3: row.noUrut3,
                NO_URUT_4: row.noUrut4,
                NO_URUT_5: row.noUrut5,
                DETAIL: row.detail,
                AHS_UTAMA_PROJECT_ID: row.ahsUtamaProjectId,
                SATUAN: row.satuan,
                VOLUME: row.volume,
                UPAH_NON_TDP: row.upahNonTdp,
                BAHAN_NON_TDP: row.bahanNonTdp,
                PM: row.pm,
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
        const newData = JSON.parse(JSON.stringify(props.RABs.data));
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

    return (
        <div>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={props.RABs.data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: cancel,
                    }}
                    size="small"
                />
            </Form>
        </div>
    );
};

export default RABTable;
