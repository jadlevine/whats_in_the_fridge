import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const AddNewFoodForm = (props) => {
  //props = house, setHouse, setHouseUpdate

  //house state is not available upon initial load?
  ///but this works?
  let { houseid } = useParams()

  //maybe useful
  // setFormState(initialState)

  const [newFood, setNewFood] = useState({
    name: '',
    ///houseid is just the string... be careful when you make the axios call to create the new food
    house: houseid,
    storage: '',
    opened: false,
    notes: []
  })

  const handleChange = (event) => {
    setNewFood({ ...newFood, [event.target.name]: event.target.value })
  }

  const addFood = async (event) => {
    event.preventDefault()
    //make axios call here with newFood

    //add newFood to food collection in db (with house:houseid as reference)
    try {
      let response = await axios.post(`http://localhost:3001/foods`, newFood)

      //LOCALLY update the array (holding foodid references) for the selected storage location
      let foodsInStorage = props.house[newFood.storage]
      foodsInStorage.push(response.data._id)

      // update the house in db
      try {
        let houseupdate = await axios.put(
          `http://localhost:3001/houses/${props.house._id}`,
          { [newFood.storage]: foodsInStorage }
        )

        // //update the house state
        // props.setHouse(houseupdate.data)
        // //is the above NOT necessary, with the below?

        //trigger getHouse to repull the house document from db
        props.setHouseUpdate(true)
      } catch (err) {
        console.log(err)
      }
    } catch (err) {
      console.log(err)
    }
  } //end of addFood function

  return (
    <form onSubmit={addFood} className="add-form">
      <h3>Add a Food!</h3>
      <input
        type="text"
        value={newFood.name}
        onChange={handleChange}
        name={'name'}
        placeholder={'Food Name (required)'}
        required
      />
      <br />
      <select
        name="storage"
        value={newFood.storage}
        onChange={handleChange}
        required
      >
        <option value="" disabled>
          Storage Location (required)
        </option>
        <option value="fridge">Fridge</option>
        <option value="freezer">Freezer</option>
        <option value="pantry">Pantry</option>
        <option value="otherStorage">Other Storage</option>
      </select>
      <br />
      <button>Submit</button>
    </form>
  )
}

export default AddNewFoodForm

//notes
///HERE...going back to HouseDetails.js
///then https://mongoosejs.com/docs/populate.html#:~:text=so%20far%20we%20haven't%20done%20anything%20much%20different.%20we've%20merely%20created%20a%20person%20and%20a%20story.%20now%20let's%20take%20a%20look%20at%20populating%20our%20story's

//oldish?
// https://github.com/SEI-R-9-19/u2_lesson_react_forms/blob/solution/client/src/components/Form.js#:~:text=setformstate(initialstate)
// setFormState(initialState)
// props.getFridgeFoods()
// props.setFridgeContents(...props.fridgeContents, response.data)
