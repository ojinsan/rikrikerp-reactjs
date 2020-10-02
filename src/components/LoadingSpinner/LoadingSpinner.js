import "./LoadingSpinner.css";

import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import React from "react";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const LoadingSpinner = (props) => {
    if (props.isOverlay) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <div className="spinner d-flex align-items-end justify-content-center">
                    <Spin indicator={antIcon} />
                </div>
            </div>
        );
    } else {
        return <Spin indicator={antIcon} />;
    }
};

export default LoadingSpinner;
