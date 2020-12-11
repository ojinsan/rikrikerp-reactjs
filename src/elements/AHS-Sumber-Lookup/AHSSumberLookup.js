import React, { useState, useEffect } from "react";
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

// SETUP: Initial
const hostname = globalVariable("backendAddress");
const { Option } = Select;
const { Panel } = Collapse;
var Pform = null; // form reference

const AHSSumberLookup = (props) => {
  const [sortedInfo, setSortedInfo] = useState(null);
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [AHSUtama, setAHSUtama] = useState({});
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

  const columns = [
    {
      title: "No AHS",
      dataIndex: "noAHS",
      width: 70,
      editable: true,
      required: false,
    },
    // {
    //   title: "Sumber",
    //   dataIndex: "sumber",
    //   width: "15%",
    //   editable: true,
    //   required: false,
    //   sorter: {
    //     compare: (a, b) => a.name.localeCompare(b.name),
    //   },
    //   ...getColumnSearchProps("sumber"),
    // },
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
        compare: (a, b) => a.name.localeCompare(b.name),
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
        compare: (a, b) => a.name.localeCompare(b.name),
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
        compare: (a, b) => a.name.localeCompare(b.name),
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
    // {
    //   title: " ",
    //   dataIndex: "khusus",
    //   width: 35,
    // },
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

  useEffect(() => {
    fetch(
      hostname +
        "/data-source/get-ahs-sumber-full-lookup?ID_AHS_SUMBER_UTAMA=" +
        props.ID_AHS_SUMBER_UTAMA,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    ).then((res) =>
      res.json().then((response) => {
        console.log(response);
        var newSetTableData = response.AHS_SUMBER_UTAMA.AHS_SUMBER_DETAILs.map(
          (ahsd, i) => {
            return {
              key: i.toString(),
              id: ahsd.ID_AHS_SUMBER_DETAIL,
              isAHS: false,
              name: ahsd.URAIAN,
              kodeUraian: ahsd.KODE_URAIAN,
              noAHS: ahsd.ID_AHS_SUMBER_UTAMA,
              kelompok: ahsd.KELOMPOK_URAIAN,
              satuan: ahsd.SATUAN_URAIAN,
              koefisien: ahsd.KOEFISIEN_URAIAN,
              keterangan: ahsd.KETERANGAN_URAIAN,
            };
          }
        );
        setAHSUtama({
          id: response.AHS_SUMBER_UTAMA.ID_AHS_SUMBER_UTAMA,
          isAHS: true,
          name: response.AHS_SUMBER_UTAMA.NAMA_AHS,
          noAHS: response.AHS_SUMBER_UTAMA.NOMOR_AHS,
          kelompok: response.AHS_SUMBER_UTAMA.KHUSUS ? "Khusus" : "Non-Khusus",
          satuan: response.AHS_SUMBER_UTAMA.SATUAN_AHS,
          sumber: response.AHS_SUMBER_UTAMA.SUMBER_AHS,
        });
        setTableData(newSetTableData);
      })
    );
  });

  return (
    <>
      <Drawer
        title="Create New RAB Record"
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
        <div>Nama AHS: {AHSUtama.name}</div>
        <div>No AHS: {AHSUtama.noAHS}</div>
        <div>Kelompok: {AHSUtama.kelompok}</div>
        <div>Satuan: {AHSUtama.satuan}</div>
        <div>Sumber: {AHSUtama.sumber}</div>
        <Table
          //   components={{
          //     body: {
          //       cell: EditableCell,
          //     },
          //   }}
          rowClassName={(record) => record.color.replace("#", "")}
          bordered
          dataSource={tableData}
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

export default AHSSumberLookup;
