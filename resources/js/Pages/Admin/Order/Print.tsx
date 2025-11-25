import React, { useEffect } from "react";
import { Head } from "@inertiajs/react";
import { Order } from "@/types";
import Invoice from "./Invoice";

interface Props {
    orders: Order[];
}

export default function Print({ orders }: Props) {
    useEffect(() => {
        window.print();
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen print:bg-white">
            <Head title="Print Invoices" />
            <style>
                {`
                @media print {
                    @page { margin: 0; }
                    body { margin: 0; }
                    .page-break { page-break-after: always; }
                    .print-container { padding: 0; margin: 0; }
                }
            `}{" "}
            </style>

            {orders.map((order, index) => (
                <div
                    key={order.id}
                    className={`print-container ${
                        index < orders.length - 1
                            ? "page-break mb-8 print:mb-0"
                            : ""
                    }`}
                >
                    <Invoice order={order} />
                </div>
            ))}
        </div>
    );
}
