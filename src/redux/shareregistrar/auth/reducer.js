import { GET_FEATURES } from "../../actionTypes";
const initial_state = { features: [] };
export default (state = initial_state, action) => {
  switch (action.type) {
    case GET_FEATURES:
      return {
        ...state,
        features: action.payload[0].children.map((f) => {
          if (f.feature)
            f.children =
              f.children.length !== 0
                ? f.children.map((j) => ({
                    ...j,
                    type: "link",
                    title: j.label,
                    path: j.route,
                  }))
                : [];
          return {
            ...f,
            title: f.feature === "Shareholder" ? "Shareholders" : f.feature,
            type: f.feature === "Dashboard" ? "link" : "sub",
            classname: f.icon,
            path: f.route,
            badgeType: "primary",
            active: false,
          };
        }),
      };
    default:
      return state;
  }
};
