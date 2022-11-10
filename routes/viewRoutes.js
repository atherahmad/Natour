import express from "express";
import { getOverview, getTour, getLoginForm } from "../controllers/viewsController.js";


const router = express.Router()
  
  // Views route for rendering overview page with all tours
  // overview.pug extends the base --> it includes the base, thats why we can render just overview.pug or tour.pug and still rendering base with it. 
router.get("/", getOverview)
  
  // Views route for rendering overview page for a specific tour // in overview.pug template we have a anchor tag which redirects our route to /tour/${item.slug}. So the getTour controller will apply.
router.get("/tour/:slug", getTour)

router.get("/login", getLoginForm)



export default router