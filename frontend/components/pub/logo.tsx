type LogoProps = {
    aligned: "vertical" | "horizontal",
    text?: "yes" | "no",
}

export default function Logo({ aligned, text }: LogoProps) {
    return(
        <>
            <div className={`flex items-center justify-center w-fit h-fit gap-0.75 ${aligned === "vertical" ? "flex-col" : "flex-row gap-2"}`}>
                <img className="size-8 bg-gray-logo-bg rounded-full overflow-visible" src="/logo.png" alt="Libris Logo" />
                <span className="font-space-grotesk font-medium text-[1rem] text-dark-state-blue">{text === "yes" ? "Libris" : ""}</span>
            </div>
        </>
    )
}