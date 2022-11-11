import axios from "axios"
import {showAlert} from "./alerts.js"

export const updateData = async(name, email) => { // the 2 parameter (data) we want to update in our API
    try {
        const result = await axios({
            method: "PATCH",
            url: "http://127.0.0.1:3000/api/v1/users/updateMe", // the route in backend which we want to update ( where our controller UpdateMe is mounted). We update the name and email in our DB of the current User
            data: {
                name,
                email
            }
        })
        if (result.data.status === "success") {
            showAlert("success", "Data updated successfully!")
        }
    } catch (err) {
        showAlert('error', err.response.data.message)
    }
}