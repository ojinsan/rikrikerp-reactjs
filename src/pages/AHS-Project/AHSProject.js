import React, { useState, useEffect, useRef, useReducer } from "react";
import { AHSProjectForm, AHSProjectTable } from "../../elements";
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { useParams } from "react-router-dom";

// IMPORT: Components
import {
  HSTable,
  HSForm,
  HSWilayahTahunSelector,
  HSSort,
} from "../../elements";

import { globalVariable } from "../../utils/global-variable";

const hostname = globalVariable("backendAddress");

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

const AHSProject = (props) => {
  const [showHSForm, setShowHSForm] = useState(false);
  const [showAHSProjectForm, setShowAHSProjectForm] = useState(false);
  const [wilayahProject, setWilayahProject] = useState(null);
  let { tahun, projectid } = useParams();
  // const [tahun, setTahun] = useState(null);
  const [AHSPs, dispatch] = useReducer(dataReducer, {
    loading: false,
    selectedOption: "FETCH",
    data: null,
    selectedIndex: -1,
    newData: {},
    row: {},
  });

  const isMountedRef = useRef(null);
  useEffect(() => {
    isMountedRef.current = true;
    console.log(
      "Info: AHSPs(dot)selectedOption is changed to " + AHSPs.selectedOption
    );
    setShowAHSProjectForm(false);
    if (AHSPs.selectedOption === "FETCH" && tahun) {
      // dispatch({ type: "FETCH_DATA" });
      fetch(
        hostname +
          "/project/get-ahs-project-full-data?TAHUN=" +
          tahun +
          "&ID_PROJECT=" +
          projectid,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          var tableData = response.AHS_PROJECT_UTAMA.map((ahs, idx) => {
            const data = {
              noUrut: ahs.NO_URUT,
              id: ahs.ID_AHS_PROJECT_UTAMA,
              isAHS: true,
              key: idx.toString(),
              nameBaru: ahs.NAMA_AHS_PROJECT,
              nameOri: ahs.AHS_SUMBER_UTAMA?.NAMA_AHS,
              noAHS: ahs.NOMOR_AHS_PROJECT,
              kelompok: ahs.KHUSUS ? "Khusus" : "Non-Khusus",
              satuan: ahs.AHS_SUMBER_UTAMA?.SATUAN_AHS,
              sumber: ahs.AHS_SUMBER_UTAMA?.SUMBER_AHS,
              koefisien: ahs.KOEFISIEN_AHS,
              keterangan: ahs.PENJELASAN_KOEFISIEN_AHS,

              children: ahs.AHS_PROJECT_DETAIL.map((ahsd, i) => {
                return {
                  key: idx.toString() + "-" + i.toString(),
                  id: ahsd.ID_AHS_PROJECT_DETAIL,
                  isAHS: false,
                  nameBaru: ahsd.P_URAIAN,
                  kodeUraian: ahsd.KODE_URAIAN,
                  //noAHS: ahsd.ID_AHS_SUMBER_UTAMA,
                  kelompok: ahsd.P_KELOMPOK_URAIAN,
                  satuan: ahsd.P_SATUAN_URAIAN,
                  koefisien: ahsd.P_KOEFISIEN_URAIAN,
                  keterangan: ahsd.P_KETERANGAN_URAIAN,
                  HS: ahsd.HS ? ahsd.HS.HARGA : 0,
                };
              }),
            };
            if (data.children.length == 0) {
              delete data.children;
            }
            return data;
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
    } else if (AHSPs.selectedOption == "DELETE") {
      if (AHSPs.selectedIndex instanceof Array) {
        if (AHSPs.selectedIndex[0] > -1 && AHSPs.selectedIndex[1] > -1) {
          fetch(hostname + "/project/delete-ahs-project-utama", {
            //signal: controller.signal,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              TAHUN: tahun,
              ID_AHS_PROJECT_DETAIL: AHSPs.data[AHSPs.selectedIndex].id,
            }),
          }).then((response) => {
            if (response.ok) {
              console.log("Success from back end");
              const newData = JSON.parse(JSON.stringify(AHSPs.data));
              newData[AHSPs.selectedIndex[0]].children.splice(
                AHSPs.selectedIndex[1],
                1
              );
              // newData.splice(AHSPs.selectedIndex, 1);
              console.log(newData);

              if (isMountedRef.current) {
                dispatch({
                  type: "DELETE_SUCCESS",
                  payload: newData,
                });
              }
            }
          });
        }
        // delete AHS detail
      } else {
        console.log("delete AHS Utama with the index " + AHSPs.selectedIndex);
        if (AHSPs.selectedIndex > -1) {
          fetch(hostname + "/project/delete-ahs-project-utama", {
            //signal: controller.signal,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              TAHUN: tahun,
              ID_AHS_PROJECT_UTAMA: AHSPs.data[AHSPs.selectedIndex].id,
            }),
          }).then((response) => {
            if (response.ok) {
              console.log("Success from back end");
              const newData = JSON.parse(JSON.stringify(AHSPs.data));
              newData.splice(AHSPs.selectedIndex, 1);
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
          console.log("Error, useEffect can't recognize index");
        }
      }
    } else if (AHSPs.selectedOption == "UPDATE") {
      console.log(AHSPs.selectedIndex);
      if (AHSPs.selectedIndex > -1) {
        console.log(AHSPs.newData);
        fetch(hostname + "/project/update-ahs-project-utama?TAHUN=" + tahun, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(AHSPs.newData),
        })
          .then((response) => {
            if (response.ok) {
              var newDatas = JSON.parse(JSON.stringify(AHSPs.data));
              const item = newDatas[AHSPs.selectedIndex];

              newDatas.splice(AHSPs.selectedIndex, 1, {
                ...item,
                ...AHSPs.row,
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
  }, [AHSPs.selectedOption, tahun, wilayahProject]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h4>This is AHS Project</h4>
        <Button
          type="primary"
          className="d-flex p-2 align-items-center"
          onClick={() => {
            setShowAHSProjectForm(!showAHSProjectForm);
          }}
        >
          <PlusOutlined /> Import From AHS Sumber
        </Button>
      </div>

      {/* <AHSProjectTable /> */}

      {/* <HSWilayahTahunSelector
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
      /> */}

      <AHSProjectForm
        showDrawer={() => {
          setShowAHSProjectForm(true);
        }}
        onClose={() => {
          setShowAHSProjectForm(false);
        }}
        visible={showAHSProjectForm}
        dispatch={dispatch}
      />

      <AHSProjectTable dispatch={dispatch} AHSPs={AHSPs} tahun={tahun} />
    </>
  );
};

export default AHSProject;
