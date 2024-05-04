import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IGenericResponse, QueryReturn } from "../typings/typngs";
import { IClusterDTO } from "../../cluster/typings/cluster";
import { ICategoryDTO } from "../../category/typings/category";
import { toast } from "react-toastify";
import { getClusters } from "../../cluster/contexts/cluster";
import { getCategorys } from "../../category/contexts/category";
import { ICreateUser } from "../../auth/typings/auth";
import { createUser } from "../../auth/contexts/auth";
import { Z_DEFAULT_COMPRESSION } from "zlib";
import { defaultPostImageUrl } from "../../post/contexts/post";

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [clusters, setClusters] = useState({} as QueryReturn<IClusterDTO>);
  const [categorys, setCategorys] = useState({} as QueryReturn<ICategoryDTO>);

  const quickLinks: { label: string; link: string }[] = [
    { label: "About", link: "/#about" },
    { label: "Thematic Areas", link: "/#focalareas" },
    { label: "Activities", link: "/#activities" },
    { label: "The Team", link: "/#team" },
  ];

  useEffect(() => {
    (async () => {
      try {
        const clustersRes = await getClusters({});
        const caategorysRes = await getCategorys({});
        setClusters(clustersRes);
        setCategorys(caategorysRes);
      } catch (error) {
        toast.error((error as IGenericResponse<unknown>).message);
      }
    })();
  }, []);

  const [user, setUser] = useState({} as ICreateUser);
  const saveUser = async () => {
    const payload: ICreateUser = {
      ...user,
      password: "newUser",
      firstName: user.firstName.length
        ? user.firstName.split(" ")[0]
        : "Anonymous",
      lastName: user.firstName.length ? user.firstName.split(" ")[1] : "User",
    };
    await createUser(payload);
    toast.success("Data saved and safe, Thanks");
  };
  return (
    <>
      {/* Start Footer Section */}
      <footer className="footer-section bg-dark text-light">
        <div className="container relative">
          <div className="sofa-img">
            <img src="images/sofa.png" alt="Image" className="img-fluid" />
          </div>

          <div className="row">
            <div className="col-lg-8">
              <div className="subscription-form">
                <h3 className="d-flex align-items-center">
                  <span className="me-1">
                    <img
                      src="images/envelope-outline.svg"
                      alt="Image"
                      className="img-fluid"
                    />
                  </span>
                  <span>Subscribe to Newsletter</span>
                </h3>

                <form action="#" className="row g-3">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      name="firstName"
                      onChange={(e) => {
                        const { name, value } = e.target;
                        setUser({ ...user, [name]: value });
                      }}
                    />
                  </div>
                  <div className="col-auto">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      name="email"
                      required={true}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        setUser({ ...user, [name]: value });
                      }}
                    />
                  </div>
                  <div className="col-auto">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={saveUser}
                    >
                      <span className="fa fa-paper-plane"></span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="row g-5 mb-5">
            <div className="col-lg-4">
              <div className="mb-4 footer-logo-wrap">
                <a href="#" className="footer-logo">
                  JONAPWD<span>.</span>
                </a>
              </div>
              <p className="mb-4 text-capitalize">
                The joint national association of persons with disabilities,
                Anambra state chapter, is a civil society organization and an
                umberella body of the disability cluster-organizations in the
                state. It co-ordinates all targetted activities and programs
                around the promotion of the rights and welfare of persons with
                disabilities in the state.
              </p>
            </div>

            <div className="col-lg-8">
              <div className="row links-wrap">
                <div className="col-sm-4">
                  <p className="d1 font-weight-bold text-uppercase">Quick links</p>
                  <ul className="list-unstyled">
                    {quickLinks.map((qlink) => (
                      <li>
                        <a className="text-light" href={qlink.link}>
                          <span className="fa fa-external-link m-2"></span>
                          <span>{qlink.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="col-sm-4">
                  <p className="d3 text-uppercase">Cluster Groups</p>
                  <ul className="list-unstyled" id="clusters">
                    {clusters.docs?.map((cluster) => (
                      <li>
                        <span
                          role="button"
                          onClick={() =>
                            navigate(`/cluster/view/${cluster._id}`)
                          }
                        >
                          <span className="fa fa-group mx-2"></span>
                          <span>{cluster.clusterName}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="col-sm-4">
                  <p className="font-weight-bold d1 text-uppercase">Activity Sections</p>
                  <ul className="list-unstyled" id="categorys">
                    {categorys.docs?.map((category) => (
                      <li>
                        <span
                          role="button"
                          onClick={() =>
                            navigate(`/post/posts/?categorys=${category._id}`)
                          }
                        >
                          <span className="fa fa-folder-open mx-2"></span>
                          <span>{category.categoryName}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="border-top copyright">
            <div className="row pt-4">
              <div className="col-lg-6">
                <p className="mb-2 text-center text-lg-start">
                  Copyright &copy;
                  <script>document.write(new Date().getFullYear());</script>.
                  All Rights Reserved. &mdash; Designed with love by{" "}
                  <a href="">Bonaventure, AppLaws IT</a>{" "}
                  {/* License information: https://untree.co/license/ */}
                </p>
              </div>

              <div className="col-lg-6 text-center text-lg-end">
                <ul className="list-unstyled d-inline-flex ms-auto">
                  <li className="me-4">
                    <a href="#">Terms &amp; Conditions</a>
                  </li>
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* End Footer Section */}
    </>
  );
};
