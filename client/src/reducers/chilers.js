import {ADD_CHILLER, CHILLER_ERROR, FETCH_CHILLERS, FETCH_RECENT} from "../actions/types";

const INITIAL_STATE = {
  chillers: [],
  Recent:[],
  errorMessage: ''
};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case ADD_CHILLER:
      return {...state, chillers: action.payload };
    case CHILLER_ERROR:
      return {...state, errorMessage: action.payload };
    case FETCH_CHILLERS:
      return {...state, chillers: action.payload };
    case FETCH_RECENT:
      return {...state, recent: action.payload };
    default:
      return state;
  }
}
