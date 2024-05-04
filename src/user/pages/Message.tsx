import { useState } from "react";
import { toast } from "react-toastify";
import { sendMessageToUsers } from "../contexts/api/user";
import { IUserMessageConfigDTO } from "../typings/user-messaging";
import { useModalContextStore } from "../../generics/components/modals/ModalContextProvider";

export interface IMessageUserProp {
   usersQueryPayload: {[key: string]: string};
}
export const MessageUsers = (prop: IMessageUserProp) => {
    const {setShowModalText} = useModalContextStore()
    const [usserMessage, setUserMessage] = useState("");
    const [messageSubject, setMessageSubject] = useState("");
    const sendUserMessage = async ( config: {messageType: "SMS" | "Email"}) => {
        try{
            //send message function
            const payload: IUserMessageConfigDTO = {
                message: usserMessage,
                messageType: config.messageType,
                subject: messageSubject
            }
            await sendMessageToUsers(payload, prop.usersQueryPayload)
            toast("message sent");
            setShowModalText("")
        }catch(error){
            toast((error as any).message)
        }
    }
    return (
        <div className="row">
            <div className="col-sm-12">
                <div className="form-group">
                    <label htmlFor="messageSubject">Subject</label>
                    <input id="messageSubject" className="form-control lg form-control-lg" placeholder="Message Subject" onChange={(e) => setMessageSubject(e.target.value )} />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" className="form-control lg form-control-lg" placeholder="message text" onChange={(e) => setUserMessage(e.target.value )}></textarea>
                </div>
                <div className="form-group">
                    <button className="w-100 btn btn-primary"
                    
                    onClick={() => sendUserMessage({messageType: "Email"})}
                    >Send Email
                    </button>
                    <button className="w-100 btn btn-primary"
                    onClick={() => sendUserMessage({messageType: "SMS"})}
                    >Send SMS
                    </button>
                </div>
            </div>
        </div>
    )
}