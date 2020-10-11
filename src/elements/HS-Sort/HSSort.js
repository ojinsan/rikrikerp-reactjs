import React, { useState, useEffect } from "react";

import { Popover, Button } from "antd";
import { SortBox } from "../../components";
import { sortByMultiple } from "../../utils/filter-sort";

const HSSort = (props) => {
    const [HSSortKeys, setHSSortKeys] = useState([]);

    useEffect(() => {
        var newDatas = [];
        props.datas && (newDatas = sortByMultiple(props.datas, HSSortKeys));
        props.onChange && props.onChange(newDatas);
    }, [HSSortKeys]);

    const content = (
        <div>
            <SortBox
                onChange={(keys) => {
                    console.log(keys);
                    setHSSortKeys(keys);
                }}
            />
        </div>
    );

    return (
        <>
            <Popover
                placement="bottomLeft"
                content={content}
                title="Title"
                trigger="click"
            >
                <Button>Sort me</Button>
            </Popover>
        </>
    );
};

export default HSSort;
