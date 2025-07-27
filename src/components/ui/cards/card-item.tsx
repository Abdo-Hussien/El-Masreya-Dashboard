const CardItem = ({ id, title, subtitle, children }:
    { id?: string, title: string, subtitle: string, children?: React.ReactNode }) => {
    return (
        <>
            <div id={id} className="flex grow flex-col">
                <h2>{title}</h2>
                <span className="font-light text-md my-2 text-gray-600">{subtitle}</span>
                {children}
            </div>
        </>
    )
}

export default CardItem