import React, { useState, useEffect, useRef, useReducer } from "react";

// IMPORT: Material Kit from ant-design
import { Input, InputNumber, Form, Button } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { WilayahForm, WilayahTable } from "../../elements";

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
const Wilayah = () => {
    const [showWilayahForm, setShowWilayahForm] = useState(false);
    const [wilayahs, dispatch] = useReducer(dataReducer, {
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
                wilayahs.selectedOption
        );
        setShowWilayahForm(false);
        if (wilayahs.selectedOption === "FETCH") {
            // dispatch({ type: "FETCH_DATA" });
            fetch(hostname + "/base/get-wilayah-full-data", {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            })
                .then((response) => response.json())
                .then((response) => {
                    var j = 0;
                    var tableData = [];
                    response.wilayah &&
                        (tableData = response.wilayah.map((item) => {
                            j++;
                            return {
                                idWilayah: item.ID_WILAYAH,
                                wilayah: item.WILAYAH,
                                divreDaop: item.DIVRE_DAOP,
                                kecamatan: item.KECAMATAN,
                                kabupatenKotamadya: item.KABUPATEN_KOTAMADYA,
                                provinsi: item.PROVINSI,
                                key: j.toString() - 1,
                            };
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
        } else if (wilayahs.selectedOption == "DELETE") {
            console.log("delete the index " + wilayahs.selectedIndex);
            // dispatch({ type: "DELETE" });
            if (wilayahs.selectedIndex > -1) {
                console.log("ketemu");
                fetch(hostname + "/base/delete-wilayah", {
                    //signal: controller.signal,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ID_WILAYAH:
                            wilayahs.data[wilayahs.selectedIndex].idWilayah,
                    }),
                }).then((response) => {
                    if (response.ok) {
                        console.log("Success from back end");
                        const newData = JSON.parse(
                            JSON.stringify(wilayahs.data)
                        );
                        newData.splice(wilayahs.selectedIndex, 1);
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
        } else if (wilayahs.selectedOption == "UPDATE") {
            console.log(wilayahs.selectedIndex);
            if (wilayahs.selectedIndex > -1) {
                fetch(hostname + "/base/update-wilayah", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(wilayahs.newData),
                })
                    .then((response) => {
                        if (response.ok) {
                            var newDatas = JSON.parse(
                                JSON.stringify(wilayahs.data)
                            );
                            const item = newDatas[wilayahs.selectedIndex];

                            newDatas.splice(wilayahs.selectedIndex, 1, {
                                ...item,
                                ...wilayahs.row,
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
    }, [wilayahs.selectedOption]);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <h4>This is wilayah</h4>
                <Button
                    type="primary"
                    className="d-flex p-2 align-items-center"
                    onClick={() => {
                        setShowWilayahForm(!showWilayahForm);
                    }}
                >
                    <PlusOutlined /> New Wilayah Record
                </Button>
            </div>

            <WilayahTable wilayahs={wilayahs} dispatch={dispatch} />

            <WilayahForm
                showDrawer={() => {
                    setShowWilayahForm(true);
                }}
                onClose={() => {
                    setShowWilayahForm(false);
                }}
                visible={showWilayahForm}
                dispatch={dispatch}
            />
        </div>
    );
};

export default Wilayah;
