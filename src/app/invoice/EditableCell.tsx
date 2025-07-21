"use client";
import { Input } from "@/components/ui/input";
import {
    useEffect,
    useState,
    useRef,
    forwardRef,
    useImperativeHandle,
} from "react";

type EditableCellProps<T> = {
    id: string;
    initialValue: T;
    onChange: (value: T) => void;
    formatter?: (value: T) => string;
};

export interface EditableCellHandle {
    focus: () => void;
}

const EditableCell = forwardRef<EditableCellHandle, EditableCellProps<any>>(
    function EditableCell({ id, initialValue, onChange, formatter }, ref) {
        const [isEditing, setIsEditing] = useState(false);
        const [value, setValue] = useState(initialValue);
        const inputRef = useRef<HTMLInputElement>(null);
        const shouldFocus = useRef(false); // used to defer focus until after input is mounted

        useImperativeHandle(ref, () => ({
            focus: () => {
                shouldFocus.current = true;
                setIsEditing(true);
            },
        }));

        useEffect(() => {
            setValue(initialValue);
        }, [initialValue]);

        useEffect(() => {
            if (isEditing && shouldFocus.current) {
                inputRef.current?.focus();
                shouldFocus.current = false;
            }
        }, [isEditing]);

        const displayValue = formatter ? formatter(value) : value;

        const handleSave = (inputValue: any) => {
            onChange(inputValue);
            setIsEditing(false);
        };

        return isEditing ? (
            <div className="flex justify-center">
                <Input
                    id={id}
                    ref={inputRef}
                    variant="plain"
                    value={value as unknown as string}
                    onChange={(e) =>
                        setValue(e.target.value as unknown as typeof value)
                    }
                    onBlur={() => handleSave(value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") e.currentTarget.blur();
                        if (e.key === "Escape") {
                            setValue(initialValue);
                            setIsEditing(false);
                        }
                    }}
                />
            </div>
        ) : (
            <div
                className="cursor-text text-center"
                onDoubleClick={() => setIsEditing(true)}
            >
                {displayValue as string}
            </div>
        );
    }
);

export default EditableCell;
