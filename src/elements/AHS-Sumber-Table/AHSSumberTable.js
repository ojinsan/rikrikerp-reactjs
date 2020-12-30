import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Tooltip,
  Space,
  Button,
  Select,
} from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
// IMPORT: Other Elements
import { AHSSumberDetailForm } from "../../elements";
const { Option } = Select;

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
    dataIndex == "noAHS" ||
    dataIndex == "satuan" ||
    // dataIndex == "koefisien" ||
    dataIndex == "sumber" ||
    dataIndex == "keterangan" ||
    dataIndex == "gambar"
  ) {
    required = false;
  }

  console.log(inputType);
  var inputNode =
    inputType === "number" ? (
      <InputNumber />
    ) : inputType === "skip" ? null : (
      <Input />
    );
  record &&
    (inputNode = record.isAHS && dataIndex == "koefisien" ? null : inputNode);

  record &&
    (inputNode =
      !record.isAHS && dataIndex == "kelompok" ? (
        <Select placeholder="Apakah Ada Detail?">
          <Option key="Upah" value="Upah">
            Upah
          </Option>
          <Option key="Bahan" value={"Bahan"}>
            Bahan
          </Option>
        </Select>
      ) : (
        inputNode
      ));

  return (
    <td {...restProps}>
      {editing && !(record.isAHS && dataIndex == "koefisien") ? (
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
const AHSSumberTable = (props) => {
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const [form] = Form.useForm();
  const [AHSDetails, setAHSDetails] = useState([]);
  const [AHSUtamaId, setAHSUtamaId] = useState(null);

  const [sortedInfo, setSortedInfo] = useState(null);
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [showAHSSumberDetailForm, setShowAHSSumberDetailForm] = useState(false);
  var searchInput = "";

  // MARK: Filter Set Up
  const getColumnSearchProps = (dataIndex) => {
    const getDescendantValues = (record) => {
      const values = [];
      console.log(record);

      (function recurse(record) {
        console.log(record);
        values.push(record[dataIndex].toString().toLowerCase());
        record.hasOwnProperty("children") && record.children.forEach(recurse);
      })(record);

      return values;
    };

    return {
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
            style={{
              width: 188,
              marginBottom: 8,
              display: "block",
            }}
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
      onFilter: (value, record) => {
        const recordName = record[dataIndex] || record.children[dataIndex];
        const searchLower = value.toLowerCase();
        return (
          recordName.toString().toLowerCase().includes(searchLower) ||
          getDescendantValues(record).some((descValue) =>
            descValue.includes(searchLower)
          )
        );
      },
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.select(), 100);
        }
      },
      getDescendantValues: (record) => {
        const values = [];
        (function recurse(record) {
          values.push(record[dataIndex].toString().toLowerCase());
          record.children.forEach(recurse);
        })(record);
        return values;
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
    };
  };

  // MARK: Column Set Up
  const columns = [
    {
      title: "No AHS",
      dataIndex: "noAHS",
      width: 70,
      editable: true,
      required: false,
    },
    {
      title: "Sumber",
      dataIndex: "sumber",
      width: "15%",
      editable: true,
      required: false,
      sorter: {
        compare: (a, b) => a.sumber.localeCompare(b.sumber),
      },
      ...getColumnSearchProps("sumber"),
    },
    {
      title: "Nama AHS / Nama Uraian",
      dataIndex: "name",
      width: "40%",
      editable: true,
      required: true,
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
      },
      ...getColumnSearchProps("name"),
    },
    {
      title: "Kelompok",
      dataIndex: "kelompok",
      width: 120,
      editable: true,
      required: true,
      sorter: {
        compare: (a, b) => a.kelompok.localeCompare(b.kelompok),
      },
      ...getColumnSearchProps("kelompok"),
    },
    {
      title: "Satuan",
      dataIndex: "satuan",
      width: 65,
      editable: true,
      required: false,
      sorter: {
        compare: (a, b) => a.satuan.localeCompare(b.satuan),
      },
      ...getColumnSearchProps("satuan"),
    },
    {
      title: "Koef",
      dataIndex: "koefisien",
      width: 65,
      editable: true,
      required: false,
    },
    {
      title: "Keterangan",
      dataIndex: "keterangan",
      width: 150,
      editable: true,
      required: false,
      ellipsis: {
        showTitle: true,
      },
      sorter: {
        compare: (a, b) => a.keterangan.localeCompare(b.keterangan),
      },
      ...getColumnSearchProps("name"),
      render: (keterangan) => (
        <Tooltip placement="topLeft" title={keterangan}>
          {keterangan}
        </Tooltip>
      ),
    },
    {
      title: " ",
      dataIndex: "gambar",
      width: 80,
      editable: false,
      required: false,
      ellipsis: {
        showTitle: true,
      },
      render: (gambar, record) =>
        gambar !== undefined && (
          <Tooltip placement="topLeft" title={<img src={gambar} />}>
            {"[]"}
            {/* {record.name} */}
          </Tooltip>
        ),
    },
    {
      title: "operation",
      width: 120,
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              //href="javascript:;"
              onClick={() => save(record.key)}
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
        ) : props.AHSs.data.length >= 1 ? (
          <div>
            <a disabled={editingKey !== ""} onClick={() => edit(record)}>
              Edit
            </a>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key)}
            >
              <a> Delete </a>
            </Popconfirm>
            {record.isAHS && (
              <a
                onClick={() => {
                  setAHSUtamaId(record.id);
                  setShowAHSSumberDetailForm(true);
                }}
              >
                Tambah AHSD
              </a>
            )}
          </div>
        ) : null;
      },
    },
    {
      title: " ",
      dataIndex: "khusus",
      width: 35,
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
        inputType:
          col.dataIndex === "koefisien"
            ? "number"
            : col.dataIndex === "kelompok"
            ? "select"
            : "text",
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
      name: "",
      noAHS: "",
      kelompok: "",
      satuan: "",
      koefisien: "",
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
      const row = await form.validateFields();
      console.log(row);
      const newData = [...props.AHSs.data];
      const keysTemp = key.split("-");
      if (keysTemp.length == 2) {
        var childIndex = null;
        const index = newData.findIndex((item) => {
          if (item.children !== undefined && item.children !== null) {
            childIndex = item.children.findIndex((child) => {
              return key === child.key;
            });
            if (childIndex === -1) {
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
        console.log(row);

        const editedContent = {
          URAIAN: row.name,
          KODE_URAIAN: row.kodeUraian,
          KELOMPOK_URAIAN: row.kelompok,
          SATUAN_URAIAN: row.satuan,
          KOEFISIEN_URAIAN: row.koefisien,
          KETERANGAN_URAIAN: row.keterangan,
          ID_AHS_SUMBER_DETAIL: newData[index].children[childIndex].id,
        };

        props.dispatch({
          type: "ACTION_SELECTED",
          payload: {
            option: "UPDATE",
            index: [index, childIndex],
            newData: editedContent,
            row: { ...row, key: key },
          },
        });
        setEditingKey("");
      } else {
        console.log("Table page: edit AHS utama");
        const index = newData.findIndex((item) => key === item.key);
        console.log(row);
        const editedContent = {
          ID_AHS_SUMBER_UTAMA: newData[index].id,
          NAMA_AHS: row.name,
          NOMOR_AHS: row.noAHS,
          SUMBER_AHS: row.sumber,
          SATUAN_AHS: row.satuan,
          KHUSUS: row.kelompok == "Non-khusus" ? false : true,
          KETERANGAN: row.keterangan,
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
        //     console.log("ketemu");
        //     const item = newData[index];
        //     newData.splice(index, 1, { ...item, ...row });
        //     setData(newData);
        //     setEditingKey("");
        // } else {
        //     newData.push(row);
        //     setData(newData);
        //     setEditingKey("");
        // }
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (key) => {
    console.log(key);
    try {
      const newData = [...props.AHSs.data];
      const keysTemp = key.split("-");
      if (keysTemp.length == 2) {
        var childIndex = null;
        const index = newData.findIndex((item) => {
          if (item.children !== undefined && item.children !== null) {
            console.log(item);
            childIndex = item.children.findIndex((child) => {
              console.log(child);
              return key === child.key;
            });
            if (childIndex === -1) {
              return false;
            } else {
              return true;
            }
          } else {
            // ga mungkin kesini harusnya
            console.log("it's weird");
            return key === item.key;
          }
        });
        console.log(index);
        console.log(childIndex);
        props.dispatch({
          type: "ACTION_SELECTED",
          payload: {
            option: "DELETE",
            index: [index, childIndex],
            newData: {},
          },
        });

        // if (index > -1) {
        //     console.log("jol delete");
        //     newData[index].children.splice(childIndex, 1);
        //     setData(newData);
        // } else {
        //     console.log("situ");
        // }
      } else {
        console.log("delete AHS utama");
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
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
    ///////////////////////////
  };

  return (
    <>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          rowClassName={(record) => record.color.replace("#", "")}
          bordered
          dataSource={props.AHSs.data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
          expandable={{
            expandIconColumnIndex: columns.length - 1,
          }}
          size="small"
        />
      </Form>
      {showAHSSumberDetailForm && (
        <AHSSumberDetailForm
          showDrawer={() => {
            setShowAHSSumberDetailForm(true);
          }}
          onClose={() => {
            setShowAHSSumberDetailForm(false);
          }}
          visible={showAHSSumberDetailForm}
          dispatch={props.dispatch}
          isNewAHS={false}
          setAHSDetails={(AHSDetails) => {
            setAHSDetails(AHSDetails);
          }}
          AHSUtamaId={AHSUtamaId}
        />
      )}
    </>
  );
};

export default AHSSumberTable;
