import React, { useState, useEffect, useRef, useReducer } from "react";

// IMPORT: Material Kit from ant-design
import { Input, InputNumber, Form, Button } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

// IMPORT: Components
import { RABForm, RABTable, HSWilayahTahunSelector } from "../../elements";
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

const RAB = () => {
    const RABPB_ID = 1; //nanti cek di slug aja
    const tahun = 2010; //nanti di cek di slug juga
    const [showRABForm, setShowRABForm] = useState(false);
    const [RABs, dispatch] = useReducer(dataReducer, {
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
            "Info: RABs(dot)selectedOption is changed to " + RABs.selectedOption
        );
        setShowRABForm(false);
        if (RABs.selectedOption === "FETCH") {
            // dispatch({ type: "FETCH_DATA" });
            fetch(
                hostname +
                    "/project/get-rab-judul-full-data?TAHUN=" +
                    tahun +
                    "&ID_RAB_PROJECT_BAGIAN=" +
                    RABPB_ID,
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
                    response.rab &&
                        (tableData = response.rab.map((RAB, idx) => {
                            const data = {
                                //props
                                idRabJudul: RAB.ID_RAB_JUDUL,
                                itemPekerjaan: RAB.ITEM_PEKERJAAN,
                                noUrut1: RAB.NO_URUT_1,
                                noUrut2: RAB.NO_URUT_2,
                                noUrut3: RAB.NO_URUT_3,
                                noUrut4: RAB.NO_URUT_4,
                                noUrut5: RAB.NO_URUT_5,
                                detail: RAB.DETAIL,

                                idRabDetail: RAB.RAB_DETAILS[0].ID_RAB_DETAIL,
                                satuan: RAB.RAB_DETAILS[0].SATUAN,
                                volume: RAB.RAB_DETAILS[0].VOLUME,
                                upahNonTdp: RAB.RAB_DETAILS[0].UPAH_NON_TDP,
                                bahanNonTdp: RAB.RAB_DETAILS[0].BAHAN_NON_TDP,
                                pm: RAB.RAB_DETAILS[0].PM,
                                idRabJudul: RAB.RAB_DETAILS[0].ID_RAB_JUDUL,
                                idAHSProjectUtama:
                                    RAB.RAB_DETAILS[0].ID_AHS_PROJECT_UTAMA,

                                key: j.toString(),
                                // ID_WILAYAH
                            };
                            j++;
                            return data;
                        }));

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
        } else if (RABs.selectedOption == "DELETE") {
            console.log("delete the index " + RABs.selectedIndex);
            // dispatch({ type: "DELETE" });
            if (RABs.selectedIndex > -1) {
                console.log("ketemu");
                fetch(hostname + "/project/delete-rab-judul-detail", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        TAHUN: tahun,
                        ID_RAB_JUDUL: RABs.data[RABs.selectedIndex].idRabJudul,
                    }),
                }).then((response) => {
                    if (response.ok) {
                        console.log("Success from back end");
                        const newData = JSON.parse(JSON.stringify(RABs.data));
                        newData.splice(RABs.selectedIndex, 1);
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
        } else if (RABs.selectedOption == "UPDATE") {
            console.log(RABs.selectedIndex);
            if (RABs.selectedIndex > -1) {
                console.log(RABs.newData);
                fetch(hostname + "/project/update-rab-judul-detail", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(RABs.newData),
                })
                    .then((response) => {
                        if (response.ok) {
                            var newDatas = JSON.parse(
                                JSON.stringify(RABs.data)
                            );
                            const item = newDatas[RABs.selectedIndex];

                            newDatas.splice(RABs.selectedIndex, 1, {
                                ...item,
                                ...RABs.row,
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
    }, [RABs.selectedOption]);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h4>This is List of RAB Page</h4>
                <Button
                    type="primary"
                    className="d-flex p-2 align-items-center"
                    onClick={() => {
                        setShowRABForm(!showRABForm);
                    }}
                >
                    <PlusOutlined /> New RAB
                </Button>
            </div>
            <RABForm
                showDrawer={() => {
                    setShowRABForm(true);
                }}
                onClose={() => {
                    setShowRABForm(false);
                }}
                visible={showRABForm}
                tahun={tahun}
                dispatch={dispatch}
            />
            <RABTable RABs={RABs} dispatch={dispatch} tahun={tahun} />
        </>
    );
};

export default RAB;
