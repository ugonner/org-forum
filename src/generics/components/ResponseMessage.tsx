import { toast } from "react-toastify";
import { IGenericResponse } from "../typings/typngs";

export interface IResponseMessageProp {
    isError: boolean;
    isLoading: boolean;
    data?: any;
    error?: any;
}
export const ResponseMessage = (prop: IResponseMessageProp) => {
    
    if(prop.isLoading){
        toast.info("loading", {position: "top-right"})
    }
    else if(prop.isError){
        toast.info(`Error: ${prop.error.message ?? prop.error}`, {position: "top-right"})
    }
    else if(prop.data){
        toast.info(`Success: ${prop.data.message ?? "done"}`, {position: "top-right"})
    }
    return (
        <>
        
        {/* {
            prop.isLoading && (<h6 className="text-warning">hello loading ...</h6>)
          }
          {
              prop.isError && (<h6 className="text-danger">{(prop.error as IGenericResponse<any>).message}</h6>)
          }
          
          {
              prop.data && (<h6 className="text-danger">{(prop.data as any).message}</h6>)
          } */}
        </>
    )
}