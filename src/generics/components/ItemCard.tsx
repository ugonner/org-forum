import { Link, useNavigate } from "react-router-dom";

export interface IItem {
  header: string;
  shortDescription: string;
  avatar: string;
  linkButtonText?: string;
  linkHref?: string;
}
export interface IItemCardProp {
    items: IItem[];
}
export const ItemCard = (prop: IItemCardProp) => {
  const navigate = useNavigate()
  return (
    <div className="popular-product">
      <div className="container">
        <div className="row">
          {
            prop.items.map((item, i) => (
                <div key={i} className="col-12 col-md-6 col-lg-4 mb-4 mb-lg-0">
            <div className="row my-3">
              <div className="col-3 img-responsive">
                <img src={item.avatar} alt="Image" className="img-fluid" />
              </div>
              <div className="col-9">
                <span className="d5 font-weight-bold">{item.header}</span>
                <p className="d6">{item.shortDescription.substr(0, 70)}</p>
                {item.linkButtonText && (
                  <p className="d6 font-weight-bolder">
                    <button 
                    className="btn btn-sm btn-transparent"
                    onClick={() => navigate(`${item.linkHref}`)}
                    
                    >
                      {item.linkButtonText}
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};
