import React from "react";

export const MissionStatements: React.FC = () => {
    return (
        <>
        
		{/* Start Popular Product */}
		<div className="popular-product">
			<div className="container">
				<div className="row my-5">

					<div className="col-12 col-md-6 col-lg-4 mb-4 mb-lg-0">
						<div className="product-item-sm d-flex row">
							<div className="img-responsive col-7">
							<img src="images/thumbnails/victory-wheelchair.jpg" alt="Image" className="img-fluid"/>
							
							</div>
							<div className="col-5">
								<h3>Our Vision</h3>
								<p>Promoting and ensuring full inclusion of PWDs in the society </p>
								<p></p>
							</div>
						</div>
					</div>

					<div className="col-12 col-md-6 col-lg-4 mb-4 mb-lg-0">
						<div className="product-item-sm d-flex row">
							<div className="img-responsive col-7">
									<img src="images/thumbnails/inscripton.jpg" alt="Image" className="img-fluid"/>
							</div>
							<div className="col-5">
								<h3>Our Mission Is Simple</h3>
								<p>Promoting the rights provisions of PWDs </p>
								<p></p>
							</div>
						</div>
					</div>

					<div className="col-12 col-md-6 col-lg-4 mb-4 mb-lg-0">
						<div className="product-item-sm d-flex row">
							<div className="col-7 img-responsive">
							<img src="images/thumbnails/wheelchair-with-amputee.jpg" alt="Image" className="img-fluid"/>
							
							</div>
							<div className="col-5">
								<h3>Our Inclusion Policy Is Simple</h3>
								<p>Nothing about us without us </p>
								<p></p>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
		{/* End Popular Product */}
        </>
    )
}