const columns = [
    {
        title: "ID Wil",
        dataIndex: "idWilayah",
        width: "10%",
        editable: true,
    },
    {
        title: "Wilayah",
        dataIndex: "wilayah",
        width: "30%",
        editable: true,
    },
    {
        title: "Divre / Daop",
        dataIndex: "divreDaop",
        width: "30%",
        editable: true,
    },
    {
        title: "Kecamatan",
        dataIndex: "kecamatan",
        width: "40%",
        editable: true,
    },
    {
        title: "Kabupaten / Kotamadya",
        dataIndex: "kabupatenKotamadya",
        width: "40%",
        editable: true,
    },
    {
        title: "provinsi",
        dataIndex: "provinsi",
        width: "40%",
        editable: true,
    },
    {
        title: "operation",
        dataIndex: "operation",
        render: (_, record) => {
            const editable = isEditing(record);
            return editable ? (
                <span>
                    <a
                        onClick={() => {
                            const controller = new AbortController();
                            save(record.key, controller);
                            return () => controller.abort();
                        }}
                        style={{
                            marginRight: 8,
                        }}
                    >
                        Save
                    </a>
                    <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                        <a>Cancel</a>
                    </Popconfirm>
                </span>
            ) : (
                <div>
                    <a
                        disabled={editingKey !== ""}
                        onClick={() => edit(record)}
                    >
                        Edit
                    </a>
                    <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => {
                            const controller = new AbortController();
                            handleDelete(record.key, controller);
                            return () => controller.abort();
                        }}
                    >
                        <a> Delete </a>
                    </Popconfirm>
                </div>
            );
        },
    },
];

const mergedColumns = columns.map((col) => {
    if (!col.editable) {
        return col;
    }

    return {
        ...col,
        onCell: (record) => ({
            record,
            inputType: col.dataIndex === "age" ? "number" : "text",
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
        }),
    };
});

export { columns, mergedColumns };
