import React from "react";

export const Banner: React.FC = () => {
    return (
        <>
        
		{/* Start Hero Section */}
			<div className="hero">
				<div className="container">
					<div className="row justify-content-between">
						<div className="col-lg-5">
							<div className="intro-excerpt">
								<h1>Stand With Us, <span className="d-block">Ability For All</span></h1>
								<p className="mb-4">We stand for the protection and promoting the rights and independent living standard of persons with disabilities.</p>
								<p><a href="#focalareas" className="btn btn-secondary me-2">Priority Areas</a>
								<a href="#about" className="btn btn-white-outline">Explore</a></p>
							</div>
						</div>
						<div className="col-lg-7">
							<div className="hero-img-wrap">
								<img src="images/banners/dark-wheelchair.jpg" className="img-fluid my-5"/>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/* End Hero Section */}
        </>
    )
}