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
} from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { PlusCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons";
import { globalVariable } from "../../utils/global-variable";
// import AHSSumberLookup from "../AHS-Sumber-Lookup/AHSSumberLookup";
import { AHSSumberLookup } from "../../elements";
import { HSSelection } from "../../elements";

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
    dataIndex == "koefisien" ||
    dataIndex == "sumber" ||
    dataIndex == "keterangan" ||
    dataIndex == "gambar"
  ) {
    required = false;
  }
  var inputNode = inputType === "number" ? <InputNumber /> : <Input />;
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
const AHSProjectTable = (props) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;

  const [AHSPUtamaId, setAHSPUtamaId] = useState(null);

  const [sortedInfo, setSortedInfo] = useState(null);
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const [showAHSSumberLookup, setShowAHSSumberLookup] = useState(false);
  const [idAHSSumberUtama, setIdAHSSumberUtama] = useState(0);

  const [showHSSelection, setShowHSSelection] = useState(false);
  const [selectedAHSProjectId, setSelectedAHSProjectId] = useState(0);

  var searchInput = "";

  const [data, setData] = useState([]);

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
      title: "No Urut",
      dataIndex: "noUrut",
      width: 48,
      editable: true,
      required: false,
    },
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
      title: "Nama AHS / Nama Uraian Editan",
      dataIndex: "nameBaru",
      width: "40%",
      editable: true,
      required: true,
      sorter: {
        compare: (a, b) => a.nameBaru.localeCompare(b.nameBaru),
      },
      ...getColumnSearchProps("nameBaru"),
      render: (_, record) => (
        <Tooltip placement="topLeft" title={record.nameOri}>
          {/* {"[]"} */}
          <div
            onClick={() => {
              setIdAHSSumberUtama(record.id);
              setShowAHSSumberLookup(true);
            }}
          >
            {record.nameBaru}
          </div>
        </Tooltip>
      ),
    },
    // {
    //   title: "Nama AHS / Nama Uraian Original",
    //   dataIndex: "nameOri",
    //   width: "40%",
    //   editable: true,
    //   required: true,
    //   sorter: {
    //     compare: (a, b) => a.nameOri.localeCompare(b.nameOri),
    //   },
    //   ...getColumnSearchProps("nameOri"),
    // },
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
      title: "Harga Satuan",
      dataIndex: "HS",
      width: 65,
      editable: false,
      required: false,
      render: (_, record) => (
        <Tooltip placement="topLeft" title={record.nameOri}>
          {/* {"[]"} */}
          <div
            onClick={() => {
              setSelectedAHSProjectId(record.id);
              setShowHSSelection(true);
            }}
          >
            {record.HS}
          </div>
        </Tooltip>
      ),
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
      render: (keterangan) => (
        <Tooltip placement="topLeft" title={keterangan}>
          {keterangan}
        </Tooltip>
      ),
    },
    {
      title: " ",
      dataIndex: "gambar",
      width: 30,
      editable: false,
      required: false,
      ellipsis: {
        showTitle: true,
      },
      render: (gambar, record) =>
        gambar !== undefined && (
          <Tooltip placement="topLeft" title={<img src={gambar} />}>
            {/* {"[]"} */}
            {record.name}
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
        ) : (
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
          </div>
        );
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
        inputType: col.dataIndex === "koefisien" ? "number" : "text",
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

  const handleDelete = (key) => {
    console.log(key);
    try {
      const newData = [...props.AHSPs.data];
      const keysTemp = key.split("-");

      console.log("utama delete");
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
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }

    // const keysTemp = key.split("-");
    // console.log(keysTemp);
    // const dataSource = [...data];
    // if (keysTemp.length == 2) {
    //     const index = dataSource.findIndex((item) => {
    //         if (item.children !== undefined && item.children !== null) {
    //             const childIndex = item.children.findIndex(
    //                 (child) => key === child.key
    //             );
    //             if (childIndex == null) {
    //                 return false;
    //             } else {
    //                 return true;
    //             }
    //         } else {
    //             return key === item.key;
    //         }
    //     });

    //     console.log(index);

    //     dataSource[index].children = dataSource[index].children.filter(
    //         (child) => {
    //             console.log(child.key);
    //             console.log(key);
    //             return child.key !== key;
    //         }
    //     );

    //     console.log(dataSource[index].children);
    //     if (dataSource[index].children.length == 0) {
    //         console.log("nah");
    //         delete dataSource[index]["children"];
    //     }

    //     console.log(key);
    //     console.log(dataSource);

    //     setData(dataSource);
    // } else {
    //     setData(dataSource.filter((item) => item.key !== key));
    // }
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      console.log(row);
      const newData = [...props.AHSPs.data];
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

        if (index > -1) {
          console.log("sini");
          const item = newData[index].children[childIndex];
          console.log(item);
          console.log({ ...item, ...row });
          newData[index].children.splice(childIndex, 1, {
            ...item,
            ...row,
          });
          console.log(newData);
          setData(newData);

          setEditingKey("");
        } else {
          console.log("situ");
          newData.push(row);
          setData(newData);
          setEditingKey("");
        }
      } else {
        console.log("utama ngedit");

        console.log("Table page: edit AHS P utama");
        const index = newData.findIndex((item) => key === item.key);
        console.log(row);
        const editedContent = {
          ID_AHS_PROJECT_UTAMA: newData[index].id,
          NAMA_AHS: row.nameBaru,
          NOMOR_AHS: newData[index].noAHS,
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
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  // const mergedColumns = columns.map((col) => {
  //   if (!col.editable) {
  //     return col;
  //   }

  //   return {
  //     ...col,
  //     onCell: (record) => ({
  //       record,
  //       inputType: col.dataIndex === "koefisien" ? "number" : "text",
  //       dataIndex: col.dataIndex,
  //       title: col.title,
  //       editing: isEditing(record),
  //     }),
  //   };
  // });

  //   useEffect(() => {
  //     fetch(hostname + "/project/get-ahs-project-full-data?TAHUN=" + "2020", {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //     })
  //       .then((response) => response.json())
  //       .then((response) => {
  //         console.log(response);
  //         var tableData = response.AHS_PROJECT_UTAMA.map((ahs, idx) => {
  //           const data = {
  //             noUrut: ahs.NO_URUT,
  //             id: ahs.ID_AHS_PROJECT_UTAMA,
  //             isAHS: true,
  //             key: idx.toString(),
  //             nameBaru: ahs.NAMA_AHS_PROJECT,
  //             nameOri: ahs.AHS_SUMBER_UTAMA.NAMA_AHS,
  //             noAHS: ahs.NOMOR_AHS_PROJECT,
  //             kelompok: ahs.KHUSUS ? "Khusus" : "Non-Khusus",
  //             satuan: ahs.AHS_SUMBER_UTAMA.SATUAN_AHS,
  //             sumber: ahs.AHS_SUMBER_UTAMA.SUMBER_AHS,
  //             koefisien: ahs.KOEFISIEN_AHS,
  //             keterangan: ahs.PENJELASAN_KOEFISIEN_AHS,

  //             children: ahs.AHS_PROJECT_DETAIL.map((ahsd, i) => {
  //               return {
  //                 key: idx.toString() + "-" + i.toString(),
  //                 id: ahsd.ID_AHS_PROJECT_DETAIL,
  //                 isAHS: false,
  //                 name: ahsd.P_URAIAN,
  //                 kodeUraian: ahsd.KODE_URAIAN,
  //                 //noAHS: ahsd.ID_AHS_SUMBER_UTAMA,
  //                 kelompok: ahsd.P_KELOMPOK_URAIAN,
  //                 satuan: ahsd.P_SATUAN_URAIAN,
  //                 koefisien: ahsd.P_KOEFISIEN_URAIAN,
  //                 keterangan: ahsd.P_KETERANGAN_URAIAN,
  //                 HS: ahsd.hs ? ahsd.HS.HARGA : 0,
  //               };
  //             }),
  //           };
  //           if (data.children.length == 0) {
  //             delete data.children;
  //           }
  //           return data;
  //         });
  //         return tableData;
  //       })
  //       .then((tableData) => {
  //         setData(tableData);
  //       });
  //   }, []);

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
          dataSource={props.AHSPs.data}
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
      {showAHSSumberLookup && (
        <AHSSumberLookup
          showDrawer={() => {
            setShowAHSSumberLookup(true);
          }}
          onClose={() => {
            setShowAHSSumberLookup(false);
          }}
          visible={showAHSSumberLookup}
          ID_AHS_SUMBER_UTAMA={idAHSSumberUtama}
        />
      )}
      {showHSSelection && (
        <HSSelection
          showDrawer={() => {
            setShowHSSelection(true);
          }}
          onClose={() => {
            setShowHSSelection(false);
          }}
          visible={showHSSelection}
          ID_AHS_PROJECT={selectedAHSProjectId}
          TAHUN={props.tahun}
        />
      )}
    </>
  );
};

export default AHSProjectTable;
