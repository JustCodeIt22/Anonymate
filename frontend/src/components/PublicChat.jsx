import React, { useContext, useEffect, useRef, useState } from 'react'
import { connect, disconnect, sendMessage } from '../services/WebSocketService'
import { UserContext } from '../UserProvider';

const PublicChat = () => {
    const [message, setMessage] = useState("");
    const {userId, allMessages, setAllMessages} = useContext(UserContext);
    const responseRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if(userId){
            connect(onMessageRecieved);
        }
    }, [userId])


    useEffect(() => {
        if (responseRef.current) {
            responseRef.current.scrollTop = responseRef.current.scrollHeight;
        }
    }, [allMessages]);


    const onMessageRecieved = (msg) => {
        if(msg){
            const receivedMsg = msg.toString().split(" : ").at(1);
            const senderId = msg.toString().split(" : ").at(0).split("-")[1];
            
            const responseEle = document.querySelector("#response");
            
            if(userId !== senderId){
                // setAllMessages((prevMsg) => [...prevMsg, msg]);
                setAllMessages((prevMessages) => [...prevMessages, { text: receivedMsg, sender: `user-${userId}`, isSelf: false }]);
            }

            responseEle.scrollTop = responseEle.scrollHeight;

            setMessage("");
        }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault(false);
        if(message.trim() !== ""){
            const msg = `user-${userId} : ${message}`
            sendMessage(msg);
            setAllMessages((prevMessages) => [...prevMessages, { text: message, sender: `user-${userId}`, isSelf: true }]);
            setMessage("");
        }
    }
    return (
        <div className= 'w-full h-full'>
            <div className='p-2 text-left flex flex-col justify-end w-full h-full overflow-hidden'>
                <div id='response' className='overflow-y-auto flex flex-col' ref={responseRef}> 
                    {
                        allMessages?.map((msg, idx) => (
                            <p className={`${msg.isSelf ? 'bg-blue-500 text-white self-end' : 'bg-white text-black self-start'} w-fit max-w-[60%] px-4 py-1 my-2 rounded-[2rem]`} key={idx}>{msg.text}</p>
                        ))
                    }
                </div>
                <form className= 'w-full rounded-sm flex justify-center pt-2 my-2' onSubmit={handleOnSubmit} autoComplete='off'>
                    <input ref={inputRef} className='p-2.5 flex-auto' type="text" name="msg" id="msgId" value={message} placeholder='Enter message here ...' onChange={(e) => setMessage(e.target.value)}/>
                    <button type="submit" className='bg-green-600'>Send</button>
                </form>
            </div>
        </div>
    )
}

export default PublicChat