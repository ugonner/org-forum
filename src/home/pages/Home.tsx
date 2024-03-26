import React from "react"
import { Header } from "../../generics/components/Header"
import { Footer } from "../../generics/components/Footer"
import { Banner } from "../components/Banner"
import { Aboutus } from "../components/Aboutus"
import { MissionStatements } from "../components/MissionStatements"
import { ThematicAreas } from "../components/ThematicAreass"
import { Testimonials } from "../components/Testimonials"
import { BlogPosts } from "../components/Blogposts"
//import "./css/style.css"
export const HomePage: React.FC = () => {
    return (
		<>
		<Header/>
		<Banner />
		<MissionStatements />
		<Aboutus />
		<ThematicAreas />
		<Testimonials />
		<BlogPosts />
		<Footer/>	

</>	



    )
}