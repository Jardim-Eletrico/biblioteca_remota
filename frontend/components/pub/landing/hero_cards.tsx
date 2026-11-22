interface CardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export default function Card({ icon, title, description }: CardProps) {
    return (
        <div className={`
            flex flex-col items-center gap-1.25
            p-3
            rounded-lg
            w-1/3 md:w-80
            min-w-0
            flex-none
            min-h-50 md:min-h-70
        `}>
            {icon}

            <div className={`
                font-source-serif-pro
                leading-[1.2]
                text-center
                font-semibold

                text-base md:text-4xl
            `}>
                {title}
            </div>

            <div className={`
                font-roboto
                leading-[1.4]
                text-center
                font-light
                text-sm md:text-[21px]
            `}>
                {description}
            </div>
        </div>
    );
}