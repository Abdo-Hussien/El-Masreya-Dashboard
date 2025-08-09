const Divider = ({ vertical = false }: Readonly<{
    vertical?: boolean
}>) => {
    return (
        <>
            <div data-component="divider" className={`bg-gray-200 ${vertical ? "h-1/2 w-[0.5px]" : "w-full h-[0.5px]"} `} />
        </>
    )
}

export default Divider;