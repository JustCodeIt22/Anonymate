import React, { useContext, useEffect, useRef, useState } from 'react'
import { createRoom, disconnect, joinRoom, sendMessageOverRoom } from '../services/WebSocketService'
import { UserContext } from '../UserProvider';
import { toast } from 'react-toastify';


const OneToOneChat = () => {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const {userId} = useContext(UserContext);
  const responseRef = useRef(null); 

  useEffect(() => {
    if(isJoined && userId){
      joinRoom(onRoomJoined, roomCode);
    }
  },[isJoined])


  useEffect(() => {
    if (responseRef.current) {
        responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
}, [allMessages]);

  
  const onRoomJoined = (msg) => {
    console.log("MESSAGE : " + msg);
    if(msg){
      const receivedMsg = msg.toString().split(" : ").at(1);
      const senderId = msg.toString().split(" : ").at(0).split("-")[1];

      if(userId !== senderId){
          setAllMessages((prevMessages) => [...prevMessages, { text: receivedMsg, sender: `user-${userId}`, isSelf: false }]);
      }

      const responseEle = document.querySelector("#response");

      responseEle.scrollTop = responseEle.scrollHeight;
      setMessage("");
    }
  }
  
  const join = () =>{
    if(roomCode.length == 8){
      setIsJoined(true)
      console.log("Joined")
      toast.success("Joined room successfully.", {position:'top-center'});
    } else {
      console.log("Room Code Missing or Invalid.")
      toast.error("Room Code Missing or Invalid.", {position:'top-center'});
    }
  }

  const handleOnSend = (e) => {
    e.preventDefault();
    if(roomCode){
      if(message.trim() !== ""){
        const msg = `user-${userId} : ${message}`
        sendMessageOverRoom(roomCode, msg);
        setAllMessages((prevMessages) => [...prevMessages, { text: message, sender: `user-${userId}`, isSelf: true }]);
        setMessage("");
      
      }
    }
  }
  
  const createNewRoom = () => {
    createRoom().then((code) => {
      setRoomCode(code);
      setIsJoined(true);
    });
  }

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    toast.success("Copied Room Code", {position:'top-center', autoClose:2000});
  }

  return (
    <div className='w-full h-full flex justify-center items-center'>

      { (!isJoined) ? 
      
      <div className='flex flex-col gap-3 justify-center items-center sm:w-[30vw] md:w-[20vw] sm:left-[-1.2rem] md:left-0 relative'>

        <h3 className='text-center relative sm:left-[1.5rem] md:left-0'>Join Room using Code</h3>
        <div className='flex w-full'>
          <input className='p-2.5 flex-auto' type="text" name="msg" id="msgId" value={roomCode} placeholder='Enter room code here ...' onChange={(e) => setRoomCode(e.target.value)}/>
          <button type="submit" className='bg-green-600' onClick={join}>Join</button>
        </div>
        
        <h2 className='relative sm:left-[1.5rem] md:left-0'>---- OR ----</h2>

        <button className='bg-blue-600 relative sm:left-[1.5rem] md:left-0' onClick={createNewRoom}>Create Room</button>
        

      </div>
        
        :

      <div className='p-2 text-left flex flex-col justify-end w-full h-full overflow-hidden'>
        <div id='response' className='overflow-y-auto flex flex-col' ref={responseRef}> 
            {
                allMessages?.map((msg, idx) => (
                  <p className={`${msg.isSelf ? 'bg-blue-500 text-white self-end' : 'bg-white text-black self-start'} w-fit max-w-[60%] px-4 py-1 my-2 rounded-[2rem]`} key={idx}>{msg.text}</p>
                ))
            }
        </div>
        <form className= 'w-full rounded-sm flex justify-center pt-2 my-2' onSubmit={handleOnSend} autoComplete='off'>
          {roomCode && <h2 className='absolute top-0 mt-2'>Join room using <span onClick={copyCode} className='bg-yellow-300 text-black rounded-[2rem] px-2 py-1 cursor-pointer'>{roomCode}</span></h2>}
          <input className='p-2.5 flex-auto' type="text" name="msg" id="msgId" value={message} placeholder='Enter message here ...' onChange={(e) => setMessage(e.target.value)}/>
          <button type="submit" className='bg-green-600'>Send</button>
        </form>
      </div>

      }
    </div>
  )
}

export default OneToOneChat