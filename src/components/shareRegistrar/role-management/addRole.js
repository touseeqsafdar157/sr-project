import React, { Fragment, useState } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { addRole, getFeatures } from "../../../store/services/role.service";
import { ToastContainer, toast } from "react-toastify";
import CheckboxTree from "react-checkbox-tree";
import { Link, useHistory } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import "./checkbox-tree.css";
import { useDispatch } from "react-redux";
import { WATCH_ROLES, WATCH_ROLES_DROPDOWN } from "../../../redux/actionTypes";

export default function AddRole({ setViewAddPage }) {
  const dispatch = useDispatch();
  const [roleName, setRoleName] = useState("");
  const [feature, setFeature] = useState("");
  const [description, setDescription] = useState("");
  // new
  const history = useHistory();
  const tmpArray = [];
  const [Loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  // const [description, setDescription] = useState("");
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState(["Features"]);
  const [checkedFeatues, setCheckedFeatues] = useState([]);

  const [nodes, setNodes] = useState([]);
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [featruesError, setFeaturesError] = useState(false);
  const [tmpFeatures, setTmpFeatures] = useState([]);
  const [selectedTmpFeature, setSelectedTmpFeature] = useState({});
  const [features, setFeatures] = useState([]);

  const [create, setCreate] = useState(false);
  const [read, setRead] = useState(false);
  const [update, setUpdate] = useState(false);
  const [del, setDel] = useState(false);
  const [itemChanged, setItemChanged] = useState(false);

  const [featureList, setFeatureList] = useState([]);
  const handleOnChecked = (chk) => {
    chk.forEach((ch) => {
      features[0].children.forEach((child) => {
        tmpArray.push(child.children.filter((chil) => chil.feature === ch));
      });
    });

    setFeatureList(tmpArray.filter((item) => item.length !== 0));
    setChecked(chk);
  };
  const renderFeatures = () => {
    return (
      <ul id="feature_listing">
        <br />
        {tmpFeatures.length > 0 &&
          tmpFeatures.map((item) => {
            return (
              item[0].crud_enabled === "true" && (
                <li
                  className={`feature-item`}
                  onClick={(e) => {
                    setSelectedTmpFeature(item[0]);
                    setItemChanged(false);
                    setTimeout(() => {
                      setItemChanged(true);
                    }, 200);
                  }}
                >
                  {item[0].feature}
                </li>
              )
            );
          })}
      </ul>
    );
  };
  const renderCheckBoxes = (feat) => {
    return (
      <div className="form-group m-t-15 m-checkbox-inline mb-0 ml-1">
        <div className="checkbox checkbox-success">
          <input
            id="create"
            type="checkbox"
            defaultChecked={feat[0].crud[0]}
            onChange={(e) => {
              feat[0].crud[0] = e.target.checked;
            }}
          />
          <label htmlFor="create">{"Create"}</label>
        </div>
        <div className="checkbox checkbox-secondary">
          <input
            id="read"
            type="checkbox"
            defaultChecked={feat[0].crud[1]}
            onChange={(e) => {
              feat[0].crud[1] = e.target.checked;
            }}
          />
          <label htmlFor="read">{"Read"}</label>
        </div>
        <div className="checkbox checkbox-primary">
          <input
            id="update"
            type="checkbox"
            defaultChecked={feat[0].crud[2]}
            onChange={(e) => {
              feat[0].crud[2] = e.target.checked;
            }}
          />
          <label htmlFor="update">{"Update"}</label>
        </div>
        <div className="checkbox checkbox-danger">
          <input
            id="delete"
            type="checkbox"
            defaultChecked={feat[0].crud[3]}
            onChange={(e) => {
              feat[0].crud[3] = e.target.checked;
            }}
          />
          <label htmlFor="delete">{"Delete"}</label>
        </div>
      </div>
    );
  };
  const handleAddRole = async () => {
    // new
    setNameError(false);
    setDescriptionError(false);
    setFeaturesError(false);
    setLoading(true);
    if (!name || name.trim() === "") {
      toast.error("Name is Required");
      setLoading(false);
      return;
    }
    if (!description || description.trim() === "") {
      toast.error("Description is Required");
      setLoading(false);
      return;
    }
    if (checked.length === 0) {
      toast.error("Please Select Features to proceed");
      setLoading(false);
      return;
    }
    const email = sessionStorage.getItem("email");
    const keepchild = false;
    setLoading(true);
    const new_features = features.filter((feat) => {
      feat.children = feat.children.filter((fea) => {
        fea.children = fea.children.filter((fe) =>
          checked.includes(fe.feature)
        );
        return (
          fea.children.length !== 0 ||
          (fea.feature === "Dashboard" && fea.children.length === 0)
        );
      });
      return feat;
    });

    const response = await addRole(
      email,
      description,
      JSON.stringify(new_features),
      name
    );
    if (response.status === 200) {
      toast.success(`${response.data.message}`);
      dispatch({ type: WATCH_ROLES_DROPDOWN });
      dispatch({ type: WATCH_ROLES });
      setDescription("");
      // setFeature("");
      setName("");
      setRoleName("");
      setViewAddPage(false);
    } else {
      toast.error(`${response.data.message}`);
    }
    setLoading(false);

    // end
  };

  React.useEffect(() => {
    getFeatures(sessionStorage.getItem("email") || "")
      .then((response) => {
        setFeatures(JSON.parse(response.data.defaultFeatures));
        setNodes(
          JSON.parse(response.data.defaultFeatures).map((feature) => {
            return {
              value: feature.feature,
              label: feature.feature,
              children:
                feature.children.map((child) => {
                  return {
                    value: child.feature,
                    label: child.feature,
                    children:
                      child.children.map((ch) => {
                        return {
                          value: ch.feature,
                          label: ch.feature,
                        };
                      }) || [],
                  };
                }) || [],
            };
          })
        );
      })
      .catch((err) => {});
  }, []);
  return (
    <Fragment>
      <div className="row">
        <div className="col-sm-12 col-md-4 ">
          <div className="card ">
            <div className="card-header b-t-primary">
              <h5>Role Detail</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label>Role Name</label>
                <input
                  className="form-control"
                  name="rollName"
                  type="text"
                  placeholder="Roll Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="symbol">Description</label>
                <input
                  className="custom-select form-control"
                  name="description"
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              {/* start */}
              <div className="mb-3">
                <label htmlFor="symbol">Assign Features</label>
                <Row className="mt-3 ml-2">
                  {nodes && (
                    <CheckboxTree
                      className="d-block"
                      nodes={nodes}
                      checked={checked}
                      expanded={expanded}
                      onCheck={(chk) => {
                        setChecked(chk);
                        handleOnChecked(chk);
                      }}
                      onExpand={(expanded) => {
                        setExpanded(expanded);
                      }}
                      iconsClass="fa4"
                    />
                  )}
                  {featruesError === true ? (
                    <p className="error-labels">Select Features.</p>
                  ) : (
                    ""
                  )}
                </Row>
              </div>

              {/* end */}
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-md-8">
          <div className="card ">
            <div className="card-header b-t-primary">
              <h5>Feature Modification</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="table-responsive">
                  <table className="table card-table table-vcenter text-nowrap">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Feature</th>
                        <th>Access</th>
                      </tr>
                    </thead>
                    <tbody>
                      {featureList &&
                        featureList.map((item, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{item[0].feature}</td>
                            <td>
                              {/* <span className="status-icon bg-success"></span> */}
                              {item[0].crud.map((tem, index) => {
                                return (
                                  <span
                                    class={`checkbox checkbox-${
                                      index === 0
                                        ? "success"
                                        : index === 1
                                        ? "primary"
                                        : index === 2
                                        ? "info"
                                        : index === 3
                                        ? "danger"
                                        : "dark"
                                    } mx-3`}
                                  >
                                    <input
                                      id={`${item[0]}${i}${index}`}
                                      type="checkbox"
                                      defaultChecked={tem}
                                      onChange={(e) => {
                                        item[0].crud[index] = e.target.checked;
                                      }}
                                    />
                                    <label for={`${item[0]}${i}${index}`}>
                                      {index === 0
                                        ? "Create"
                                        : index === 1
                                        ? "Read"
                                        : index === 2
                                        ? "Update"
                                        : index === 3
                                        ? "Delete"
                                        : "Access"}
                                    </label>
                                  </span>
                                );
                              })}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    {featureList.length !== 0 &&
                      tmpFeatures.map((feat) => renderCheckBoxes(feat))}
                  </div>
                </div>
                {/* <div className="col-md-6">
                  {itemChanged && renderFeatures()}
                </div> */}
              </div>

              {/* end */}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <button
            className="btn btn-primary "
            onClick={handleAddRole}
            disabled={Boolean(Loading)}
          >
            {Loading ? (
              <>
                <span className="fa fa-spinner fa-spin"></span>
                <span> Loading...</span>
              </>
            ) : (
              <span>Submit</span>
            )}
          </button>
        </div>
      </div>
    </Fragment>
  );
}
