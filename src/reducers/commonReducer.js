const commonReducer = (actionType, initialState) => (
  state = initialState,
  action
) => {
  switch (action.type) {
    case actionType:
      return action.payload;
    default:
      return state;
  }
};

export default commonReducer;
