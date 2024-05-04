import React, { ChangeEvent, SetStateAction } from "react";
import { IDatePickerInputProp } from "../../../generics/components/form/DatePicker";
import { GeneralSelect, ISelectProp } from "../../../generics/components/form/Select";
import { ITextInput, TextInput } from "../../../generics/components/form/TextInput";
import { ICreateUser } from "../../typings/auth";

export interface ICreateStagePageProp {
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    user?: ICreateUser,
    setPage: React.Dispatch<SetStateAction<number>>;
    page: number;
    message?: string;
}
export const CreateStagePage = (prop: ICreateStagePageProp) => {
    
  const inputFields: ICreateUser = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };
    return (
        <div className="row">
            <div className="row">
                <div className="col-12">
                    <div className="d-6 text-center">
                        {prop.message}
                    </div>
                </div>
            </div>
            
          {Object.keys(inputFields).map((field) => {
           return (
              <div key={field} className="col-sm-6">
                <TextInput
                inputName={field}
                inputLabel={field}
                required={field === "gender" ? false : true}
                placeHolder={field}
                cssClass=""
                handleChange={prop.handleChange}
                value={(prop.user as any)[field]}
              />
              </div>
            );
          })}

          <div className="row">
            <div className="col-4">
                <div className="text-left">
                    <button
                    className="w-100 btn btn-primary"
                    onClick={() => prop.setPage((prop.page ? prop.page - 1 : 0))}
                    >
                        {prop.page ? "Previous" : "start"}
                    </button>
                </div>
            </div>
            <div className="col-3"></div>
            <div className="col-3">
                
            <div className="text-left">
                    <button
                    className="w-100 btn btn-primary"
                    onClick={() => prop.setPage((prop.page + 1))}
                    >
                        Continue
                    </button>
                </div>
            </div>
          </div>
 
         </div>
    )
}