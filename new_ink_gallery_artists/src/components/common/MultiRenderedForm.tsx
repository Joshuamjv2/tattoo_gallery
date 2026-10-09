// MultiFormWrapper.tsx
import { ReactNode, useRef, useState } from "react";

interface MultiFormWrapperProps {
    renderForm: (formId: number, registerSubmit: (fn: () => Promise<void>) => void) => ReactNode;
}

export default function MultiFormWrapper({ renderForm }: MultiFormWrapperProps) {
    const [forms, setForms] = useState<number[]>([Date.now()]);
    const submitFns = useRef<Record<number, () => Promise<void>>>({});

    const addForm = () => {
        setForms((prev) => [...prev, Date.now()]);
    };

    const removeForm = (id: number) => {
        setForms((prev) => prev.filter((formId) => formId !== id));
        delete submitFns.current[id];
    };

    const registerSubmit = (id: number, fn: () => Promise<void>) => {
        submitFns.current[id] = fn;
    };

    const handleSubmitAll = async () => {
        for (const id of forms) {
        const submit = submitFns.current[id];
        if (submit) {
            try {
            await submit();
            } catch (e) {
            console.error(`Failed to submit form ${id}:`, e);
            }
        }
        }
    };

    return (
        <div className="flex flex-col gap-6 p-4">
        {forms.map((formId) => (
            <div key={formId} className="border rounded-lg shadow-md p-4 relative">
            <button
                type="button"
                onClick={() => removeForm(formId)}
                className="absolute top-2 right-2 text-red-500 text-sm"
            >
                Remove
            </button>
            {renderForm(formId, (fn) => registerSubmit(formId, fn))}
            </div>
        ))}

        <div className="flex gap-4 mt-4">
            <button
            type="button"
            onClick={addForm}
            className="border bg-black text-white px-2 py-1 rounded-md"
            >
            + Add Another Form
            </button>
            <button
            type="button"
            onClick={handleSubmitAll}
            className="border hidden bg-green-600 text-white px-4 py-2 rounded"
            >
            Submit All
            </button>
        </div>
        </div>
    );
}
