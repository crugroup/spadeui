import { Create, useForm } from "@refinedev/antd";
import { IResourceComponentsProps, useList } from "@refinedev/core";
import { Form, Input, Transfer, TransferProps } from "antd";
import React, { useState } from "react";

export const VariableSetCreate: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps } = useForm();
  const [selectedVariables, setSelectedVariables] = useState<React.Key[]>([]);

  // Fetch variables using useList hook
  const { data: variablesData, isLoading: variablesLoading } = useList({
    resource: "variables",
    pagination: { mode: "off" },
  });

  const variables = variablesData?.data || [];

  const handleTransferChange: TransferProps["onChange"] = (targetKeys) => {
    setSelectedVariables(targetKeys);
    // Convert keys to numbers for the form
    const numericKeys = targetKeys.map((key) => Number(key));
    formProps.form?.setFieldValue("variables", numericKeys);
  };

  return (
    <Create saveButtonProps={saveButtonProps} isLoading={variablesLoading}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please enter the variable set name" },
            { max: 100, message: "Name cannot exceed 100 characters" },
          ]}
        >
          <Input placeholder="Enter variable set name" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Enter variable set description (optional)" rows={3} />
        </Form.Item>

        <Form.Item
          label="Variables"
          name="variables"
          rules={[{ required: true, message: "Please select at least one variable" }]}
        >
          <Transfer
            dataSource={variables}
            titles={["Available Variables", "Selected Variables"]}
            targetKeys={selectedVariables}
            onChange={handleTransferChange}
            render={(item) => `${item.name} ${item.is_secret ? "(Secret)" : ""}`}
            rowKey={(item) => String(item.id)}
            style={{ width: "100%" }}
            listStyle={{
              width: "100%",
              height: "400px",
            }}
            showSearch
            filterOption={(inputValue, option) =>
              option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
              (option.description && option.description.toLowerCase().includes(inputValue.toLowerCase()))
            }
          />
        </Form.Item>
      </Form>
    </Create>
  );
};
