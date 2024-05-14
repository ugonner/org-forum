import { useEffect, useState } from "react";
import { QueryReturn } from "../../../generics/typings/typngs";
import { IFocalareaDTO } from "../../typings/focalarea";
import { toast } from "react-toastify";
import { getFocalareas } from "../../contexts/focalarea";
import { ItemCard } from "../../../generics/components/ItemCard";
import { useModalContextStore } from "../../../generics/components/modals/ModalContextProvider";

export const Focalareas = () => {
  const [focalareas, setFocalareas] = useState({} as QueryReturn<IFocalareaDTO>);
  const [_page, set_Page] = useState(1);
  const [queryPayload, setQueryPayload] = useState({
    _page,
    _orderBy: "createdAt",
    _order: "DESC",
  } as {[key: string]: unknown});
  const [searchTerm, setSearchTerm] = useState("");

  const {setLoader} = useModalContextStore()
  useEffect(() => {
    (async () => {
      try {
        setLoader({showLoader: true, loaderText: ""})
        const focalareaRes = await getFocalareas(queryPayload);
        setFocalareas(focalareaRes);
        setLoader({showLoader: false, loaderText: ""})
      } catch (error) {
        setLoader({showLoader: false, loaderText: ""})
        toast((error as any).message);
      }
    })();
  }, [queryPayload]);

  return (
    <div className="row">
    <div className="col-8">
        <h1 className="text-center">Focalareas <span className="text-info">| {focalareas.totalDocs ?? 0}</span></h1>
    </div>
    <div className="col-4">
      <input className="form-control lg" placeholder="search focalarea" type="search" onChange={(e) => {
        const {value} = e.target;
        if(value.length < 3) return;
        setQueryPayload({...queryPayload, _searchBy: value})
      }} />
    </div>
      {
        focalareas.docs?.length > 0 ? (
          <ItemCard
          items={focalareas.docs?.map((focalarea) => ({
            header: focalarea.focalareaName,
            shortDescription: focalarea.detail ?? "",
            avatar: focalarea.avatar ?? "",
            linkButtonText: "view",
            linkHref: `/focalarea/view/${focalarea._id}`,
          }))}
        />
        ) : (
          <div className="col-12">
            <h5>No focalareas yet</h5>
          </div>
        )
      }h
      <div className="row">
        <div 
        className="col-6 btn"
        role="button"
        onClick={() => {
          set_Page((_page - 1));
          setQueryPayload({...queryPayload, _page: (_page - 1)})}}
        >
            Previous
        </div>
        <div 
        className="col-6 btn"
        role="button"
        onClick={() => {
          set_Page((_page + 1));
          setQueryPayload({...queryPayload, _page: (_page + 1)})}}
        >
            Next
        </div>
      </div>
    </div>
  );
};
