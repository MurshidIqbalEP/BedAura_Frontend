
import Logo from "../assets/img/Black.png"
export default function Footer() {
  return (
    <div className="bg-black h-[200px] flex justify-between items-center p-4  text-white">

    <div className="flex-shrink-0 h-[100px] flex-col">
        <img src={Logo} alt="Logo" className="h-[100px]" />

    </div>

    <div>
    <p className="text-pretty text-left text-gray-600 text-xs">BedAura is an innovative platform designed to streamline the process of finding and renting affordable rooms and bed spaces. Whether you're a student looking for a shared dormitory, a professional seeking a temporary accommodation, or someone interested in renting out a room, BedAura connects users with the perfect living arrangements to meet their needs.</p>
    </div>
      
    </div>
  )
}
