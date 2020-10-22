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

const RABTable = () => {
    return <div></div>;
};

export default RABTable;
