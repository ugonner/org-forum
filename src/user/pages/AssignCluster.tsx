import { useEffect, useState } from "react";
import { IClusterDTO } from "../../cluster/typings/cluster";
import { GeneralSelect, ISelectOption } from "../../generics/components/form/Select";
import { getClusters } from "../../cluster/contexts/cluster";
import { IUpdateUserDTO, IUserDTO } from "../typings/user";
import { defaultUserImageUrl, updateUser, updateUserAdmin } from "../contexts/api/user";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useModalContextStore } from "../../generics/components/modals/ModalContextProvider";

export interface IAssignClusterProp {
    user: IUserDTO
}
export const AssignCluster = (prop: IAssignClusterProp) => {
    const [clusters, setClusters] = useState([] as string[])
    const [clusterOptions, setClusterOptions] = useState([] as ISelectOption[])
    const [selectedClusterOptions, setSelectedClusterOptions] = useState([] as ISelectOption[])
    const navigate = useNavigate()
    const {setShowModalText} = useModalContextStore()
    const updateUserCluster = async () => {
        try{
            toast.info("updating")
            const payload = {
                userId: `${prop.user._id}`,
                clusters
            }
            await updateUserAdmin(payload as unknown as IUpdateUserDTO)
            toast.success("user clusters updated successfuly")
            setShowModalText("");
        }catch(error){
            toast.error((error as any).message)
        }
    }
    useEffect(() => {
        getClusters({})
        .then((res) => {
            setClusterOptions(res.docs.map((c) => ({label: c.clusterName, value: `${c._id}`})))
            const selectedClusters: ISelectOption[] = []
            res.docs.forEach((c) => {
                if(prop.user.clusters &&  (prop.user.clusters?.map((uc) => `${(uc as IClusterDTO)._id}`)).includes(`${c._id ?? c}`)){
                    selectedClusters.push({label: c.clusterName, value: `${c._id}`})
                }
                setSelectedClusterOptions(selectedClusters)
            })
        })
    }, [])
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
                    selectOptions={clusterOptions}
                    isMulti={true}
                    value={selectedClusterOptions}
                    label="select clusters"
                    handleChange={(options) => {
                        setSelectedClusterOptions(options as ISelectOption[])
                        const selectedValues: string[] = ((options as ISelectOption[]).map((opt) => opt.value));
                        setClusters(selectedValues)
                    }}
                    />
                    <div>
                        <button
                        className="w-100 btn btn-primary"
                        onClick={updateUserCluster}
                        >
                         Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}