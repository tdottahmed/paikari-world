import React, { useState, useEffect } from "react";
import Modal from "@/Components/Ui/Modal";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import SecondaryButton from "@/Components/Actions/SecondaryButton";
import { Order } from "@/types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { name: string; address: string; phone: string }) => void;
    order: Order | null;
    processing?: boolean;
}

export default function ShippingConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    order,
    processing = false,
}: Props) {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        if (order) {
            setName(order.customer_name || "");
            setAddress(order.customer_address);
            setPhone(order.customer_phone);
        }
    }, [order]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm({ name, address, phone });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="md">
            <div className="p-6 bg-[#0E1614] text-gray-100">
                <h2 className="text-lg font-medium text-[#2DE3A7] mb-4">
                    Confirm Shipping Details
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                    Please review and update the shipping information before
                    sending to courier.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="name" value="Customer Name" />
                        <TextInput
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full"
                            required
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="phone" value="Phone Number" />
                        <TextInput
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 block w-full"
                            required
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="address" value="Address" />
                        <TextInput
                            id="address"
                            name="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="mt-1 block w-full"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <SecondaryButton
                            onClick={onClose}
                            disabled={processing}
                        >
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            {processing ? "Processing..." : "Confirm & Ship"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
