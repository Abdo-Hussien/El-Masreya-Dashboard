"use client"

import { cn } from "@/lib/Utils"
import Button from "@/components/ui/button"
import { z } from "zod"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Combobox, { ComboboxItem } from "./ui/combobox"
import { useState } from "react"

const pincodeSchema = z
    .string()
    .regex(/^\d{5,7}$/, "Enter a pin code that is between 5 and 7 numbers")

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const employees: ComboboxItem[] = [
        { value: 1, label: "عبدالرحمن هشرف" },
        { value: 2, label: "محمد احمد" },
        { value: 3, label: "علي حسن" },
    ]

    const [selectedEmployee, setSelectedEmployee] = useState<ComboboxItem | undefined>()
    const [pincode, setPincode] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        const parsed = pincodeSchema.safeParse(pincode)
        if (!selectedEmployee) {
            setError("الرجاء اختيار اسمك")
            return
        }
        if (!parsed.success) {
            setError(parsed.error.issues[0].message)
            return
        }

        setError(null)
        setLoading(true)

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    employeeId: selectedEmployee.value,
                    pincode: parsed.data,
                }),
            })

            if (!res.ok) {
                throw new Error("Login failed")
            }

            const data = await res.json()
            console.log("Login success:", data)
            // TODO: handle redirect / save session
        } catch (err: any) {
            setError(err.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl italic">Welcome back</CardTitle>
                    <CardDescription>
                        Login with your
                        <span className="bg-accent italic mx-1 px-1 rounded-xl font-bold">Name</span>
                        and
                        <span className="bg-accent italic mx-1 px-1 rounded-xl font-bold">Pincode</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="username">الاسم</Label>
                                    <Combobox
                                        className="!w-full"
                                        id="username"
                                        placeholder="اختر اسمك"
                                        items={employees}
                                        item={selectedEmployee}
                                        onSelect={(item) => setSelectedEmployee(item)}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">الرقم السري</Label>
                                        <a
                                            href="mailto:abdelrahman.hsharaf@gmail.com"
                                            className="mr-auto text-sm underline-offset-4 hover:underline"
                                        >
                                            نسيت رقمك السري؟
                                        </a>
                                    </div>
                                    <Input
                                        id="password"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value)}
                                        inputMode="numeric"
                                        type="password"
                                        required
                                    />
                                </div>
                                {error && (
                                    <p className="text-red-500 m-[-8px] text-sm text-center">{error}</p>
                                )}
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Logging in..." : "Login"}
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <span className="underline underline-offset-4">
                                    Contact us
                                </span>
                            </div>
                            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                                <a href="mailto:abdelrahman.hsharaf@gmail.com">
                                    abdelrahman.hsharaf@gmail.com
                                </a>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
