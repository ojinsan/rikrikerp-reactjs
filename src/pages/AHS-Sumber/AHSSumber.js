import React, { useState, useEffect, useRef, useReducer } from "react";

// IMPORT: Material Kit from ant-design
import { Input, InputNumber, Form, Button } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { AHSSumberTable, AHSSumberForm } from "../../elements";

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

// ======================= MARK: Component =======================
const AHSSumber = (props) => {
    const [showAHSSumberForm, setShowAHSSumberForm] = useState(false);
    const [AHSs, dispatch] = useReducer(dataReducer, {
        loading: false,
        selectedOption: "FETCH",
        data: null,
        selectedIndex: -1,
        newData: {},
        row: {},
    });

    const isMountedRef = useRef(null);
    useEffect(() => {
        //let mounted = true;
        isMountedRef.current = true;
        console.log(
            "Info: wilayah(dot)selectedOption is changed to " +
                AHSs.selectedOption
        );
        setShowAHSSumberForm(false);
        if (AHSs.selectedOption === "FETCH") {
            // dispatch({ type: "FETCH_DATA" });
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
                            children: ahs.AHS_SUMBER_DETAILs.map((ahsd, i) => {
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
        } else if (AHSs.selectedOption == "DELETE") {
            if (AHSs.selectedIndex instanceof Array) {
                // delete AHS detail
            } else {
                console.log(
                    "delete AHS Utama with the index " + AHSs.selectedIndex
                );
                if (AHSs.selectedIndex > -1) {
                    console.log("ketemu");
                    fetch(hostname + "/data-source/delete-ahs-sumber-utama", {
                        //signal: controller.signal,
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            ID_AHS_SUMBER_UTAMA:
                                AHSs.data[AHSs.selectedIndex].id,
                        }),
                    }).then((response) => {
                        if (response.ok) {
                            console.log("Success from back end");
                            const newData = JSON.parse(
                                JSON.stringify(AHSs.data)
                            );
                            newData.splice(AHSs.selectedIndex, 1);
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
        } else if (AHSs.selectedOption == "UPDATE") {
            if (AHSs.selectedIndex instanceof Array) {
                // update AHS detail
            } else {
                console.log(AHSs.selectedIndex);
                if (AHSs.selectedIndex > -1) {
                    fetch(hostname + "/data-source/update-ahs-sumber-utama", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(AHSs.newData),
                    })
                        .then((response) => {
                            if (response.ok) {
                                var newDatas = JSON.parse(
                                    JSON.stringify(AHSs.data)
                                );
                                const item = newDatas[AHSs.selectedIndex];

                                newDatas.splice(AHSs.selectedIndex, 1, {
                                    ...item,
                                    ...AHSs.row,
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
            }
        } else {
            //dispatch({ type: "RESET" });
        }
        return () => (isMountedRef.current = false);
    }, [AHSs.selectedOption]);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h4>This is AHS Sumber</h4>
                <Button
                    type="primary"
                    className="d-flex p-2 align-items-center"
                    onClick={() => {
                        setShowAHSSumberForm(!showAHSSumberForm);
                    }}
                >
                    <PlusOutlined /> New AHS Sumber Record
                </Button>
            </div>

            <AHSSumberTable />

            <AHSSumberForm
                showDrawer={() => {
                    setShowAHSSumberForm(true);
                }}
                onClose={() => {
                    setShowAHSSumberForm(false);
                }}
                visible={showAHSSumberForm}
            />
        </>
    );
};

export default AHSSumber;
