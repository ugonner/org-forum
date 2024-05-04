import { Await, useNavigate } from "react-router-dom";
import { IUserDTO } from "../../user/typings/user";
import React, {
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { defaultUserImageUrl, getUsers } from "../../user/contexts/api/user";
import { toast } from "react-toastify";
import { IGenericResponse, QueryReturn } from "../../generics/typings/typngs";
import { USER_MEMBER_TYPES } from "../../user/contexts/datasets";

export interface IUserBubbleProp {
  user: IUserDTO;
  awatarPositionLeft?: boolean;
  avatarBuutonAction?: () => void;
}

export interface IBubbleShowDetail {
  showDetail: string;
  setShowDetail: React.Dispatch<SetStateAction<string>>;
}

const BubbleContext = React.createContext({} as IBubbleShowDetail);

export const BubbleContextProvider = (prop: PropsWithChildren) => {
  const [showDetail, setShowDetail] = useState("");
  const initContext: IBubbleShowDetail = { showDetail, setShowDetail };
  return (
    <BubbleContext.Provider value={initContext}>
      {prop.children}
    </BubbleContext.Provider>
  );
};

export const UserBubbleDetail = (prop: IUserBubbleProp) => {
  const navigate = useNavigate();
  const { showDetail } = useContext(BubbleContext);
  return (
    <>
      {showDetail === `${prop.user._id}` && (
        <div className="text-justify">
          <h6
            className="d3 font-weight-bold"
            role="button"
            onClick={() => navigate(`/user/profile/${prop.user._id}`)}
          >
            {prop.user.firstName}, {prop.user.lastName}
          </h6>
          <p className="d6">
            {prop.user.position} | {prop.user.memberType}
            <br />
            {prop.user.positionNote}
          </p>
        </div>
      )}
      {}
    </>
  );
};

export const UserBubbleAvatar = (prop: IUserBubbleProp) => {
  const { setShowDetail } = useContext(BubbleContext);
  const toggleShowDetails = () => {
    prop.avatarBuutonAction && prop.avatarBuutonAction();
    setShowDetail("");
    setShowDetail(`${prop.user._id}`);
  };

  return (
    <div
      className="img-responsive"
      role="button"
      aria-label="click to show user detail"
      onClick={toggleShowDetails}
    >
      <img
        src={prop.user.avatar ?? defaultUserImageUrl}
        alt="user avatar"
        className="img-avatar rounded-circle"
      />
    </div>
  );
};
export const UserBubble = (prop: IUserBubbleProp) => {
  return (
    <>
      {prop.awatarPositionLeft ? (
        <div className="row mb-5">
          <div className="col-3">
            <UserBubbleAvatar user={prop.user} />
          </div>
          <div className="col-9">
            <UserBubbleDetail user={prop.user} />
          </div>
        </div>
      ) : (
        <div className="row mb-5">
          <div className="col-9">
            <UserBubbleDetail user={prop.user} />
          </div>
          <div className="col-3">
            <UserBubbleAvatar user={prop.user} />
          </div>
        </div>
      )}
    </>
  );
};

export const ExecutivesComponent = () => {
  const [users, setUsers] = useState({} as QueryReturn<IUserDTO>);
  const [usersHalfLength, setUsersHalfLength] = useState(0);
  const { setShowDetail } = useContext(BubbleContext);
  useEffect(() => {
    (async () => {
      try {
        const usersRes = await getUsers({
          memberType: USER_MEMBER_TYPES.executive,
          _page: 1,
          _limit: 10,
        });
        setUsers(usersRes);
        const halfLength = usersRes.totalDocs
          ? Math.trunc(usersRes.totalDocs / 2)
          : 0;
        setUsersHalfLength(halfLength);
      } catch (error) {
        toast.error((error as IGenericResponse<unknown>).message);
      }
    })();
  }, []);

  return (
    <div className="row bg-dark text-white">
        <div className="row">
            <div className="col-12 text-center">
                <h1 className="">The Team</h1>
            </div>
        </div>
        
    <div className="row">
      <div className="col-3">
        {users.docs?.slice(0, usersHalfLength).map((user) => (
          <UserBubble
            key={`${user._id}`}
            user={user}
            awatarPositionLeft={false}
          />
        ))}
      </div>
      <div
        className="col-6 bg-dark"
        role="button"
        aria-label="click to dismiss modal"
        onClick={() => setShowDetail("")}
      >
        <div className="img-responsive">
        <img
        src="images/banners/dark-wheelchair.jpg"
            className="img-fluid"
            style={{height: "100%"}}
            />
        </div>
      </div>
      <div className="col-3">
        {users.docs?.slice(usersHalfLength).map((user) => (
          <UserBubble
            key={`${user._id}`}
            user={user}
            awatarPositionLeft={true}
          />
        ))}
      </div>
    </div>
    </div>
  );
};

export const Executives = () => {
    return (
        <BubbleContextProvider>
            <ExecutivesComponent />
        </BubbleContextProvider>
    )
}