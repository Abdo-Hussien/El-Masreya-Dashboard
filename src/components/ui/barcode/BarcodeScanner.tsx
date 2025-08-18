'use client'

import { useState, useRef } from 'react'
import { BrowserMultiFormatReader, IScannerControls, BarcodeFormat } from '@zxing/browser'
import { DecodeHintType } from '@zxing/library'
import { X } from 'lucide-react'
import Button from '../button'

export default function BarcodeScanner() {
    const [result, setResult] = useState<string>('')
    const [controls, setControls] = useState<IScannerControls | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const scanResultsRef = useRef<string[]>([])

    const startScanner = async () => {
        try {
            scanResultsRef.current = [] // reset previous scans

            const devices = await BrowserMultiFormatReader.listVideoInputDevices()
            if (!devices.length) {
                alert('No camera found!')
                return
            }

            let selectedDeviceId = devices[0].deviceId
            const backCam = devices.find(d => /back|rear|environment/i.test(d.label))
            if (backCam) selectedDeviceId = backCam.deviceId

            const hints = new Map()
            hints.set(DecodeHintType.POSSIBLE_FORMATS, [
                BarcodeFormat.QR_CODE,
                BarcodeFormat.EAN_13
            ])

            const codeReader = new BrowserMultiFormatReader(hints)
            const videoElem = document.getElementById('video-preview') as HTMLVideoElement
            const ctrl = await codeReader.decodeFromVideoDevice(
                selectedDeviceId,
                videoElem,
                (res, err) => {
                    if (res) {
                        const text = res.getText()
                        scanResultsRef.current.push(text)

                        // When we have 3 results, find the most frequent
                        if (scanResultsRef.current.length >= 3) {
                            const finalCode = findMostFrequent(scanResultsRef.current)
                            setResult(finalCode)
                            stopScanner()
                        }
                    }
                    if (err && err.name !== 'NotFoundException') {
                        console.error(err)
                    }
                }
            )
            setControls(ctrl)
            setIsOpen(true)
        } catch (err) {
            console.error(err)
        }
    }

    const stopScanner = () => {
        controls?.stop()
        setIsOpen(false)
    }

    const findMostFrequent = (arr: string[]) => {
        const counts: Record<string, number> = {}
        arr.forEach(code => {
            counts[code] = (counts[code] || 0) + 1
        })
        return Object.entries(counts).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
    }

    return (
        <div className="flex flex-col gap-4 items-center">
            <button
                onClick={startScanner}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Start Scanner
            </button>

            {result && (
                <div className="mt-4 p-2 bg-green-200 rounded text-green-900 text-center">
                    Scanned Code: {result}
                </div>
            )}

            {/* Overlay */}
            <div
                data-component="overlay"
                className={`fixed inset-0 z-50 flex justify-center items-center glass bg-gray-200/40 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <div
                    className={`relative flex flex-col mx-4 w-full max-w-2xl shadow-2xl rounded-2xl p-4 transition-all duration-300 ease-in-out ${isOpen ? 'scale-100' : 'scale-90'
                        }`}
                >
                    <Button
                        className="absolute w-6 h-6 top-1 left-1 rounded-lg p-2"
                        variant="outline"
                        onClick={stopScanner}
                    >
                        <X />
                    </Button>

                    <video
                        id="video-preview"
                        className="border rounded-lg w-full aspect-video bg-black"
                        autoPlay
                        muted
                    ></video>
                </div>
            </div>
        </div>
    )
}
