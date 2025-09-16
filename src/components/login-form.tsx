"use client"

import { cn } from "@/lib/Utils"
import Button from "@/components/ui/button"
import { z } from 'zod'
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

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    z.number().min(6, "Enter a pin code that is between 6 and 7 numbers").max(7, "Enter a pin code that is between 6 and 7 numbers")
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Login with your Name and Pin code
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid gap-6">

                            <div className="grid gap-6">
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="username">الاسم</Label>
                                    <Combobox
                                        className="!w-full"
                                        id="username"
                                        placeholder="اختر اسمك"
                                        items={[]}
                                        item={undefined}
                                        onSelect={function (item: ComboboxItem | undefined): void {

                                        }} />
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
                                    <Input id="password" inputMode="numeric" max="9" type="password" required />
                                </div>
                                <Button type="submit" className="w-full">
                                    Login
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <span className="underline underline-offset-4">
                                    Contact us
                                </span>
                            </div>
                            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                                <a href="mailto:abdelrahman.hsharaf@gmail.com">abdelrahman.hsharaf@gmail.com</a>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
