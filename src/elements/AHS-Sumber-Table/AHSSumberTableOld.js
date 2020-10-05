import React, { useContext, useState, useEffect, useRef } from "react";
import { Table, Input, Button, Popconfirm, Form } from "antd";
const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async (e) => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log("Save failed:", errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

class AHSSumberTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: "No AHS",
                dataIndex: "noAHS",
                width: 80,
                editable: true,
            },
            {
                title: "Nama AHS / Nama Uraian",
                dataIndex: "name",
                width: "30%",
                editable: true,
            },
            {
                title: "Kelompok",
                dataIndex: "kelompok",
                width: 90,
                editable: true,
            },
            {
                title: "Satuan",
                dataIndex: "satuan",
                width: 80,
                editable: true,
            },
            {
                title: "Koefisien",
                dataIndex: "koefisien",
                width: 80,
                editable: true,
            },
            {
                title: "Operation",
                dataIndex: "operation",
                width: 100,
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => this.handleDelete(record.key)}
                        >
                            <a>Delete</a>
                        </Popconfirm>
                    ) : null,
            },
            {
                title: "",
                dataIndex: "khusus",
                width: "4%",
            },
        ];
        this.state = {
            dataSource: [
                {
                    key: "0",
                    name: "Edward King 0",
                    age: "32",
                    address: "London, Park Lane no. 0",
                },
                {
                    key: "1",
                    name: "Edward King 1",
                    age: "32",
                    address: "London, Park Lane no. 1",
                    children: [
                        {
                            key: "4-9",
                            name: "Edward King 99999",
                            age: "39992",
                            address: "London, Park Lane no. 099",
                        },
                    ],
                },
            ],
            count: 2,
        };
    }

    handleDelete = (key) => {
        const keysTemp = key.split("-");
        const dataSource = [...this.state.dataSource];
        if (keysTemp.length == 2) {
            const index = dataSource.findIndex((item) => {
                if (item.children !== undefined && item.children !== null) {
                    const childIndex = item.children.findIndex(
                        (child) => key === child.key
                    );
                    if (childIndex == null) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return key === item.key;
                }
            });

            dataSource[index].children = dataSource[index].children.filter(
                (child) => {
                    console.log(child.key);
                    console.log(key);
                    return child.key !== key;
                }
            );

            console.log(dataSource[index].children);
            if (dataSource[index].children.length == 0) {
                console.log("nah");
                delete dataSource[index]["children"];
            }

            console.log(key);
            console.log(dataSource);

            this.setState({
                dataSource: dataSource,
            });
        } else {
            this.setState({
                dataSource: dataSource.filter((item) => item.key !== key),
            });
        }
    };

    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    };

    handleSave = (row) => {
        const keysTemp = row.key.split("-");
        const newData = [...this.state.dataSource];
        if (keysTemp.length == 2) {
            console.log(row);
            var childIndex = null;
            const index = newData.findIndex((item) => {
                if (item.children !== undefined && item.children !== null) {
                    childIndex = item.children.findIndex(
                        (child) => row.key === child.key
                    );
                    if (childIndex == null) {
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

            const item = newData[index].children[childIndex];
            newData[index].children.splice(childIndex, 1, { ...item, ...row });
        } else {
            const index = newData.findIndex((item) => row.key === item.key);
            const item = newData[index];
        }
        this.setState({
            dataSource: newData,
        });
    };

    render() {
        const { dataSource } = this.state;
        console.log(dataSource);
        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div>
                <Button
                    onClick={this.handleAdd}
                    type="primary"
                    style={{
                        marginBottom: 16,
                    }}
                >
                    Add a row
                </Button>
                <Table
                    components={components}
                    rowClassName={() => "editable-row"}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    scroll={{ y: 240 }}
                    size="small"
                    expandable={{
                        expandIconColumnIndex: this.columns.length - 1,
                    }}
                />
            </div>
        );
    }
}

export default AHSSumberTable;
