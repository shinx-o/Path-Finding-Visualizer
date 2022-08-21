export const INITIAL_STATE = {
  ROWS: Math.floor(window.innerHeight / 28.9) - 8,
  COLS: Math.floor(window.innerWidth / 28.9) - 4,
  disableControls: false,
  algorithm: "null",
  speed: 8,
  message: null,
  grid: [[]],
  removeWalls: false,
  source: {
    r: Math.floor((Math.floor(window.innerHeight / 28.9) - 8) / 2),
    c: 5,
  },
  target: {
    r: Math.floor((Math.floor(window.innerHeight / 28.9) - 8) / 2),
    c: Math.floor(window.innerWidth / 28.9) - 4 - 5,
  },
};

export const boardState = (state, action) => {
  switch (action.type) {
    case "CHANGE_ROWS":
      return {
        ...state,
        ROWS: action.payload,
      };
    case "CHANGE_COLS":
      return {
        ...state,
        COLS: action.payload,
      };
    case "DISABLE_CONTROLS":
      return {
        ...state,
        disableControls: action.payload,
      };
    case "ALGORITHM":
      return {
        ...state,
        algorithm: action.payload,
      };
    case "SPEED":
      return {
        ...state,
        speed: action.payload,
      };
    case "MESSAGE":
      return {
        ...state,
        message: action.payload,
      };
    case "GRID":
      return {
        ...state,
        grid: action.payload,
      };
    case "REMOVE_WALLS":
      return {
        ...state,
        removeWalls: action.payload,
      };
    default:
        return state;
  }
};
