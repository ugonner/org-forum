import { lazy, useEffect, useState } from "react";
import { GeneralSelect, ISelectOption } from "../../generics/components/form/Select";
import { IUpdateUserDTO, IUserDTO } from "../typings/user";
import { defaultUserImageUrl, updateUser, updateUserAdmin } from "../contexts/api/user";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useModalContextStore } from "../../generics/components/modals/ModalContextProvider";

export interface IAssignRoleProp {
    user: IUserDTO
}
export const AssignRole = (prop: IAssignRoleProp) => {
    const [roles, setRoles] = useState([] as string[])
    
    const [roleOptions, setRoleOptions] = useState([{label: "super-admin", value: "super-admin"}, {label: "user-admin", value: "user-admin"}] as ISelectOption[])
    const [selectedRoleOptions, setSelectedRoleOptions] = useState(prop.user.roles?.map((role) => ({label: role, value: role})) as ISelectOption[])
    const navigate = useNavigate()
    const {setShowModalText} = useModalContextStore()
    const {setLoader} = useModalContextStore()
    const updateUserRole = async () => {
        try{
            const payload = {
                userId: `${prop.user._id}`,
                roles
            }
            
        setLoader({showLoader: true, loaderText: ""})
            await updateUserAdmin(payload as unknown as IUpdateUserDTO)
            toast.success("user roles updated successfuly")
            setShowModalText("");
            setLoader({showLoader: false, loaderText: ""})
        }catch(error){
            setLoader({showLoader: false, loaderText: ""})
            toast.error((error as any).message)
        }
    }
    
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
                    <GeneralSelect
                    selectOptions={roleOptions}
                    isMulti={true}
                    value={selectedRoleOptions}
                    label="select roles"
                    handleChange={(options) => {
                        setSelectedRoleOptions(options as ISelectOption[])
                        const selectedValues: string[] = ((options as ISelectOption[]).map((opt) => opt.value));
                        setRoles(selectedValues)
                    }}
                    />
                    <div>
                        <button
                        className="w-100 btn btn-primary"
                        onClick={updateUserRole}
                        >
                         Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}