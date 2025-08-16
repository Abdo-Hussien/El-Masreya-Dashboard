"use client"

import React from "react"

type LoaderProps = {
    size?: number
    color?: string
    borderWidth?: number
}

export const Loader: React.FC<LoaderProps> = ({
    size = 40,
    color = "#27d3db",
    borderWidth = 2,
}) => {
    return (
        <div
            className="ring-loader"
            style={
                {
                    "--loader-size": `${size}px`,
                    "--loader-color": color,
                    "--loader-border": `${borderWidth}px`,
                } as React.CSSProperties
            }
        />
    )
}