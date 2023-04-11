import React, { Fragment, useState } from "react";
import CheckboxTree from "react-checkbox-tree";
import { Row } from "reactstrap";

export default function ViewRole() {
  let [checked, setChecked] = useState([]);
  const tmpArray = [];
  const tmpCrudFeatures = [];
  let [expanded, setExpanded] = useState([
    "Features",
    "Dashboard",
    "Company",
    "Investors",
    "Shareholding",
    "Processing",
    "Corporate",
    "Dividend  Disbursement",
  ]);
  const data = JSON.parse(sessionStorage.getItem("selectedRole"));
  const [nodes, setNodes] = useState([]);
  const [crudFeatures, setCrudFeatures] = useState([]);
  React.useEffect(() => {
  }, [crudFeatures]);
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
    setNodes([
      {
        label: "Features",
        value: "Features",
        children: JSON.parse(data.features)[0].children.map((feature) => {
          return {
            value: feature.feature,
            label: feature.feature,
            ...(feature.children.length !== 0 && {
              children: feature.children.map((child) => {
                return {
                  value: child.feature,
                  label: child.feature,
                };
              }),
            }),
          };
        }),
      },
    ]);
    // setCrudFeatures(
    //   JSON.parse(data.features)
    //     .map((item) => {
    //       return item.children.map((tem) => {
    //         return tem || [];
    //       });
    //     })
    //     .filter((item) => item.length > 0)
    // );

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
    setCrudFeatures(tmpCrudFeatures);

    return () => {
      sessionStorage.setItem("selectedRole", {});
    };
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
                  value={data.role_name}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label htmlFor="symbol">Description</label>
                <textarea
                  className="custom-select form-control"
                  name="description"
                  type="text"
                  placeholder="Description"
                  value={data.description}
                  disabled
                />
              </div>
              {/* start */}
              <div className="mb-3">
                <label htmlFor="symbol">Assigned Features</label>
                <Row className="mt-3 ml-2">
                  {nodes && checked.length > 1 && (
                    <CheckboxTree
                      disabled
                      className="d-block"
                      nodes={nodes}
                      checked={checked}
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
                            <td>{item.label}</td>
                            <td>
                              {item.crud.map((tem, index) => {
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
                                      id={`${item.feature}${i}${index}`}
                                      type="checkbox"
                                      disabled
                                      defaultChecked={tem}
                                      onChange={(e) => {
                                        item.crud = e.target.checked;
                                      }}
                                    />
                                    <label
                                      htmlFor={`${item.feature}${i}${index}`}
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
    </Fragment>
  );
}
