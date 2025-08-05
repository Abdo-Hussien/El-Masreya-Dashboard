import { cn } from "@/lib/Utils"

const CardItem = ({ id, title, subtitle, className, children }:
    { id?: string, title: string, subtitle: any, className?: string, children?: React.ReactNode }) => {
    return (
        <>
            <div id={id} className={cn(className, "flex grow flex-col")}>
                <h2>{title}</h2>
                <span className="font-light flex gap-2 items-center text-md my-2 text-gray-600">{subtitle}</span>
                {children}
            </div>
        </>
    )
}

export default CardItem