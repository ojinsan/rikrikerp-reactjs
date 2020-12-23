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
import { useHistory } from "react-router-dom";

// ID_PROJECT": 1,
//             "NAMA_PROJECT": "Matul",
//             "TAHUN": "2012",
//             "createdAt": "2020-10-16T07:27:02.000Z",
//             "updatedAt": "2020-10-16T07:27:02.000Z",
//             "ID_WILAYAH": 112,
//             "WILAYAH": {

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
    dataIndex == "tahun" ||
    dataIndex == "wilayah" ||
    dataIndex == "idProject"
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

const ProjectTable = (props) => {
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const [form] = Form.useForm();

  const [sortedInfo, setSortedInfo] = useState(null);
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  var searchInput = "";
  const history = useHistory();

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
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
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
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
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
      title: "ID Project",
      dataIndex: "idProject",
      width: "10%",
      editable: true,
    },
    {
      title: "Nama Project",
      dataIndex: "namaProject",
      width: "25%",
      editable: true,
      sorter: {
        compare: (a, b) => a.namaProject.localeCompare(b.namaProject),
      },
      ...getColumnSearchProps("namaProject"),
      render: (_, record) => {
        console.log(record);
        return (
          <div
            onClick={() => {
              history.push("/project/" + props.tahun + "/" + record.idProject);
            }}
          >
            {record.namaProject}
          </div>
        );
      },
    },
    {
      title: "Tahun",
      dataIndex: "tahun",
      width: "15%",
      editable: true,
      sorter: {
        compare: (a, b) => a.tahun - b.tahun,
      },
      ...getColumnSearchProps("tahun"),
    },

    {
      title: "wilayah",
      dataIndex: "wilayah",
      width: "30%",
      editable: true,
      sorter: {
        compare: (a, b) => a.wilayah.localeCompare(b.wilayah),
      },
      ...getColumnSearchProps("wilayah"),
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
            <a disabled={editingKey !== ""} onClick={() => edit(record)}>
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
            <a
              onClick={() => {
                history.push(
                  "/ahsproject/" + props.tahun + "/" + record.idProject
                );
              }}
            >
              (Open AHS Project)
            </a>
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
      idProject: "",
      namaProject: "",
      tahun: "",
      wilayah: "",
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
      const newData = [...props.projects.data];
      row = { ...row, key: key };

      const index = newData.findIndex((item) => key === item.key);

      const editedContent = {
        NAMA_PROJECT: row.namaProject,
        ID_PROJECT: row.idProject,
        TAHUN: row.tahun,
        // ID_WILAYAH: //nanti masukin value si id nya, option editnya harus dirubah dan render nama2 wilayah ,
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
    const newData = JSON.parse(JSON.stringify(props.projects.data));
    const index = newData.findIndex((item) => key === item.key);
    console.log("try deleting record with key: " + key + " at index: " + index);
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
          dataSource={props.projects.data}
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

export default ProjectTable;
