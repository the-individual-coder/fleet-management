
import { useOutletContext } from "react-router-dom";
import { OutletContextType } from "../layouts/MainLayout";
export const Homepage = () => {
    const { user } = useOutletContext<OutletContextType>()
    console.log("this is the user>> ", user)
    return (
        <>
            <div className="dashboard overflow-y-auto w-full h-lvh p-1 py-5 sm:p-16">
                <div className="welcome-board p-4 sm:p-10 w-full bg-[#2563eb] rounded-lg overflow-hidden sm:overflow-visible" >
                    <div className="flex">
                        <div className="greet w-3/4">
                            <p className="text-white text-sm sm:text-xl font-medium">Welcome, {user?.username}!</p>
                            <h1 className="text-lg sm:text-3xl text-white font-bold">Check your logistics data regularly!</h1>
                        </div>
                        <div className="picture relative h-full w-1/4">
                            <img src="/man-computer.png" alt="man-computer" className=" top-[-30px] max-w-[150px] sm:max-w-full h-[150px] w-[150px] sm:w-[220px] sm:h-[220px] absolute sm:top-[-110px] z-20" />
                        </div>
                    </div>
                </div>
   


            </div>
        </>
    )

}