import BarcodeScanner from '@/components/ui/barcode/BarcodeScanner'

export default function TestScannerPage() {
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Test Barcode Scanner</h1>
            <BarcodeScanner />
        </div>
    )
}