/**
 * Select Component:
 * - Renders a `CreateableSelect` component from `react-select` for selecting or creating options.
 * - Accepts `onChange` and `onCreate` callbacks for handling selection and creation of options.
 * - Receives an array of options, current value, disabled state, and placeholder text as props.
 * - Uses `useMemo` to format the current value based on provided options.
 * - Applies custom styles to the control element of the select component.
 * - Handles the `onSelect` event to update the selected value and trigger the `onChange` callback.
 * - Allows users to create new options if `onCreate` is provided.
 */

"use client";

import { useMemo } from "react";
import { SingleValue } from "react-select";
import CreateableSelect from "react-select/creatable";


type Props = {
    onChange: (value?: string) => void;
    onCreate?: (value: string) => void;
    options?: { label: string; value: string }[];
    value?: string | null | undefined;
    disabled?: boolean;
    placeholder?: string;
};

export const Select = ({
    onChange,
    onCreate,
    options = [],
    value,
    disabled,
    placeholder,
}: Props) => {
    const onSelect = (
        option: SingleValue<{ label: string, value: string }>
    ) => {
        onChange(option?.value);
    };

    const formatedValue = useMemo(() => {
        return options.find((option) => option.value === value);
    }, [options, value]);
    return (
        <CreateableSelect 
          placeholder={placeholder}
          className="text-sm h-10"
          styles={{
            control: (base) => ({
                ...base,
                borderColor: "#e2e8f0",
                ":hover": {
                    borderColor: "e2e8f0",
                },
            })
          }}
          value={formatedValue}
          onChange={onSelect}
          isDisabled={disabled}
          options={options}
          onCreateOption={onCreate}
        />
    )
};
