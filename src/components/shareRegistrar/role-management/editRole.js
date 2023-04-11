import React, { Fragment, useState } from "react";
import CheckboxTree from "react-checkbox-tree";
import { updateRole, getFeatures } from "../../../store/services/role.service";
import { Row } from "reactstrap";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { WATCH_ROLES, WATCH_ROLES_DROPDOWN } from "../../../redux/actionTypes";

export default function ViewRole({ setViewEditPage }) {
  const dispatch = useDispatch();
  const data = JSON.parse(sessionStorage.getItem("selectedRole"));
  const [description, setDescription] = useState(data.description);
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState([]);
  const tmpArray = [];
  const tmpCrudFeatures = [];
  const [expanded, setExpanded] = useState([
    "Features",
    "Dashboard",
    "Company",
    "Investors",
    "Shareholding",
    "Processing",
    "Corporate",
    "Dividend  Disbursement",
  ]);
  const [features, setFeatures] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [crudFeatures, setCrudFeatures] = useState([]);

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
  React.useEffect(() => {
    getFeatures(sessionStorage.getItem("email") || "")
      .then((response) => {
        const selectedRole = JSON.parse(data.features);
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

    JSON.parse(data.features)[0]
      .children.map((item) => {
        return item.children.map((tem) => {
          tmpCrudFeatures.push(tem);
          return tem.feature || [];
        });
      })
      .filter((item) => item.length > 0 || item.feature === "Dashboard")
      .forEach((item) => {
        item.forEach((te) => tmpArray.push(te));
      });

    tmpArray.push("Dashboard");
    setChecked(tmpArray);
    setCrudFeatures(tmpCrudFeatures.map((c) => [c]));

    return () => {
      sessionStorage.setItem("selectedRole", {});
    };
  }, []);

  const handleEditRole = async () => {
    // new
    setNameError(false);
    setDescriptionError(false);
    setLoading(true);
    if (!description || description.trim() === "") {
      setDescriptionError(true);
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
    const tmpArr = [];

    const new_features = features.filter((feat) => {
      feat.children = feat.children.filter((fea) => {
        fea.children = fea.children.filter((fe) =>
          checked.includes(fe.feature)
        );
        fea.children.forEach((ch) => {
          ch.crud = crudFeatures.find(
            (item) => item[0].feature === ch.feature
          )[0].crud;
        });
        return (
          fea.children.length !== 0 ||
          (fea.feature === "Dashboard" && fea.children.length === 0)
        );
      });
      return feat;
    });
    const response = await updateRole(
      email,
      description,
      JSON.stringify(new_features),
      data.role_name
    );
    if (response.status === 200) {
      toast.success(`${response.data.message}`);
      dispatch({ type: WATCH_ROLES_DROPDOWN });
      dispatch({ type: WATCH_ROLES });
      setViewEditPage(false);
    } else {
      toast.error(`${response.data.message}`);
    }
    setLoading(false);
    // end
  };
  const handleOnChecked = (chk) => {
    chk.forEach((ch) => {
      features[0].children.forEach((child) => {
        tmpArray.push(child.children.filter((chil) => chil.feature === ch));
      });
    });

    const tmpCrudFeatures = tmpArray.filter((item) => {
      return item.length !== 0;
    });
    setCrudFeatures(tmpCrudFeatures);
    setChecked(chk);
  };
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
                  value={data.role_name}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label htmlFor="symbol">Description</label>
                <textarea
                  className="custom-select form-control"
                  name="description"
                  type="text"
                  placeholder="Description"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                />
                {descriptionError && (
                  <small className="text-danger">Enter Role Description</small>
                )}
              </div>
              {/* start */}
              <div className="mb-3">
                <label htmlFor="symbol">Assigned Features</label>
                <Row className="mt-3 ml-2">
                  {nodes && checked.length > 1 && (
                    <CheckboxTree
                      className="d-block"
                      nodes={nodes}
                      checked={checked}
                      onCheck={(chk) => {
                        setChecked(chk);
                        handleOnChecked(chk);
                      }}
                      expanded={expanded}
                      onExpand={(expanded) => {
                        setExpanded(expanded);
                      }}
                      iconsClass="fa4"
                    />
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
                      {crudFeatures.length > 0 &&
                        crudFeatures.map((item, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{item[0].label}</td>
                            <td>
                              {item[0].crud.map((tem, index) => {
                                return (
                                  <span
                                    key={index}
                                    className={`checkbox checkbox-${
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
                                      id={`${item[0].feature}${i}${index}`}
                                      type="checkbox"
                                      defaultChecked={tem}
                                      onChange={(e) => {
                                        item[0].crud[index] = e.target.checked;
                                      }}
                                    />
                                    <label
                                      htmlFor={`${item[0].feature}${i}${index}`}
                                    >
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
            onClick={handleEditRole}
            disabled={Boolean(loading) || !nodes.length}
          >
            {loading ? (
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
