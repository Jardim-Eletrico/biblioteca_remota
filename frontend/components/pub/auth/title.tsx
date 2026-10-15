type TitleProp = {
    content: string,
}

export default function SectionTitle({ content }: TitleProp) {
    return(
        <>

            <h1 className="font-space-grotesk text-white text-3xl text-center font-bold ">{content}</h1>
        
        </>
    )
}