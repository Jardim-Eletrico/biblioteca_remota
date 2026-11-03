export default function Appnavbar() {
    return(
        <>
        
        <header className="w-screen h-fit flex justify-between items-center fixed px-5 py-5 bg-navbar-dark">
            <div className="w-fit h-fit flex gap-2 font-space-grotesk items-center text-state-blue text-base font-medium">
                <img src="/logo.png" alt="libris logo" width={215} height={215} className="bg-gray-logo-bg rounded-full h-[31px] w-auto"/>
                <span>Libris</span>
            </div>
            
            <div className="w-fit h-fit flex gap-2 items-center text-white font-roboto text-base font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                </svg>
                <span>Login</span>
            </div>
        </header>

        </>
    )
}