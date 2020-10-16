import React, { useState, useEffect, useRef, useReducer } from "react";
import {
    ProjectForm,
    HSWilayahTahunSelector,
    ProjectTable,
} from "../../elements";

// IMPORT: Material Kit from ant-design
import {
    Drawer,
    Form,
    Button,
    Col,
    Row,
    Input,
    Select,
    DatePicker,
    InputNumber,
    Spin,
    Collapse,
    List,
} from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

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

const Project = () => {
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [wilayahProject, setWilayahProject] = useState(null);
    const [tahun, setTahun] = useState(null);
    const [projects, dispatch] = useReducer(dataReducer, {
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
            "Info: HSs(dot)selectedOption is changed to " +
                projects.selectedOption
        );
        setShowProjectForm(false);
        if (projects.selectedOption === "FETCH" && tahun) {
            // dispatch({ type: "FETCH_DATA" });
            console.log(tahun);
            fetch(hostname + "/project/get-project-full-data?TAHUN=" + tahun, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            })
                .then((response) => response.json())
                .then((response) => {
                    var tableData = [];
                    response.projects &&
                        (tableData = response.projects.map((project, idx) => {
                            const data = {
                                idProject: project.ID_PROJECT,
                                namaProject: project.NAMA_PROJECT,
                                tahun: project.TAHUN,
                                wilayah: project.WILAYAH
                                    ? project.WILAYAH.WILAYAH
                                    : "",
                                key: idx.toString(),
                                // ID_WILAYAH
                            };

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
        } else if (projects.selectedOption == "DELETE") {
            console.log("delete the index " + projects.selectedIndex);
            // dispatch({ type: "DELETE" });
            if (projects.selectedIndex > -1) {
                console.log("ketemu");
                fetch(hostname + "/project/delete-project", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        TAHUN: tahun,
                        ID_PROJECT:
                            projects.data[projects.selectedIndex].idProject,
                    }),
                }).then((response) => {
                    if (response.ok) {
                        console.log("Success from back end");
                        const newData = JSON.parse(
                            JSON.stringify(projects.data)
                        );
                        newData.splice(projects.selectedIndex, 1);
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
        } else if (projects.selectedOption == "UPDATE") {
            console.log(projects.selectedIndex);
            if (projects.selectedIndex > -1) {
                console.log("fetch update");
                fetch(hostname + "/project/update-project", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(projects.newData),
                })
                    .then((response) => {
                        if (response.ok) {
                            var newDatas = JSON.parse(
                                JSON.stringify(projects.data)
                            );
                            const item = newDatas[projects.selectedIndex];

                            newDatas.splice(projects.selectedIndex, 1, {
                                ...item,
                                ...projects.row,
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
    }, [projects.selectedOption, tahun]);

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
                <h4>This is List of Projects Page</h4>
                <Button
                    type="primary"
                    className="d-flex p-2 align-items-center"
                    onClick={() => {
                        setShowProjectForm(!showProjectForm);
                    }}
                >
                    <PlusOutlined /> New Projects
                </Button>
            </div>

            {tahun && (
                <ProjectTable
                    // setData={(data) => {
                    //     setData(data);
                    // }}
                    projects={projects}
                    tahun={tahun}
                    dispatch={dispatch}
                />
            )}

            <ProjectForm
                showDrawer={() => {
                    setShowProjectForm(true);
                }}
                onClose={() => {
                    setShowProjectForm(false);
                }}
                visible={showProjectForm}
            />
        </>
    );
};

export default Project;
