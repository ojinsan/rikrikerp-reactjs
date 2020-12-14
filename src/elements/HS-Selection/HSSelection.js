import React, { useState, useEffect, useRef, useReducer } from "react";
// IMPORT: Material Kit from ant-design
import {
  Drawer,
  Button,
  Col,
  Row,
  Select,
  DatePicker,
  Spin,
  Collapse,
  List,
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Tooltip,
  Space,
} from "antd";
// IMPORT: Utilities
import { globalVariable } from "../../utils/global-variable";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";

// IMPORT: Other Components
import { LoadingSpinner } from "../../components";
import { HSWilayahTahunSelector } from "../../elements";

// SETUP: Initial
const hostname = globalVariable("backendAddress");
const { Option } = Select;
const { Panel } = Collapse;
var Pform = null; // form reference

// MARK: Initial Setup Function
function dataReducer(state, action) {
  switch (action.type) {
    case "ACTION_SELECTED": {
      console.log(action);
      return {
        ...state,
        selectedOption: action.payload.option,
        selectedIndex: action.payload.index,
        newData: action.payload.newData,
        row: action.payload.row,
      };
    }
    case "DELETE": {
      return {
        ...state,
        loading: true,
      };
    }
    case "DELETE_SUCCESS": {
      console.log("dispatch delete success");
      console.log(action.payload);
      return {
        ...state,
        loading: false,
        data: action.payload,
        selectedOption: "",
      };
    }
    case "UPDATE": {
      return {
        ...state,
        loading: true,
      };
    }
    case "UPDATE_SUCCESS": {
      console.log("dispatch update success");
      console.log(action.payload);
      return {
        ...state,
        loading: false,
        data: action.payload,
        selectedOption: "",
      };
    }
    case "FETCH_DATA": {
      return {
        ...state,
        loading: true,
        data: null,
      };
    }
    case "FETCH_DATA_SUCCESS": {
      console.log("dispatch fetch success");
      console.log(action.payload);
      return {
        ...state,
        loading: false,
        data: action.payload,
        selectedOption: "",
      };
    }
    case "RESET": {
      return { loading: false, selectedOption: "", data: null };
    }
    default:
      throw new Error(`Not supported action ${action.type}`);
  }
}

