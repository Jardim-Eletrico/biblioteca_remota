import heroTitleStyles from "@/modules/landing/hero_title.module.css";
import cardStyles from "@/modules/landing/cards.module.css";


export default function Landing() {
    return(
        <>
            <div className="w-screen h-[315px] flex flex-col gap-0 px-5 py-[10px] bg-[linear-gradient(130deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0.85)_30%,rgba(255,255,255,0.6)_60%,rgba(255,255,255,0)_100%),url('/hero-landing.png')]">
                <div className="w-fit h-fit flex flex-col gap-0 max-w-[60%]">
                    <h1 className={`${heroTitleStyles.hero_title}`}>DESCUBRA</h1>
                    <h1 className={`${heroTitleStyles.hero_title}`}>RESERVE</h1>
                    <h1 className={`${heroTitleStyles.hero_title}`}>LEIA</h1>
                    <p className="font-roboto text-[14px] text-dark-state-blue font-light w-full">Explore livros, monte sua lista e reserve seu próximo empréstimo</p>
                </div>
            </div>
            <div className="w-full h-fit flex flex-col gap-1">
                <h2 className="font-source-serif-pro text-[22px] text-dark-state-blue font-bold">MAIS LEITURA, MENOS ESPERA</h2>
                <div className="flex flex-row gap-1 justify-center items-stretch">
                    <div className={`${cardStyles.hero_cards} bg-white rounded-lg`}>

                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-phone text-dark-state-blue" viewBox="0 0 16 16">
                        <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                        <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                        </svg>
                        <h3 className={`${cardStyles.card_title}`}>Reserve de onde estiver</h3>
                        <p className={`${cardStyles.card_description}`}>Use seu dispositivo móvel para garantir seus livros em poucos cliques</p>

                    </div>
                    <div className={`${cardStyles.hero_cards} bg-white rounded-lg`}>

                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-bank text-dark-state-blue" viewBox="0 0 16 16">
                        <path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.498.498 0 0 1-.485.62H.5a.498.498 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 3h.89zM3.777 3h8.447L8 1zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h1V6zm2 0v7H12V6zM13 6v7h1V6zm2-1V4H1v1zm-.39 9H1.39l-.25 1h13.72z"/>
                        </svg>
                        <h3 className={`${cardStyles.card_title}`}>Retire com praticidade</h3>
                        <p className={`${cardStyles.card_description}`}>Vá até a biblioteca e retire seus livros reservados sem complicações</p>
                        
                    </div>
                    <div className={`${cardStyles.hero_cards} bg-white rounded-lg`}>

                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-vector-pen text-dark-state-blue" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M10.646.646a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-1.902 1.902-.829 3.313a1.5 1.5 0 0 1-1.024 1.073L1.254 14.746 4.358 4.4A1.5 1.5 0 0 1 5.43 3.377l3.313-.828zm-1.8 2.908-3.173.793a.5.5 0 0 0-.358.342l-2.57 8.565 8.567-2.57a.5.5 0 0 0 .34-.357l.794-3.174-3.6-3.6z"/>
                        <path fill-rule="evenodd" d="M2.832 13.228 8 9a1 1 0 1 0-1-1l-4.228 5.168-.026.086z"/>
                        </svg>
                        <h3 className={`${cardStyles.card_title}`}>Descubra novos autores</h3>
                        <p className={`${cardStyles.card_description}`}>Amplie seus horizontes com histórias que inspiram e conectam</p>
                        
                    </div>
                </div>

                <div className="w-full h-fit flex flex-col gap-1">
                    <h2 className="font-source-serif-pro text-[22px] text-dark-state-blue font-bold">COMO FUNCIONA</h2>
                    <div className="flex flex-row gap-1 justify-center items-stretch">

                        <div className={`${cardStyles.hero_cards}`}>
                            
                        </div>

                    </div>
                </div>


            </div>
        </>
    )
}