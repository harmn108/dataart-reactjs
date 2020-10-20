const INITIAL_STATE = {
  dictionaryId: 0,
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "CHANGE_DIRECTORY":
      return {
        ...state,
        directoryId: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
