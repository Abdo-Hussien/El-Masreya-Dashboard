import CustomersSelect from "./customers-select"
import InvoiceDetailsGrid from "./invoice-details-grid"

export default function InvoicePage() {

    return (
        <div className="p-4 flex flex-col gap-2">
            <h2 className="mb-2">New Invoice</h2>
            <CustomersSelect />
            <InvoiceDetailsGrid />
        </div>
    );
}
