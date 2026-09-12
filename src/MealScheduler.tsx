import React, {useState, useMemo} from 'react';

type meal = {
	number: number,
	quantity: number,
	chef: "Devon" | "Ali" | "Either",
	meal_string: string
}

export default () => {

	const [lunchMealEaters, lunchMealEaterSetter] = useState(["None", "Both", "Both", "Both", "Both", "Both", "Both", "Both"]);
	const [dinnerMealEaters, dinnerMealEaterSetter] = useState(["Both", "Both", "Both", "Both", "Both", "None", "Devon", "Both"]);
	const [cookOption, cookOptionSetter] = useState(["Both", "Both", "Both", "Both", "Both", "None", "Both", "Both"]);
	const [mealList, mealListSetter] = useState<meal[]>([]);

	function newMealNum() {
		let x = 1;
		mealList.forEach((val) => {
			if (val.number == x) {
				x += 1;
			}
		})
		return x;
	}

	function addMeal() {
		let newmealno = 0;
		mealListSetter((cur) => {
			let temp = [...cur];
			newmealno = newMealNum();
			temp.push({number: newmealno, quantity: 4, chef: "Either", meal_string: ""});
			return temp.sort(mealSorter);
		})
		return newmealno;
	}

	function addQuantityToMeal(meal_num: number, quant_to_add: number) {
		mealListSetter((cur) => {
			let temp = [...cur];
			temp.forEach((meal) => {
				if (meal.number == meal_num) {
					meal.quantity += quant_to_add
				}
			})
			return temp;
		})
	}

	function getDayOfWeek(num: number) {
		switch (num) {
			case 0:
				return "Fri";
			case 1:
				return "Sat";
			case 2:
				return "Sun";
			case 3:
				return "Mon";
			case 4:
				return "Tue";
			case 5:
				return "Wed";
			case 6:
				return "Thu";
			case 7:
				return "Fri";
		}
	}

	const MealOptions: string[][] = React.useMemo(() => {
		let lunch =  ["N/A", "", "", "", "", "", "", ""];
		let dinner =  ["", "", "", "", "", "", "", ""];
		let meal_cooked =  ["", "", "", "", "", "", "", ""];

		// No meal slots have been used
		let meals: meal[] = mealList

		// Number of existing meals, once this hits zero, start adding new meals
		let predefined_meals = meals.reduce((pv, v) => {
			v.meal_string = "";
			return pv + v.quantity}, 0)


		function addMealTemp() {
			let newmealno = newMealNumTemp();
			meals.push({number: newmealno, quantity: 4, chef: "Either", meal_string: ""});
			meals.sort(mealSorter);
			return newmealno;
		}

		function newMealNumTemp() {
			let x = 1;
			meals.forEach((val) => {
				if (val.number == x) {
					x += 1;
				}
			})
			return x;
		}

		function addTomealTemp(meal_num: number, quant_to_add: number) {
			meals.forEach((meal) => {
				if (meal.number == meal_num) {
					meal.quantity += quant_to_add
				}
			})
		}

		function changeChefTemp(meal_num: number, chef: "Ali" | "Devon" | "Either") {
			meals.forEach((meal) => {
				if (meal.number == meal_num) {
					meal.chef = chef;
				}
			})
		}

		if (meals.length == 0) {
			addMealTemp();
		}

		let cur_meal_num = meals[0].number;
		let cur_meal_qua = meals[0].quantity;
		let meal_index = 0
		meal_cooked[0] = "" + cur_meal_num;

		// Cycle through the days
		lunch.forEach((lun, index) => {
			if (lun != "N/A") {
				let lunch_meals_needed = 1;
				if (lunchMealEaters[index] == "Both") {
					lunch_meals_needed = 2;
				} else if (lunchMealEaters[index] == "None") {
					lunch_meals_needed = 0;
				}
				// We are out of meals for lunch, need new meal.
				if (cur_meal_qua < 2 && lunchMealEaters[index] == "Both") {
					// See if we could cook it the evening before
					if (cookOption[index - 1] != "None" && meal_cooked[index - 1] == "") {
						// Swap this meal for the previous dinner, then add a new meal for that dinner

						if (predefined_meals < lunch_meals_needed) {
							cur_meal_num = addMealTemp();
							cur_meal_qua = 4 - lunch_meals_needed;
						} else {
							meal_index++;
							cur_meal_num = mealList[meal_index].number
							cur_meal_qua = mealList[meal_index].quantity - lunch_meals_needed;
						}
						meal_cooked[index - 1] = "" + cur_meal_num;
						lunch[index] = dinner[index-1];
						dinner[index-1] = "" + cur_meal_num
					// Otherwise try to add it to the current working meal
					} else {
						cur_meal_qua += 2;
						cur_meal_qua -= lunch_meals_needed;
						addTomealTemp(cur_meal_num, 2);
						lunch[index] = "" + cur_meal_num;
					}
				} else if (lunch_meals_needed == 0) {
					lunch[index] = ""
				} else {
					cur_meal_qua -= lunch_meals_needed;
					lunch[index] = "" + cur_meal_num;
				}
				predefined_meals -= lunch_meals_needed;
			}

			let dinner_meals_needed = 1;
			if (dinnerMealEaters[index] == "Both") {
				dinner_meals_needed = 2;
			} else if (dinnerMealEaters[index] == "None") {
				dinner_meals_needed = 0;
				return;
			}
			// We are out of meals for dinner, need new meal.
			if (cur_meal_qua < dinner_meals_needed) {
				if (cookOption[index] != "None" && meal_cooked[index] == "") {
					if (predefined_meals < dinner_meals_needed) {
						cur_meal_num = addMealTemp();
						cur_meal_qua = 4 - dinner_meals_needed;
					} else {
						meal_index++;
						cur_meal_num = mealList[meal_index].number
						cur_meal_qua = mealList[meal_index].quantity - dinner_meals_needed;
					}
					meal_cooked[index] = "" + cur_meal_num;
					// Immediately subtract some of those meals
					dinner[index] = "" + cur_meal_num;
				// Otherwise try to add it to the current working meal
				} else {
					cur_meal_qua += 2;
					cur_meal_qua -= dinner_meals_needed;
					addTomealTemp(cur_meal_num, 2);
					dinner[index] = "" + cur_meal_num;
				}
			} else {
				cur_meal_qua -= dinner_meals_needed;
				dinner[index] = "" + cur_meal_num;
			}
			predefined_meals -= dinner_meals_needed;
		});

		let dev_cooked = 0;
		let ali_cooked = 0;
		// Do the mandatory ones
		meal_cooked.forEach((meal_num, index) => {
			if (cookOption[index] == "Ali") {
				ali_cooked++;
				changeChefTemp(parseInt(meal_num), "Ali");
			} else if (cookOption[index] == "Devon") {
				dev_cooked++;
				changeChefTemp(parseInt(meal_num), "Devon");
			}
		})
		meal_cooked.forEach((meal_num, index) => {
			if (ali_cooked < dev_cooked) {
				ali_cooked++;
				changeChefTemp(parseInt(meal_num), "Ali");
			} else if (dev_cooked < ali_cooked) {
				dev_cooked++;
				changeChefTemp(parseInt(meal_num), "Devon");
			} else {
				if (Math.random() * 2 > 1) {
					ali_cooked++;
					changeChefTemp(parseInt(meal_num), "Ali");
				} else {
					dev_cooked++;
					changeChefTemp(parseInt(meal_num), "Devon");
				}
			}
		})

		dinner.forEach((dinner, index) => {
			meals.forEach((meal) => {
				if ("" + meal.number == dinner) {
					meal.meal_string += getDayOfWeek(index) + " Dinner, " ;
				}
			})
		})

		lunch.forEach((lunch, index) => {
			meals.forEach((meal) => {
				if ("" + meal.number == lunch) {
					meal.meal_string += getDayOfWeek(index) + " Lunch, " ;
				}
			})
		})

		mealListSetter(() => meals)
		return [lunch, dinner, meal_cooked]
	}, [lunchMealEaters, dinnerMealEaters, cookOption])

	function getNext(cur: string) {
		if (cur == "Both"){
			return "Devon"
		} else if (cur == "Devon") {
			return "Ali"
		} else if (cur == "Ali") {
			return "None"
		}
		return "Both"
	}

	function getPrev(cur: string) {
		if (cur == "Both"){
			return "None"
		} else if (cur == "Devon") {
			return "Both"
		} else if (cur == "Ali") {
			return "Devon"
		}
		return "Ali"
	}

	function cycleOption(type: string, index: number, reverse: boolean = false) {
		if (type == "lunchEaters") {
			lunchMealEaterSetter((cur) => {
				let newlmes = [...cur];
				newlmes[index] = reverse ? getPrev(newlmes[index]) : getNext(newlmes[index])
				return newlmes;
			})
		} else if (type == "dinnerEaters") {
			dinnerMealEaterSetter((cur) => {
				let newlmes = [...cur];
				newlmes[index] = reverse ? getPrev(newlmes[index]) : getNext(newlmes[index])
				return newlmes;
			})
		} else if (type == "cook") {
			cookOptionSetter((cur) => {
				let newlmes = [...cur];
				newlmes[index] = reverse ? getPrev(newlmes[index]) : getNext(newlmes[index])
				return newlmes;
			})
		}
	}

	function colorForButton(value: string) {
		if (value == "Both"){
			return "#CC8888"
		} else if (value == "Ali") {
			return "#8888CC"
		} else if (value == "Devon") {
			return "#88CC88"
		} else if (value == "Someone") {
			return "#CC8888"
		}
			return "#888888"
	}

	function colorForOption(value: string) {
		if (value == "" || value == "N/A"){
			return "#ffffff"
		} 
		let hue = (parseInt(value) * 137.508) % 360;
		return `hsl(${hue}, 85%, 85%)`;
	}

	function figureItOut() {
		cookOptionSetter((co) => [...co]);
	}

	function mealSorter(meal_a: {number: number, quantity: number}, meal_b: {number: number, quantity: number}) {
		return meal_a.number - meal_b.number;
	}

	return <div>
		<table>
			<thead>
				<tr>
					<td></td>
					<td>Fri</td>
					<td>Sat</td>
					<td>Sun</td>
					<td>Mon</td>
					<td>Tues</td>
					<td>Wed</td>
					<td>Thur</td>
					<td>Fri</td>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Lunch Eater:</td>
					{lunchMealEaters.map((eaters, index) => 
						<td key={index} style={{width: "67px"}}>
							<button style={{width: "100%", backgroundColor: colorForButton(eaters)}} onClick={() => (cycleOption("lunchEaters", index))} onContextMenu={(event) => {event.preventDefault(); cycleOption("lunchEaters", index, true)}}>{eaters}</button>
						</td>
					)}
				</tr>
				<tr>
					<td>Lunch Meal:</td>
					{MealOptions[0].map((option, index) => 
						<td key={index} style={{width: "67px"}}>
							<input style={{width: "90%", backgroundColor: colorForOption(option)}} value={option} readOnly></input>
						</td>
					)}
				</tr>
				<tr>
					<td>Dinner Eater:</td>
					{dinnerMealEaters.map((eaters, index) => 
						<td key={index} style={{width: "67px"}}>
							<button style={{width: "100%", backgroundColor: colorForButton(eaters)}} onClick={() => (cycleOption("dinnerEaters", index))} onContextMenu={(event) => {event.preventDefault(); cycleOption("dinnerEaters", index, true)}}>{eaters}</button>
						</td>
					)}
				</tr>
				<tr>
					<td>Dinner Meal:</td>
					{MealOptions[1].map((option, index) => 
						<td key={index} style={{width: "60px"}}>
							<input style={{width: "90%", backgroundColor: colorForOption(option)}} value={option} readOnly></input>
						</td>
					)}
				</tr>
				<tr>
					<td>Available Chef:</td>
					{cookOption.map((cook, index) => 
						<td key={index} style={{width: "60px"}}>
							<button style={{width: "100%", backgroundColor: colorForButton(cook)}} onClick={() => (cycleOption("cook", index))} onContextMenu={(event) => {event.preventDefault(); cycleOption("cook", index, true)}}>{cook}</button>
						</td>
					)}
				</tr>
				<tr>
					<td>Meal Cooked:</td>
					{MealOptions[2].map((option, index) => 
						<td key={index} style={{width: "60px"}}>
							<input style={{width: "90%", backgroundColor: colorForOption(option)}} value={option} readOnly></input>
						</td>
					)}
				</tr>
			</tbody>
		</table>
		<button onClick={figureItOut}>Figure It Out</button>
		<table style={{borderCollapse: "collapse"}}>
			<thead>
				<tr>
					<td style={{border: "1px solid #333333"}}>Meal number</td>
					<td style={{border: "1px solid #333333"}}>Quantity</td>
				</tr>
			</thead>
			<tbody>
				{mealList.map((meal, index) => 
					<tr key={index}>
						<td style={{border: "1px solid #333333"}}>{meal.number}</td>
						<td style={{border: "1px solid #333333"}}>
							<button style={{width: "25px"}} onClick={() => {mealListSetter((cur) => {let temp = [...cur]; temp[index].quantity -= 1;return temp})}}>-</button>
							<span style={{paddingLeft: "3px", paddingRight: "3px"}}>{meal.quantity}</span>
							<button style={{width: "25px"}} onClick={() => {mealListSetter((cur) => {let temp = [...cur]; temp[index].quantity += 1;return temp})}}>+</button></td>
						<td style={{border: "1px solid #333333"}}>{meal.chef}</td>
						<td style={{border: "1px solid #333333"}}>{meal.meal_string.slice(0, meal.meal_string.length-2)}</td>
						<td style={{border: "1px solid #333333"}}><button onClick={() => {mealListSetter((cur) => {let temp = [...cur]; temp.splice(index, 1);return temp.sort(mealSorter)})}}>X</button></td>
					</tr>
				)}
				<tr>
					<td>
						<button onClick={() => (addMeal())}>Add new Meal</button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
}