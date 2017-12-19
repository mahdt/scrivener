import { combineReducers } from 'redux';
// import x from 'client/app/redux/x;
/*
{
	data: [{
		id: "habib",
		image:
	}]
}
*/
function counter(state=0, action){
	switch (action.type) {
		case 'ADD':
			return state + 1;
		case 'SUBTRACT':
			return state - 1;
		default:
			return state		
	}
}
export default combineReducers({
  counter
});
