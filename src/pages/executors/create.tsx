import { Create, useForm } from "@refinedev/antd";
import { IResourceComponentsProps } from "@refinedev/core";
import { Form, Input } from "antd";
import React from "react";

export const ExecutorCreate: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, queryResult } = useForm();

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Name"
                    name={["name"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name={["description"]}
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    label="Callable"
                    name={["callable"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="History Provider Callable"
                    name={["history_provider_callable"]}
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Create>
    );
};