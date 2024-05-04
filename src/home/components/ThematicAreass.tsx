import { title } from "process";
import React, { useEffect, useState } from "react";
import { IFocalareaDTO } from "../../focalarea/typings/focalarea";
import { toast } from "react-toastify";
import { getFocalareas } from "../../focalarea/contexts/focalarea";
import { useModalContextStore } from "../../generics/components/modals/ModalContextProvider";
import { ComponentModal } from "../../generics/components/modals/ComponentModal";
import { useNavigate } from "react-router-dom";
export interface IThematicArea {
  focalareaName: string;
  detail: string;
  avatar?: string;
}
export const ThematicAreas: React.FC = () => {
  const areas: IThematicArea[] = [
    {
      focalareaName: "Accessibility",
      detail:
        "Issues around breaking the barriers PWDs face - architectural, intellectual, information and communication barriers",
    },
    {
      focalareaName: "Inclusion",
      detail:
        "fighting discrimination, promoting <em>equity</em> rathe than equality as the basis or watch-word in policies of inclusion",
    },
    {
      focalareaName: "Job creation",
      detail:
        "Promotion of productive projects and pushing for employment opportunities to enhance the economic independence of PWDs",
    },
    {
      focalareaName: "Legislation",
      detail:
        "we invest in pushing and achieving neccessary legislationsaround issues and rights of persons with disbailities",
    },
    {
      focalareaName: "Networking",
      detail:
        "</details>Promoting Networking of PWDs, through variose social engineering programs",
    },
    {
      focalareaName: "Social empowerment",
      detail:
        "Using social enginnering tools and programs to engender social integration and empowerment for PWDs",
    },
    {
      focalareaName: "Economic empowerment",
      detail:
        "advocating and executing programs that improves the economic powers of PWDs including entrepreneurshiop programs",
    },
    {
      focalareaName: "Political empowerment",
      detail:
        "Promoting political awareness and equitable participation of PWDs in political processes and exercises including elections",
    },
    {
      focalareaName: "Personal development",
      detail:
        "Promotion self-awareness, self-worth and trust of individuals with disabilities",
    },
    {
      focalareaName: "Healthy Living",
      detail:
        "Awareness creation and sensitization programs on health matters and disability issues.",
    },
  ];
  const { setShowModalText } = useModalContextStore();
  const [focalareas, setFocalareas] = useState([] as IFocalareaDTO[]);
  useEffect(() => {
    (async () => {
      try {
        const focalareasRes = await getFocalareas({});
        focalareasRes.docs.length >= 2
          ? setFocalareas(focalareasRes.docs)
          : setFocalareas(areas);
      } catch (error) {
        toast.error((error as any).message);
      }
    })();
  }, []);

  return (
    <>
      {/* Start Why Choose Us Section */}
      <div className="why-choose-section bg-dark text-white">
        <div className="container">
          <div id="focalareas" className="row justify-content-between">
            <div className="col-lg-6">
              <h2 className="section-title text-light text-capitalize">Our thematic areas</h2>
              <p>
                JONAPWD Anambra state is heavily committed, developed expertise
                and invests resources in the following areas of focus{" "}
              </p>

              <div className="row my-5">
                {focalareas.slice(0, 2).map((area, i) => {
                  return <ThematicAreaCard area={area} />;
                })}
                <div
                  className="w-100 btn rounded-pills"
                  role="button"
                  onClick={() => setShowModalText(`showHomeFocalareas`)}
                >
                  View All Our Thematic Areas
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="img-wrap">
                <img
                  style={{border: "4px solid gray"}}
                  src="images/banners/dark-wheelchair.jpg"
                  alt="Image"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
        <ComponentModal
          modalTitle="Thmatic Areas"
          modalBody={
            <div className="row">
              {focalareas.map((area) => (
                <ThematicAreaCard area={area} />
              ))}
            </div>
          }
          showModalText={`showHomeFocalareas`}
        />
      </div>
      {/* End Why Choose Us Section */}
    </>
  );
};

export interface IThematicAreaCardProp {
  area: IFocalareaDTO;
}
export const ThematicAreaCard = (prop: IThematicAreaCardProp) => {
  const navigate = useNavigate();

  return (
    <div className="col-6 col-md-6">
      <div 
      className="feature"
      role="button"
      onClick={() => {
        prop.area._id && navigate(`/focalarea/view/${prop.area._id}`)
      }}
      >
        <div className="icon">
          <img src="images/truck.svg" alt="Image" className="imf-fluid" />
        </div>
        <h3 className="text-light">{prop.area.focalareaName}</h3>
        <p className="text-light">{prop.area.detail}</p>
      </div>
    </div>
  );
};
