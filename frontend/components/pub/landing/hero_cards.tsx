import type { ReactNode } from "react";
import HeroCard from "@/modules/landing/cards.module.css";

type CardProps = {
    icon: ReactNode,
    title: string,
    description: string,
    bg: boolean
}

export default function Card({ icon, title, description, bg }: CardProps) {
    return(

        <>
        
            <div className={`${HeroCard.hero_cards} ${bg ? "bg-white" : "bg-transparent"} rounded-lg`}>
                {icon}
                <div className={`${HeroCard.card_title}`}>{title}</div>
                <div className={`${HeroCard.card_description}`}>{description}</div>
            </div>
        
        </>

    )
}