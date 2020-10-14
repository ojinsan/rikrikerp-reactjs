import React, { useState, useEffect, useRef, useReducer } from "react";

// IMPORT: Material Kit from ant-design
import { Input, InputNumber, Form, Button } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

// IMPORT: Components
import {
    HSTable,
    HSForm,
    HSWilayahTahunSelector,
    HSSort,
} from "../../elements";
import { SortBox } from "../../components";
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

const HS = (props) => {
    const [showHSForm, setShowHSForm] = useState(false);
    const [wilayahProject, setWilayahProject] = useState(null);
    const [tahun, setTahun] = useState(null);
    const [HSs, dispatch] = useReducer(dataReducer, {
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
            "Info: HSs(dot)selectedOption is changed to " + HSs.selectedOption
        );
        setShowHSForm(false);
        if (HSs.selectedOption === "FETCH") {
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
                        TAHUN: props.tahun,
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

            <div className="d-flex justify-content-between align-items-center">
                <h4>This is HS</h4>
                {tahun && wilayahProject && (
                    <Button
                        type="primary"
                        className="d-flex p-2 align-items-center"
                        onClick={() => {
                            setShowHSForm(!showHSForm);
                        }}
                    >
                        <PlusOutlined /> New HS Record
                    </Button>
                )}
            </div>

            {/* <HSSort
                onChange={(newDatas) => {
                    const newDatasTemp = JSON.parse(JSON.stringify(newDatas));
                    console.log(newDatasTemp);
                    setData(newDatasTemp);
                }}
                datas={originData}
            /> */}
            {/* <SortBox /> */}
            {tahun && wilayahProject && (
                <HSTable
                    // setData={(data) => {
                    //     setData(data);
                    // }}
                    HSs={HSs}
                    tahun={tahun}
                    wilayahProject={wilayahProject}
                    dispatch={dispatch}
                />
            )}

            {tahun && wilayahProject && (
                <HSForm
                    tahun={tahun}
                    wilayahProject={wilayahProject}
                    showDrawer={() => {
                        setShowHSForm(true);
                    }}
                    onClose={() => {
                        setShowHSForm(false);
                    }}
                    visible={showHSForm}
                    dispatch={dispatch}
                />
            )}
        </>
    );
};

export default HS;
