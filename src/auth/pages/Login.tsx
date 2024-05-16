import { ChangeEvent, useState } from "react";
import { ICreateUser, LoginDTO } from "../typings/auth";
import AuthContext, { createUser } from "../contexts/auth";
import { TextInput } from "../../generics/components/form/TextInput";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ResponseMessage } from "../../generics/components/ResponseMessage";
import { Popover } from "../../generics/components/popover/Popover";
import { useModalContextStore } from "../../generics/components/modals/ModalContextProvider";
import { toast } from "react-toastify";
import { IGenericResponse } from "../../generics/typings/typngs";
import { LoaderModal } from "../../generics/components/modals/LoaderModal";

export const LoginUser = () => {
  const [userData, setUserData] = useState<LoginDTO>({} as LoginDTO);
  const navigate = useNavigate();

  const {setLoader} = useModalContextStore()
  
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserData({ ...userData, [name]: value });
};


  const authService = AuthContext.useLoginUserMutation()

  const signUp = () => {
    authService.mutate(userData);
  };

  if(authService.isError){
    toast.error((authService.error as IGenericResponse<unknown>).message)
  }
  
  if(authService.isLoading ) return (<LoaderModal />)
  
  if(authService.data){
    setLoader({showLoader: false, loaderText: ""})
    const token = authService.data.data?.token
    const user = authService.data.data?.user;
    token && localStorage.setItem("token", token)
    user && localStorage.setItem("user", JSON.stringify(user))

    navigate(`/user/profile/${user?.userId}`)
}
  const inputFields: LoginDTO = {
    email: "",
    password: "",
    };

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-3"></div>
        <div className="col-sm-6">
          
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
            <button type="submit" className="w-100 btn btn-block btn-info btn-lg btn-block" onClick={signUp}>
              Login
            </button>
          </div>
          <div className="form-group">
            <Link to={"/auth/forgot-password"} className="btn btn-block btn-sm btn-primary">
              Forgot Password
            </Link>
            <Link to={"/auth/register"} className="btn btn-block btn-sm btn-primary">
              New User, Sign Up
            </Link>
          </div>
        </div>
        <div className="col-sm-3">
         
          
        </div>
      </div>
    </div>
  );
};
