import React, { useState } from "react";
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
    Table,
} from "antd";

const AHSProjectForm = () => {
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Age",
            dataIndex: "age",
        },
        {
            title: "Address",
            dataIndex: "address",
        },
    ];

    const data = [];
    for (let i = 0; i < 46; i++) {
        data.push({
            key: i,
            name: `Edward King ${i}`,
            age: 32,
            address: `London, Park Lane no. ${i}`,
        });
    }

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const onSelectChange = (selectedRowKeys) => {
        console.log("selectedRowKeys changed: ", selectedRowKeys);
        setSelectedRowKeys(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            {
                key: "odd",
                text: "Select Odd Row",
                onSelect: (changableRowKeys) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changableRowKeys.filter(
                        (key, index) => {
                            if (index % 2 !== 0) {
                                return false;
                            }
                            return true;
                        }
                    );
                    this.setState({ selectedRowKeys: newSelectedRowKeys });
                },
            },
            {
                key: "even",
                text: "Select Even Row",
                onSelect: (changableRowKeys) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changableRowKeys.filter(
                        (key, index) => {
                            if (index % 2 !== 0) {
                                return true;
                            }
                            return false;
                        }
                    );
                    this.setState({ selectedRowKeys: newSelectedRowKeys });
                },
            },
        ],
    };

    return (
        <>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
            />
        </>
    );
};

export default AHSProjectForm;
