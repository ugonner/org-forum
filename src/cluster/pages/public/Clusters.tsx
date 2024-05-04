import { useEffect, useState } from "react";
import { QueryReturn } from "../../../generics/typings/typngs";
import { IClusterDTO } from "../../typings/cluster";
import { toast } from "react-toastify";
import { getClusters } from "../../contexts/cluster";
import { ItemCard } from "../../../generics/components/ItemCard";

export const Clusters = () => {
  const [clusters, setClusters] = useState({} as QueryReturn<IClusterDTO>);
  const [_page, set_Page] = useState(1);
  const [queryPayload, setQueryPayload] = useState({
    _page,
    _orderBy: "createdAt",
    _order: "DESC",
  } as {[key: string]: unknown});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const clusterRes = await getClusters(queryPayload);
        setClusters(clusterRes);
      } catch (error) {
        toast((error as any).message);
      }
    })();
  }, [queryPayload]);

  return (
    <div className="row">
    <div className="col-8">
        <h1 className="text-center">Clusters <span className="text-info">| {clusters.totalDocs ?? 0}</span></h1>
    </div>
    <div className="col-4">
      <input className="form-control lg" placeholder="search cluster" type="search" onChange={(e) => {
        const {value} = e.target;
        if(value.length < 3) return;
        setQueryPayload({...queryPayload, _searchBy: value})
      }} />
    </div>
      {
        clusters.docs?.length > 0 ? (
          <ItemCard
          items={clusters.docs?.map((cluster) => ({
            header: cluster.clusterName,
            shortDescription: cluster.detail ?? "",
            avatar: cluster.avatar ?? "",
            linkButtonText: "view",
            linkHref: `/cluster/view/${cluster._id}`,
          }))}
        />
        ) : (
          <div className="col-12">
            <h5>No clusters yet</h5>
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
