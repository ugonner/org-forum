import { ChangeEvent, useState } from "react";
import { ICreateUser } from "../typings/auth";
import { ILoggedInUser, createUser, loginUser } from "../contexts/auth";
import { TextInput } from "../../generics/components/form/TextInput";
import { Link, useNavigate } from "react-router-dom";
import {
  IResponseMessageProp,
  ResponseMessage,
} from "../../generics/components/ResponseMessage";
import { toast } from "react-toastify";
import { IGenericResponse } from "../../generics/typings/typngs";
import { useModalContextStore } from "../../generics/components/modals/ModalContextProvider";

export const RegisterUser = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({} as ICreateUser);
  const [signUpState, setSignUpState] = useState<IResponseMessageProp>(
    {} as IResponseMessageProp
  );

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserData({ ...userData, [name]: value });
  };

  const { setLoader } = useModalContextStore();
  const signUp = async () => {
    try {
      setLoader({ showLoader: true, loaderText: "registering you" });
      await createUser(userData);

      setLoader({ showLoader: true, loaderText: "signing you in" });
      const res = await loginUser({
        email: userData.email,
        password: userData.password,
      });

      localStorage.setItem("token", `${res.data?.token}`);
      const localUser: ILoggedInUser = {
        ...(res.data?.user as ILoggedInUser),
        id: res.data?.user?.userId,
      } as ILoggedInUser;

      localStorage.setItem("user", JSON.stringify(localUser));
      setLoader({ showLoader: false, loaderText: "" });
      navigate(`/user/profile/${res.data?.user?.userId}`);
    } catch (error) {
      setLoader({ showLoader: false, loaderText: "" });

      toast.error((error as IGenericResponse<unknown>).message);
    }
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
            <button
              type="submit"
              className="btn btn-block btn-info btn-lg w-100"
              onClick={signUp}
            >
              sign up
            </button>
          </div>
          <div className="form-group">
            <Link
              to={`/auth/forgot-password`}
              className="btn btn-block btn-sm btn-primary"
            >
              Forgot Password
            </Link>
            <Link
              to={"/auth/login"}
              className="btn btn-block btn-sm btn-primary"
            >
              Login
            </Link>
          </div>
        </div>
        <div className="col-sm-3"></div>
      </div>
    </div>
  );
};
