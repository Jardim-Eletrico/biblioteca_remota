import { Link } from "react-router-dom";
import HeroTitle from "@/components/pub/landing/hero_title";
import Card from "@/components/pub/landing/hero_cards";
import Arrow from "@/components/pub/landing/arrow_right";


export default function Landing() {
    return(
        <>
            <div className="w-full h-78.75 flex flex-col gap-0 px-5 py-2.5 bg-[linear-gradient(130deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0.85)_30%,rgba(255,255,255,0.6)_60%,rgba(255,255,255,0)_100%),url('/landing/hero-landing.png')] bg-cover bg-no-repeat">
                <div className="w-fit h-fit flex flex-col gap-0 max-w-[60%]">
                    <HeroTitle text="DESCUBRA"/>
                    <HeroTitle text="RESERVE" />
                    <HeroTitle text="LEIA" />
                    <p className="font-roboto text-[14px] text-dark-state-blue font-light w-full">Explore livros, monte sua lista e reserve seu próximo empréstimo</p>
                </div>
            </div>

            <div className="w-full h-fit flex flex-col gap-10 px-5">

                <div className="flex flex-col gap-0">

                    <h2 className="font-source-serif-pro text-[22px] text-dark-state-blue font-bold">MAIS LEITURA, MENOS ESPERA</h2>
                    <div className="flex flex-row gap-1 justify-center items-stretch">

                        <Card title="Reserve de onde estiver" description="Use seu dispositivo móvel para garantir seus livros em poucos cliques" bg={true} icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-phone text-dark-state-blue" viewBox="0 0 16 16">
                            <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                            <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                            </svg>
                        }/>

                        <Card title="Retire com praticidade" description="Vá até a biblioteca e retire seus livros reservados sem complicações" bg={true} icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-bank text-dark-state-blue" viewBox="0 0 16 16">
                            <path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.498.498 0 0 1-.485.62H.5a.498.498 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 3h.89zM3.777 3h8.447L8 1zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h1V6zm2 0v7H12V6zM13 6v7h1V6zm2-1V4H1v1zm-.39 9H1.39l-.25 1h13.72z"/>
                            </svg>
                        }/>
                        
                        <Card title="Descubra novos autores" description="Amplie seus horizontes com histórias que inspiram e conectam" bg={true} icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-vector-pen text-dark-state-blue" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M10.646.646a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-1.902 1.902-.829 3.313a1.5 1.5 0 0 1-1.024 1.073L1.254 14.746 4.358 4.4A1.5 1.5 0 0 1 5.43 3.377l3.313-.828zm-1.8 2.908-3.173.793a.5.5 0 0 0-.358.342l-2.57 8.565 8.567-2.57a.5.5 0 0 0 .34-.357l.794-3.174-3.6-3.6z"/>
                            <path fill-rule="evenodd" d="M2.832 13.228 8 9a1 1 0 1 0-1-1l-4.228 5.168-.026.086z"/>
                            </svg>
                        }/>
                        
                    </div>

                </div>

                <div className="flex flex-col gap-0">

                    <h2 className="font-source-serif-pro text-[22px] text-dark-state-blue font-bold">COMO FUNCIONA</h2>
                    <div className="flex flex-row gap-1 justify-center items-stretch">


                        <Card title="Explore" description="Conheça o acervo e encontre o que mais combina com você" bg={false} icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-compass text-white p-2.5 bg-dark-state-blue rounded-full overflow-visible" viewBox="0 0 16 16">
                            <path d="M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016m6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0"/>
                            <path d="m6.94 7.44 4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z"/>
                            </svg>
                        }/>

                        <Arrow />

                        <Card title="Reserve" description="Garanta seus livros online de forma rápida e gratuita" bg={false} icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-calendar-week text-white p-2.5 bg-vivid-orange rounded-full overflow-visible" viewBox="0 0 16 16">
                            <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                            </svg>
                        }/>

                        <Arrow />

                        <Card title="Retire" description="Vá até a biblioteca, confirme o empréstimo e aproveite sua leitura" bg={false} icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-bank text-white p-2.5 bg-vivid-green rounded-full overflow-visible" viewBox="0 0 16 16">
                            <path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.498.498 0 0 1-.485.62H.5a.498.498 0 0 1-.485-.62l.5-2A.5.5 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 3h.89zM3.777 3h8.447L8 1zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h1V6zm2 0v7H12V6zM13 6v7h1V6zm2-1V4H1v1zm-.39 9H1.39l-.25 1h13.72z"/>
                            </svg>
                        }/>
                        

                    </div>

                </div>

                <div className="flex flex-col w-full h-fit min-h-43.5 p-2.5 gap-2.5 bg-forest-green rounded-2xl bg-[url('/landing/leaves.png')] bg-no-repeat bg-center bg-cover">
                    <div className="flex flex-col w-fit h-fit max-w-[80%] gap-1.5 p-2.5">
                        <h2 className="font-source-serif-pro text-2xl text-white">Leitura acessível para todos os usuários</h2>
                        <p className="font-roboto font-light text-[13px] text-text-light">Mais histórias, mais conhecimento, mais inspiração para sua vida.</p>
                    </div>

                    <Link 
                        to=""
                        className="flex items-center justify-center self-center w-fit h-fit px-4 py-2.5 bg-vivid-orange font-roboto text-[16px] text-white font-medium rounded-4xl"
                    >Começar agora</Link>

                </div>

            </div>
        </>
    )
}