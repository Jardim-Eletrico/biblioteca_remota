import heroTitleStyles from "@/modules/landing/hero_title.module.css";

type TitleProps = {
    text: string,
}

export default function HeroTitle({ text }: TitleProps) {
    return(
        <>
            <h1 className={`${heroTitleStyles.hero_title}`}>{text}</h1>
        </>
    )
}