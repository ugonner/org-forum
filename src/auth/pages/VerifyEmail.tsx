import { ChangeEvent, useState } from "react";
import { ICreateUser, RequestForgotPasswordTokenDTO, ResetForgotPasswordDTO } from "../typings/auth";
import AuthContext from "../contexts/auth";
import { TextInput } from "../../generics/components/form/TextInput";
import { Link, useNavigate } from "react-router-dom";
import { ResponseMessage } from "../../generics/components/ResponseMessage";

export const VerifyEmailToken = () => {
  const [userData, setUserData] = useState({} as ResetForgotPasswordDTO);
  const navigate = useNavigate();

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserData({ ...userData, [name]: value });
};


  const authService = AuthContext.useVerifyUserMutation();

  const verifyEmailToken = () => {
    authService.mutate(userData);
    if(authService.data){
        navigate("/home")      
    }

  };

  const inputFields: ResetForgotPasswordDTO = {
    email: "",
    token: ""
    };

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-3"></div>
        <div className="col-sm-6">
          
        <ResponseMessage
          isError={authService.isError}
          isLoading={authService.isLoading}
          data={authService.data}
          error={authService.error}
          />
          {Object.keys(inputFields).map((field) => {
           return (
              <TextInput
                key={field}
                inputName={field}
                inputLabel={field}
                required={field === "gender" ? false : true}
                placeHolder={field}
                cssClass=""
                handleChange={handleInput}
              />
            );
          })}
          <div className="form-group">
            <button type="submit" className="w-100 btn btn-block btn-info btn-lg btn-block" onClick={verifyEmailToken}>
              Verify Token
            </button>
          </div>
          
        <div className="form-group">
            <Link to={"/auth/register"} className="btn btn-block btn-sm btn-primary">
              New User? Sign Up
            </Link>
            <Link to={"/auth/login"} className="btn btn-block btn-sm btn-primary">
              Login
            </Link>
          </div>
        </div>
        
        <div className="col-sm-3"></div>
      </div>
    </div>
  );
};
