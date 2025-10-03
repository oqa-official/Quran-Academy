"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { PhoneInput } from "react-international-phone";

interface Onboarding {
    _id: string;
    name: string;
    email: string;
    phone: string;
    extendedDueDate?: string;
}

export default function EditOnboardingDialog({
    onboarding,
    open,
    onClose,
    onSaved,
}: {
    onboarding: Onboarding;
    open: boolean;
    onClose: () => void;
    onSaved: (updated: Onboarding) => void;
}) {
    const [form, setForm] = useState(onboarding);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (onboarding) setForm(onboarding);
    }, [onboarding]);

    const handleChange = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        // 🛑 1. Check if form is unchanged
        if (JSON.stringify(form) === JSON.stringify(onboarding)) {
            toast.info("No changes detected")
            onClose()
            return
        }

        setLoading(true)
        try {
            const res = await fetch(`/api/db/inquire/${form._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })
            if (!res.ok) throw new Error("Failed to update onboarding")
            const updated = await res.json()
            toast.success("Onboarding updated successfully")
            onSaved(updated)
            onClose()
        } catch (err) {
            toast.error("Update failed")
            onClose()
        } finally {
            setLoading(false)
        }
    }


    return (
        <Dialog open={open} modal>
            <DialogContent className="max-w-md dark:bg-[#122031] bg-white">
                <DialogHeader>
                    <DialogTitle>Edit Onboarding</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-gray-500">Name</label>
                        <Input
                            value={form.name || ""}
                            onChange={(e) => handleChange("name", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Email</label>
                        <Input
                            value={form.email || ""}
                            onChange={(e) => handleChange("email", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Phone</label>
                        <PhoneInput
                            defaultCountry="gb"
                            preferredCountries={["us", "gb", "ca", "au"]}
                            value={form.phone}
                            required
                            onChange={(phone) => setForm({ ...form, phone: phone })}
                            inputClassName="w-full p-2 rounded-sm bg-transparent outline-none! text-gray-900 dark:text-gray-300! dark:bg-transparent!"
                            className="bg-transparent h-10 border border-none! dark:border-gray-700 dark:bg-transparent"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Link Disable Date</label>
                        <Input
                            type="date"
                            value={
                                form.extendedDueDate
                                    ? new Date(form.extendedDueDate).toISOString().split("T")[0]
                                    : ""
                            }
                            onChange={(e) => handleChange("extendedDueDate", e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>{loading ? "Saving..." : "Save"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
