import { useContext, useEffect, useState } from "react";
import "./App.css";
import PublicChat from "./components/PublicChat";
import OneToOneChat from "./components/RoomChat";
import { UserContext } from "./UserProvider";
// Toast Messages
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  const [showComponent, setShowComponent] = useState({
    PublicChat: true,
    OneToOneChat: false,
  });
  const userContext = useContext(UserContext);

  console.log(import.meta.env);

  useEffect(() => {
    userContext.generateID();
  }, []);
  

  return (
    <div className="flex flex-col justify-center items-center h-[90vh] md:h-[100vh] ">
      <ToastContainer/>
      <h1 className="text-[1.5rem] md:text-[2.5rem] font-bold m-3">
        Chat Application By Omkar
      </h1>
      <div className="flex flex-col justify-center items-center border-4 border-cyan-300 relative md:w-[40vw] w-[90vw] h-[80vh] md:h-[70vh] rounded-lg mt-14">
        <div className="flex justify-center items-center gap-5 absolute top-[-47.2px] md:top-[-47px] z-10">
          <button className={`${showComponent.PublicChat ? 'border-4' : 'border-0 relative top-[-3px]'} border-cyan-300 border-b-0 rounded-b-none`} onClick={(e) => setShowComponent({ PublicChat : true, OneToOneChat : false })}> Public Chat </button>
          <button className={`${showComponent.OneToOneChat ? 'border-4' : 'border-0 relative top-[-3px]'} border-cyan-300 border-b-0 rounded-b-none`} onClick={(e) => setShowComponent({ PublicChat : false, OneToOneChat : true })}>One To One Chat</button>
        </div>
        {showComponent.PublicChat && <PublicChat/>}
        {showComponent.OneToOneChat && <OneToOneChat/>}
      </div>
    </div>
  );
};

export default App;