const HSSelection = (props) => {
  const [sortedInfo, setSortedInfo] = useState(null);
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [wilayahProject, setWilayahProject] = useState(null);
  const [tahun, setTahun] = useState(props.TAHUN);
  const [HSs, dispatch] = useReducer(dataReducer, {
    loading: false,
    selectedOption: "FETCH",
    data: null,
    selectedIndex: -1,
    newData: {},
    row: {},
  });

  var searchInput = "";

  console.log(props.ID_AHS_PROJECT);
  console.log(props.TAHUN);

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
      sorter: {
        compare: (a, b) => a.uraian.localeCompare(b.uraian),
      },
      ...getColumnSearchProps("uraian"),
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
      title: "harga",
      dataIndex: "harga",
      width: "40%",
      editable: true,
      sorter: {
        compare: (a, b) => a.harga - b.harga,
      },
      ...getColumnSearchProps("harga"),
    },
    {
      title: "kelompok",
      dataIndex: "kelompok",
      width: "40%",
      editable: true,
      sorter: {
        compare: (a, b) => a.kelompok.localeCompare(b.kelompok),
      },
      ...getColumnSearchProps("kelompok"),
    },
    {
      title: "sumber harga",
      dataIndex: "sumberHarga",
      width: "40%",
      editable: true,
      sorter: {
        compare: (a, b) => a.sumberHarga.localeCompare(b.sumberHarga),
      },
      ...getColumnSearchProps("sumberHarga"),
    },
    {
      title: "keterangan",
      dataIndex: "keterangan",
      width: "40%",
      editable: true,
      sorter: {
        compare: (a, b) => a.keterangan.localeCompare(b.keterangan),
      },
      ...getColumnSearchProps("keterangan"),
    },
    {
      title: "screenshot",
      dataIndex: "screenshot",
      width: "40%",
      editable: true,
    },
  ];

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

  const mergedColumns = columns.map((col) => {
    return col;
  });

  const isMountedRef = useRef(null);
  useEffect(() => {
    isMountedRef.current = true;
    console.log(
      "Info: HSs(dot)selectedOption is changed to " + HSs.selectedOption
    );

    if (HSs.selectedOption === "FETCH" && tahun && wilayahProject) {
      // dispatch({ type: "FETCH_DATA" });
      fetch(
        hostname +
          "/data-source/get-hs-specific-group-by-wilayah?TAHUN=" +
          tahun +
          "&ID_WILAYAH=" +
          wilayahProject,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((response) => {
          var j = 0;
          var tableData = [];
          response.Wilayah &&
            response.Wilayah.forEach((wilayah) => {
              tableData.push(
                ...wilayah.HS.map((hs, idx) => {
                  const data = {
                    idHS: hs.ID_HS,
                    uraian: hs.URAIAN,
                    satuan: hs.SATUAN,
                    harga: hs.HARGA,
                    kelompok: hs.TYPE,
                    sumberHarga: hs.SUMBER_HARGA,
                    keterangan: hs.KETERANGAN,
                    screenshot: hs.SCREENSHOT_HS,
                    key: j.toString(),
                    // ID_WILAYAH
                  };
                  j++;
                  return data;
                })
              );
            });
          return tableData;
        })
        .then((data) => {
          console.log("Fetch Success!");
          if (isMountedRef.current) {
            dispatch({
              type: "FETCH_DATA_SUCCESS",
              payload: data,
            });
          }
        });
    } else if (HSs.selectedOption == "DELETE") {
      console.log("delete the index " + HSs.selectedIndex);
      // dispatch({ type: "DELETE" });
      if (HSs.selectedIndex > -1) {
        console.log("ketemu");
        fetch(hostname + "/data-source/delete-hs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            TAHUN: tahun,
            ID_HS: HSs.data[HSs.selectedIndex].idHS,
          }),
        }).then((response) => {
          if (response.ok) {
            console.log("Success from back end");
            const newData = JSON.parse(JSON.stringify(HSs.data));
            newData.splice(HSs.selectedIndex, 1);
            console.log(newData);

            if (isMountedRef.current) {
              dispatch({
                type: "DELETE_SUCCESS",
                payload: newData,
              });
            }
          }
        });
      } else {
        console.log("situ");
      }
    } else if (HSs.selectedOption == "UPDATE") {
      console.log(HSs.selectedIndex);
      if (HSs.selectedIndex > -1) {
        fetch(hostname + "/data-source/update-hs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(HSs.newData),
        })
          .then((response) => {
            if (response.ok) {
              var newDatas = JSON.parse(JSON.stringify(HSs.data));
              const item = newDatas[HSs.selectedIndex];

              newDatas.splice(HSs.selectedIndex, 1, {
                ...item,
                ...HSs.row,
              });
              console.log(newDatas);
              dispatch({
                type: "UPDATE_SUCCESS",
                payload: newDatas,
              });
            } else {
              console.log("fetch failed");
              dispatch({
                type: "ACTION_SELECTED",
                payload: {
                  option: "FETCH",
                  index: -1,
                  newData: {},
                  row: {},
                },
              });
            }
          })
          .catch((error) => console.log(error));
        // setEditingKey("");
      } else {
        console.log("Index not found, failed to edit");
        // setEditingKey("");
      }
    } else {
      //dispatch({ type: "RESET" });
    }
    return () => (isMountedRef.current = false);
  }, [HSs.selectedOption, tahun, wilayahProject]);

  return (
    <>
      <Drawer
        title="Select HS"
        width={720}
        onClose={props.onClose}
        visible={props.visible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: "right",
            }}
          >
            {isLoading ? (
              <LoadingSpinner isOverlay={false} />
            ) : (
              <div>
                <Button onClick={props.onClose} style={{ marginRight: 8 }}>
                  Cancel
                </Button>
                {/* 
                <Button
                  onClick={() => {
                    onSubmit();
                  }}
                  type="primary"
                >
                  Submit
                </Button> */}
              </div>
            )}
          </div>
        }
      >
        <HSWilayahTahunSelector
          onWilayahChangeValue={(value) => {
            setWilayahProject(value);
            dispatch({
              type: "ACTION_SELECTED",
              payload: {
                option: "FETCH",
                index: -1,
                newData: {},
                row: {},
              },
            });
          }}
          onTahunChangeValue={(value) => {
            setTahun(value);
            dispatch({
              type: "ACTION_SELECTED",
              payload: {
                option: "FETCH",
                index: -1,
                newData: {},
                row: {},
              },
            });
          }}
          dispatch={dispatch}
        />
        <Table
          //   components={{
          //     body: {
          //       cell: EditableCell,
          //     },
          //   }}
          rowClassName={(record) => record.color.replace("#", "")}
          bordered
          dataSource={HSs.data}
          columns={mergedColumns}
          rowClassName="editable-row"
          expandable={{
            expandIconColumnIndex: columns.length - 1,
          }}
          size="small"
        />
      </Drawer>
    </>
  );
};

export default HSSelection;
