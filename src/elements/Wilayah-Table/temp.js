import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useReducer,
} from "react";

import { Table, Input, InputNumber, Popconfirm, Form } from "antd";
import { globalVariable } from "../../utils/global-variable";

const hostname = globalVariable("backendAddress");

function dataReducer(state, action) {
    console.log(state);
    switch (action.type) {
        case "ACTION_SELECTED": {
            return {
                ...state,
                selectedOption: action.payload.option,
                selectedIndex: action.payload.index,
            };
        }
        case "DELETE": {
            return {
                ...state,
                loading: true,
            };
        }
        case "DELETE_SUCCESS": {
            return {
                ...state,
                loading: false,
                data: action.payload,
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
            return {
                ...state,
                loading: false,
                data: action.payload,
            };
        }
        case "RESET": {
            return { loading: false, selectedOption: "", data: null };
        }
        default:
            throw new Error(`Not supported action ${action.type}`);
    }
}
