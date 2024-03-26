import { ChangeEvent, useState } from "react";
import { ICreateUser } from "../typings/auth";
import { createUser, loginUser } from "../contexts/auth";
import { TextInput } from "../../generics/components/form/TextInput";
import { Link, useNavigate } from "react-router-dom";
import { IResponseMessageProp, ResponseMessage } from "../../generics/components/ResponseMessage";

export const RegisterUser = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({} as ICreateUser);
  const [signUpState, setSignUpState] = useState<IResponseMessageProp>({} as IResponseMessageProp)

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserData({ ...userData, [name]: value });
};

  const signUp = () => {
    setSignUpState({...signUpState, isLoading: true})
    createUser(userData)
    .then(() => {
        loginUser({email: userData.email, password: userData.password})
        .then((res) => {
            localStorage.setItem("token", `${res.data?.token}`);
            navigate("/");
        }).catch(() => navigate("/auth/login"))
    })
    .catch((err) => {
      setSignUpState({
        isLoading: false,
        isError: true,
        error: err,
      })
    })
  };
  
  const inputFields: ICreateUser = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-3"></div>
        <div className="col-sm-6">
          
          <ResponseMessage
          isError={signUpState.isError}
          isLoading={signUpState.isLoading}
          data={signUpState.data}
          error={signUpState.error}
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
            <button type="submit" className="btn btn-block btn-info btn-lg w-100" onClick={signUp}>
              sign up
            </button>
          </div>
        <div className="form-group">
            <Link to={`/auth/forgot-password`} className="btn btn-block btn-sm btn-primary">
              Forgot Password
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
