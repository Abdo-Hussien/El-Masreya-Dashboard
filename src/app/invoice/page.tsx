import CustomersSelect from "./CustomersSelect"
import InvoiceDetailsGrid from "./InvoiceDetailsGrid"

export default function InvoicePage() {

    return (
        <div className="p-4 flex flex-col gap-2">
            <h2 className="mb-2">New Invoice</h2>
            <CustomersSelect />
            <InvoiceDetailsGrid />
        </div>
    );
}
