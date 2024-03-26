import { title } from "process";
import React from "react";
export interface IThematicArea {
  title: string;
  detail: string;
  avatar?: string;
}
export const ThematicAreas: React.FC = () => {
  const areas: IThematicArea[] = [
    {
      title: "Accessibility",
      detail:
        "Issues around breaking the barriers PWDs face - architectural, intellectual, information and communication barriers",
    },
    {
      title: "Inclusion",
      detail: "fighting discrimination, promoting <em>equity</em> rathe than equality as the basis or watch-word in policies of inclusion",
    },
    {
      title: "Job creation",
      detail:
        "Promotion of productive projects and pushing for employment opportunities to enhance the economic independence of PWDs",
    },
    {
      title: "Legislation",
      detail:
        "we invest in pushing and achieving neccessary legislationsaround issues and rights of persons with disbailities",
    },
    {
      title: "Networking",
      detail:
        "</details>Promoting Networking of PWDs, through variose social engineering programs",
    },
    {
      title: "Social empowerment",
      detail:
        "Using social enginnering tools and programs to engender social integration and empowerment for PWDs",
    },
    {
      title: "Economic empowerment",
      detail:
        "advocating and executing programs that improves the economic powers of PWDs including entrepreneurshiop programs",
    },
    {
      title: "Political empowerment",
      detail:
        "Promoting political awareness and equitable participation of PWDs in political processes and exercises including elections",
    },
    {
      title: "Personal development",
      detail:
        "Promotion self-awareness, self-worth and trust of individuals with disabilities",
    },
    {
      title: "Healthy Living",
      detail:
        "Awareness creation and sensitization programs on health matters and disability issues.",
    },
  ];

  return (
    <>
      {/* Start Why Choose Us Section */}
      <div className="why-choose-section">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-6">
              <h2 className="section-title">Our thematic areas</h2>
              <p>
                JONAPWD Anambra state is heavily committed, developed expertise
                and invests resources in the following areas of focus{" "}
              </p>

              <div className="row my-5">
                {
					areas.map((area, i) => {
						return (
							<div className="col-6 col-md-6">
                  <div className="feature">
                    <div className="icon">
                      <img
                        src="images/truck.svg"
                        alt="Image"
                        className="imf-fluid"
                      />
                    </div>
                    <h3>{area.title}</h3>
                    <p>
						{area.detail}
                    </p>
                  </div>
                </div>
						)
					})
				}
              </div>
            </div>

            <div className="col-lg-5">
              <div className="img-wrap">
                <img
                  src="images/why-choose-us-img.jpg"
                  alt="Image"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Why Choose Us Section */}
    </>
  );
};
