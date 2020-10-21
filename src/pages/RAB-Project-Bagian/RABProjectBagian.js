import React, { useState, useEffect, useRef, useReducer } from "react";

// IMPORT: Material Kit from ant-design
import { Input, InputNumber, Form, Button } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

// IMPORT: Components
import {
    HSTable,
    RABProjectBagianForm,
    RABProjectBagianTable,
    HSWilayahTahunSelector,
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

const RABProjectBagian = () => {
    const PROJECT_ID = 1; //nanti cek di slug aja
    const tahun = 2010; //nanti di cek di slug juga
    const [showRABPBForm, setShowRABPBForm] = useState(false);
    const [RABPBs, dispatch] = useReducer(dataReducer, {
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
            "Info: RABPBs(dot)selectedOption is changed to " +
                RABPBs.selectedOption
        );
        setShowRABPBForm(false);
        if (RABPBs.selectedOption === "FETCH") {
            // dispatch({ type: "FETCH_DATA" });
            fetch(
                hostname +
                    "/project/get-rab-project-bagian-full-data?TAHUN=" +
                    tahun +
                    "&ID_PROJECT=" +
                    PROJECT_ID,
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
                    response.RABProjectBagian &&
                        (tableData = response.RABProjectBagian.map(
                            (rabpb, idx) => {
                                const data = {
                                    //props
                                    jenis: rabpb.JENIS,
                                    bagian: rabpb.BAGIAN,
                                    subBagian: rabpb.SUB_BAGIAN,
                                    idTtd: rabpb.ID_TTD,
                                    keteranganJudulRekap:
                                        rabpb.KETERANGAN_JUDUL_REKAP,
                                    jumlahRab: rabpb.JUMLAH_RAB,
                                    totalUpahTdp: rabpb.TOTAL_UPAH_TDP,
                                    TotalBahanTdp: rabpb.TOTAL_BAHAN_TDP,
                                    totalUpahNonTdp: rabpb.TOTAL_UPAH_NON_TDP,
                                    totalBahanNonTdp: rabpb.TOTAL_BAHAN_NON_TDP,
                                    keteranganBagBawahRab:
                                        rabpb.KETERANGAN_BAG_BAWAH_RAB,
                                    key: j.toString(),
                                    // ID_WILAYAH
                                };
                                j++;
                                return data;
                            }
                        ));

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
        } else if (RABPBs.selectedOption == "DELETE") {
            console.log("delete the index " + RABPBs.selectedIndex);
            // dispatch({ type: "DELETE" });
            if (RABPBs.selectedIndex > -1) {
                console.log("ketemu");
                fetch(hostname + "/data-source/delete-hs", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        TAHUN: tahun,
                        ID_HS: RABPBs.data[RABPBs.selectedIndex].idHS,
                    }),
                }).then((response) => {
                    if (response.ok) {
                        console.log("Success from back end");
                        const newData = JSON.parse(JSON.stringify(RABPBs.data));
                        newData.splice(RABPBs.selectedIndex, 1);
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
        } else if (RABPBs.selectedOption == "UPDATE") {
            console.log(RABPBs.selectedIndex);
            if (RABPBs.selectedIndex > -1) {
                fetch(hostname + "/data-source/update-hs", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(RABPBs.newData),
                })
                    .then((response) => {
                        if (response.ok) {
                            var newDatas = JSON.parse(
                                JSON.stringify(RABPBs.data)
                            );
                            const item = newDatas[RABPBs.selectedIndex];

                            newDatas.splice(RABPBs.selectedIndex, 1, {
                                ...item,
                                ...RABPBs.row,
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
    }, [RABPBs.selectedOption]);

    return (
        <>
            <div className="d-flex flex-column justify-content-between align-items-center">
                <h4>This is RABProjectBagian</h4>

                <Button
                    type="primary"
                    className="d-flex p-2 align-items-center"
                    onClick={() => {
                        setShowRABPBForm(!showRABPBForm);
                    }}
                >
                    <PlusOutlined /> New RAB Project Bagian
                </Button>
            </div>
            <RABProjectBagianTable
                RABPBs={RABPBs}
                tahun={tahun}
                dispatch={dispatch}
            />
            <RABProjectBagianForm
                PROJECT_ID={PROJECT_ID}
                tahun={tahun}
                showDrawer={() => {
                    setShowRABPBForm(true);
                }}
                onClose={() => {
                    setShowRABPBForm(false);
                }}
                visible={showRABPBForm}
                dispatch={dispatch}
            />
        </>
    );
};

export default RABProjectBagian;
