import { ChangeEvent, lazy, useEffect, useState } from "react";
import { GeneralSelect, ISelectOption, ISelectProp } from "../../generics/components/form/Select";
import { IUpdateUserDTO, IUserDTO } from "../typings/user";
import { defaultUserImageUrl, updateUser, updateUserAdmin } from "../contexts/api/user";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useModalContextStore } from "../../generics/components/modals/ModalContextProvider";
import { FormDisplay, IInputFieldWithPageNumber } from "../../generics/components/form/FormDisplay";
import { ITextInput } from "../../generics/components/form/TextInput";
import { USER_MEMBER_TYPES } from "../contexts/datasets";

export interface IAssignPositionProp {
    user: IUserDTO
}
export const AssignPosition = (prop: IAssignPositionProp) => {
    const [positions, setPositions] = useState([] as string[])
    const [user, setUser] = useState(prop.user);
    const navigate = useNavigate()
    const {setShowModalText} = useModalContextStore()
    
    const  initMemberTypeOptions: ISelectOption[] = Object.keys(USER_MEMBER_TYPES).map((mType) => ({label: mType, value: USER_MEMBER_TYPES[mType]}))
    const [memberTypeOptions, setMemberOptions] = useState(initMemberTypeOptions);
    const [selectedMemberTypeOptions, setSelectedMemberTypeOptions] = useState({} as ISelectOption)
    useEffect(() => {
        const userMemberType = Object.keys(USER_MEMBER_TYPES).find((mType) => USER_MEMBER_TYPES[mType] === prop.user.memberType);
        if(!userMemberType) setSelectedMemberTypeOptions({} as ISelectOption)
        else setSelectedMemberTypeOptions({label: userMemberType, value: USER_MEMBER_TYPES[userMemberType]})
    }, [])
    const updateUserPosition = async () => {
        try{
            toast.info("updating")
            const {position, positionNote, memberType} = user;
            const payload = {
                userId: `${prop.user._id}`,
                position,
                positionNote,
                memberType
            
            }
            await updateUserAdmin(payload as unknown as IUpdateUserDTO)
            toast.success("user positions updated successfuly")
            setShowModalText("");
        }catch(error){
            toast.error((error as any).message)
        }
    }

    const handleTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setUser({...user, [name]: value})
    }

    const [pageMessage, setPageMessage] = useState({} as {[key: string]: string})

    const inputFields: IInputFieldWithPageNumber[] = [
        
    {
        pageNumber: 1,
        inputType: "text",
        inputProp: {
          inputLabel: "Position",
          inputName: "position",
          inputType: "text",
          required: false,
          value: user.position,
          placeholder: "Treasurer",
          cssClass: "",
          handleChange: handleTextInputChange,
        } as ITextInput,
      },
      
    {
        pageNumber: 1,
        inputType: "text",
        inputProp: {
          inputLabel: "Brief Note about his / her positions",
          inputName: "positionNote",
          inputType: "text",
          required: false,
          value: user.positionNote,
          placeholder: "Treaurer of jonapwd, also aspwd chairman",
          cssClass: "",
          handleChange: handleTextInputChange,
        } as ITextInput,
      },
      
    {
        pageNumber: 1,
        inputType: "select",
        inputProp: {
            selectOptions: memberTypeOptions,
            isMulti: false,
            handleChange: (option: ISelectOption) => {
                setSelectedMemberTypeOptions(option)
                setUser({ ...user, memberType: option.value });
            },
          value: [selectedMemberTypeOptions],
          label: "Membership type",
          uniqueId: "memberType",
        } as ISelectProp,
      },
    ]
    
    return (
        <div>
            <div className="row">
                <div className="col-sm-3">
                    <img src={prop.user.avatar ?? defaultUserImageUrl}
                    className="w-200 img-responsive img-fluid"
                    alt=""
                    />
                    <h6> Managing {prop.user.firstName} {prop.user.lastName ?? ""} </h6>
                </div>
                <div className="col-sm-9">
                    <FormDisplay
                    inputFields={inputFields.filter((input) => input.pageNumber === 1)}
                    pageLayoutColumns={1}
                    pageNumber={1}
                    pageMessage={pageMessage}

                    />
                    <div>
                        <button
                        className="w-100 btn btn-primary"
                        onClick={updateUserPosition}
                        >
                         Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}