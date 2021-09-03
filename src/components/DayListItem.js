import React from "react";
import classnames from "classnames"
import "components/DayListItem.scss";
const formatSpots = (spots) => {
  if(spots){
    if (spots >= 2) {
      return `${spots} spots remaining`
    }
    if (spots < 2) {
      return `${spots} spot remaining`
    }
  }
  return `no spots remaining`
};
export default function DayListItem(props) {
  const dayClass = classnames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  })
  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2 >{props.name}</h2>
      <h3 >{formatSpots(props.spots)}</h3>
    </li>
  );
}