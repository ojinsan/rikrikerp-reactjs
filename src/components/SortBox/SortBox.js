import React, { useState, useEffect } from "react";
import { Select, Button } from "antd";

const { Option } = Select;

const keyNames = ["uraian", "kelompok", "Nomor Urut", "Kategori"];

const SortBox = (props) => {
    const [keysSelected, setKeySelected] = useState([]);

    function handleChange(value, i) {
        console.log(`selected ${value}`);
        const keySelectedTemp = JSON.parse(JSON.stringify(keysSelected));
        keySelectedTemp.splice(i, 1, {
            keyName: value,
            isAscending: true,
            key: i,
        });
        setKeySelected(keySelectedTemp);
    }

    useEffect(() => {
        props.onChange && props.onChange(keysSelected);
    }, [keysSelected, keysSelected.length]);

    return (
        <div>
            Sort
            <Button
                onClick={() => {
                    console.log("add new item");
                    const newKeys = JSON.parse(JSON.stringify(keysSelected));
                    newKeys.push({
                        keyName: "",
                        isAscending: true,
                        key: newKeys.length,
                    });
                    setKeySelected(newKeys);
                }}
            >
                Tambah
            </Button>
            <div className="d-flex flex-column-reverse">
                {keysSelected.map((key, i) => (
                    <div key={key.key + "div"}>
                        <Select
                            key={key.key}
                            value={key[i]}
                            style={{ width: 120 }}
                            onChange={(value) => {
                                handleChange(value, i);
                            }}
                        >
                            {keyNames.map((keyName) => (
                                <Option key={keyName} value={keyName}>
                                    {keyName}
                                </Option>
                            ))}
                        </Select>
                        <Button
                            onClick={() => {
                                const keysSelectedTemp = JSON.parse(
                                    JSON.stringify(keysSelected)
                                );
                                keysSelectedTemp.splice(i, 1);
                                setKeySelected(keysSelectedTemp);
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SortBox;
