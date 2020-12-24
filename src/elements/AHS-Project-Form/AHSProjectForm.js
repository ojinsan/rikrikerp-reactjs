import React, { useState, useEffect } from "react";
// IMPORT: Material Kit from ant-design
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Tooltip,
  Button,
  Drawer,
  Space,
} from "antd";

// IMPORT: Utilities
import { globalVariable } from "../../utils/global-variable";

// IMPORT: Other Components
import { LoadingSpinner } from "../../components";
import { useParams } from "react-router-dom";

import { SearchOutlined } from "@ant-design/icons";

import Highlighter from "react-highlight-words";

const hostname = globalVariable("backendAddress");

const AHSProjectForm = (props) => {
  let { tahun, projectid } = useParams();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

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
    // {
    //   title: "No AHS",
    //   dataIndex: "noAHS",
    //   width: 50,
    //   editable: true,
    //   required: false,
    // },
    {
      title: "Sumber",
      dataIndex: "sumber",
      width: 120,
      editable: true,
      required: false,
    },
    {
      title: "Nama AHS / Nama Uraian",
      dataIndex: "name",
      width: 120,
      editable: true,
      required: true,
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
      },
      ...getColumnSearchProps("name"),
      render: (_, record) => (
        <div
          placement="topLeft"
          onClick={() => {
            console.log("see detail");
          }}
        >
          {record.name}
        </div>
      ),
    },
    {
      title: "Kelompok",
      dataIndex: "kelompok",
      width: 100,
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
    // {
    //   title: "Koef",
    //   dataIndex: "koefisien",
    //   width: 65,
    //   editable: true,
    //   required: false,
    // },
    {
      title: "Keterangan",
      dataIndex: "keterangan",
      width: 50,
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
      title: "SS",
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

  const onSelectChange = (selectedRowKeys) => {
    console.log(selectedRowKeys);
    console.log("teet");
    // selectedRowKeys[selectedRowKeys.length - 1] = selectedRowKeys[
    //   selectedRowKeys.length - 1
    // ].split("-")[0];
    console.log("selectedRowKeys changed: ", selectedRowKeys);

    setSelectedRowKeys(
      selectedRowKeys.filter((value, index, self) => {
        return self.indexOf(value) === index;
      })
    );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((key, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          this.setState({ selectedRowKeys: newSelectedRowKeys });
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((key, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          this.setState({ selectedRowKeys: newSelectedRowKeys });
        },
      },
    ],
  };

  const onSubmit = async () => {
    var submitedData = selectedRowKeys.map((dataidx, idx) => data[dataidx]);
    setIsLoading(true);
    console.log("success validating: ");
    console.log(submitedData);

    try {
      const response = await fetch(
        hostname + "/project/post-new-ahs-project-utama-detail/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idproject: projectid,
            tahun: tahun,
            AHSProjects: submitedData,
          }),
        }
      );
      if (response.ok) {
        const responseBody = await response.json();
        console.log(responseBody);
        props.onClose();
        props.dispatch({
          type: "ACTION_SELECTED",
          payload: {
            option: "FETCH",
            index: -1,
            newData: {},
            row: {},
          },
        });
      } else {
        const responseBody = await response.json();
        throw new Error(
          "Gagal menyimpan dalam database. Status: " +
            response.status +
            " " +
            responseBody.message +
            " : " +
            responseBody.HS !=
          null
            ? responseBody.HS.join(", ")
            : null
        );
      }
    } catch (err) {
      alert(err); // TypeError: failed to fetch
      console.log(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetch(hostname + "/data-source/get-ahs-sumber-full-data", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        var tableData = response.AHS.map((ahs, idx) => {
          const data = {
            id: ahs.ID_AHS_SUMBER_UTAMA,
            isAHS: true,
            key: idx.toString(),
            name: ahs.NAMA_AHS,
            noAHS: ahs.NOMOR_AHS,
            kelompok: ahs.KHUSUS ? "Khusus" : "Non-Khusus",
            satuan: ahs.SATUAN_AHS,
            sumber: ahs.SUMBER_AHS,
            children: [],
            childrens: ahs.AHS_SUMBER_DETAILs.map((ahsd, i) => {
              return {
                key: idx.toString() + "-" + i.toString(),
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
            }),
          };
          console.log(data.children);
          if (data.children.length == 0) {
            delete data.children;
          }
          return data;
        });
        return tableData;
      })
      .then((tableData) => {
        setData(tableData);
      });
  }, []);

  return (
    <>
      <Drawer
        title="Import from AHS Sumber"
        width={"85%"}
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

                <Button
                  onClick={() => {
                    onSubmit();
                  }}
                  type="primary"
                >
                  Submit
                </Button>
              </div>
            )}
          </div>
        }
      >
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          expandable={{
            expandIconColumnIndex: columns.length + 1,
          }}
        />
      </Drawer>
    </>
  );
};

export default AHSProjectForm;
