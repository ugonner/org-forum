import { ChangeEvent, useState } from "react";
import { ResponseMessage } from "../../generics/components/ResponseMessage";
import { Popover } from "../../generics/components/popover/Popover";
import { useGetFocalareasQuery } from "../contexts/focalarea";
import { ComponentModal } from "../../generics/components/modals/ComponentModal";
import { CreateOrUpdateFocalarea } from "./CreateAndUpdateFocalarea";
import {
  GeneralSelect,
  ISelectOption,
} from "../../generics/components/form/Select";

export const FocalareaMgt = () => {
  const [toggleCreateModal, setToggleCreateModal] = useState(false);
  const [focalareaId, setFocalareaId] = useState("create");
  const [queryPayload, setQueryPayload] = useState(
    {} as { [key: string]: string }
  );
  const [order, setOrder] = useState("-1");
  const [orderBy, setOrderBy] = useState("createdAt");

  const filterOptions: ISelectOption[] = [
    { label: "Published", value: "isPublished" },
  ];
  const orderOptions: ISelectOption[] = [
    { label: "DESC", value: "-1" },
    { label: "ASC", value: "1" },
  ];
  const orderByOptions: ISelectOption[] = [
    { label: "Date Created", value: "createdAt" },
    { label: "Last updated Date", value: "updatedAt" },
  ];

  const {
    data: focalareas,
    error,
    isLoading,
    isError,
  } = useGetFocalareasQuery({
    ...queryPayload,
    _orderBy: orderBy,
    _order: order,
  });

  const setUpModal = (focalareaId: string) => {
    setFocalareaId(focalareaId);
    setToggleCreateModal(true);
  };

  const filterUsers = (payload: ISelectOption[]) => {
    const queryObj: { [key: string]: string } = {};
    payload.forEach((p) => {
      queryObj[p.label] = p.value;
    });
    setQueryPayload(queryObj);
  };

  const searchBy = (searchTerm: string) => {
    if (searchTerm?.length < 3) return;
    setQueryPayload({ _searchBy: searchTerm });
  };

  return (
    <div>
      <ResponseMessage
        isLoading={isLoading}
        isError={isError}
        error={error}
        data={focalareas}
      />

      <div className="row">
        <div className="col-sm-4">
          <input
            type="search"
            className="form-control"
            onChange={(e) => searchBy(e.target.value)}
            placeholder="search focalarea by name, contact phone number, address"
            aria-label="search focalarea"
          />
        </div>
        <div className="col-sm-4">
          <button
            className="btn btn-primary"
            onClick={() => setUpModal(`create`)}
          >
            Create New
          </button>
        </div>

        <div className="col-sm-4 text-right">
          <div className="row">
            <div className="col-sm-3">
              <h1>{focalareas?.totalDocs} </h1>
              <small className="d-6">focalareas</small>
            </div>
            <div className="col-sm-9">
              <GeneralSelect
                selectOptions={filterOptions}
                isMulti={true}
                handleChange={(option) =>
                  filterUsers(option as ISelectOption[])
                }
              />
              <GeneralSelect
                selectOptions={orderByOptions}
                isMulti={false}
                handleChange={(option) =>
                  setOrderBy((option as ISelectOption).value)
                }
              />
              <GeneralSelect
                selectOptions={orderOptions}
                isMulti={false}
                handleChange={(option) =>
                  setOrder((option as ISelectOption).value)
                }
              />
            </div>
          </div>
        </div>
        <div className="row my-4">
          <div className="col-sm-12">
            <table className="table table-responsive table-triped">
              <thead>
                <tr>
                  <th>Sn</th>

                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Last Managed By</th>
                  <th>Contact Phone</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {focalareas &&
                  focalareas?.docs?.length > 0 &&
                  focalareas?.docs.map((cl, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        {cl.avatar && (
                          <img src={cl.avatar} className="img-avatar" />
                        )}
                      </td>
                      <td>{cl.focalareaName}</td>
                      <td>{(cl.lastManagedBy as any)?.firstName}</td>
                      <td>{cl.contactPhoneNumber ?? " "}</td>
                      <td>
                        {
                          new Date((cl as any).createdAt)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td>
                        <i
                          className="btn fa fa-create"
                          aria-label="open edit screen"
                          role="button"
                          onClick={() => setUpModal((cl as any)._id)}
                        ></i>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {focalareas?.docs?.length && (
              <ul className="pagination">
                <li className="page-item">
                  <span
                    className="btn"
                    role="button"
                    onClick={() => {
                      setQueryPayload(
                        (prev) =>
                          ({ ...prev, _page: Number(focalareas.page) - 1 } as any)
                      );
                    }}
                  >
                    Previous
                  </span>
                </li>
                <li className="page-item">
                  <span
                    className="btn"
                    role="button"
                    onClick={() => {
                      setQueryPayload(
                        (prev) =>
                          ({ ...prev, _page: Number(focalareas.page) + 1 } as any)
                      );
                    }}
                  >
                    Next
                  </span>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      <ComponentModal
        modalBody={<CreateOrUpdateFocalarea focalareaId={focalareaId} />}
        isOpen={toggleCreateModal}
        closeModal={() => setToggleCreateModal(false)}
        modalTitle="Manage Focalarea"
      />
    </div>
  );
};
