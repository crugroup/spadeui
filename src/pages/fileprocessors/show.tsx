import React from "react";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Show, NumberField, TextField } from "@refinedev/antd";
import { Typography } from "antd";

const { Title } = Typography;

export const FileProcessorShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;

    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Title level={5}>Id</Title>
            <NumberField value={record?.id ?? ""} />
            <Title level={5}>Name</Title>
            <TextField value={record?.name} />
            <Title level={5}>Description</Title>
            <TextField value={record?.description} />
            <Title level={5}>Callable</Title>
            <TextField value={record?.callable} />
        </Show>
    );
};
