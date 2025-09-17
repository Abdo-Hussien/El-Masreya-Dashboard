import { getConnection } from "@/server/OdbcDb"
import { handleError } from "@/utils/error-handler"
import { NextResponse } from "next/server"
import { Connection } from "odbc"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key"
const TOKEN_EXPIRY_DAYS = 14

let context: Connection

interface LoginPayload {
    employeeId: number
    pincode: string
}

export async function POST(request: Request) {
    const start = performance.now()
    context = await getConnection()
    let transactionStarted = false

    try {
        const body: LoginPayload = await request.json()

        if (!body.employeeId || !body.pincode) {
            throw new Error("Missing employeeId or pincode")
        }

        await context.beginTransaction()
        transactionStarted = true

        // Step 1: Validate employee existence
        const [employee] = await context.query<{
            id: number
            name: string
            password: string
        }>(
            `SELECT id, name, password 
         FROM Employees 
         WHERE id = ${body.employeeId}`
        )

        if (!employee) {
            throw new Error("Employee not found")
        }

        if (employee.password !== body.pincode) {
            throw new Error("Invalid credentials")
        }

        // Step 2: Create jwt token using employee id and name (no UUID)
        const token = jwt.sign(
            {
                id: employee.id,
                name: employee.name,
            },
            JWT_SECRET,
            { expiresIn: `${TOKEN_EXPIRY_DAYS}d` }
        )

        // Step 3: Log access + set token in cookies
        await context.query(
            `INSERT INTO EmployeeLogins (employee_id, login_time) VALUES (?, GETDATE())`,
            [employee.id]
        )

        const cookieStore = await cookies()
        cookieStore.set("auth_token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: TOKEN_EXPIRY_DAYS * 24 * 60 * 60,
            path: "/",
        })

        await context.commit()

        const end = performance.now()
        console.log(`POST /auth/login took ${(end - start).toFixed(2)} ms`)

        return NextResponse.json({
            success: true,
            message: `Logged in successfully`,
            employee: {
                id: employee.id,
                name: employee.name,
            },
        })
    } catch (error: any) {
        if (transactionStarted) await context.rollback()
        return handleError(error)
    } finally {
        await context.close()
    }
}
