// Error Styles
export const errorStyles = {
  control: (base, state) => ({
    ...base,
    border: "1px solid red",
  }),
};
export const disabledStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#E9ECEF",
  }),
};

export const darkStyle = {
  control: (base, state) => ({
    ...base,
    // backgroundColor: "#293240",
    backgroundColor: "white",
    color: "#333",
    border: "1px solid #374558",
  }),

  input: (base, state) => ({
    ...base,
    color: "#333",
  }),
  singleValue: (base, state) => ({
    ...base,
    color: "#333",
  }),
  menu: (base, state) => ({
    ...base,
    color: "#333",
  }),
};
