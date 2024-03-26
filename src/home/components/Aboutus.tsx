import React from "react";

export const Aboutus: React.FC = () => {
    return (
        <>
        
		
		{/* Start We Help Section */}
		<div className="we-help-section">
			<div className="container">
				<div className="row justify-content-between">
					<div className="col-lg-7 mb-5 mb-lg-0">
						<div className="imgs-grid">
							<div className="grid grid-1"><img src="images/img-grid-1.jpg" alt="Untree.co"/></div>
							<div className="grid grid-2"><img src="images/img-grid-2.jpg" alt="Untree.co"/></div>
							<div className="grid grid-3"><img src="images/img-grid-3.jpg" alt="Untree.co"/></div>
						</div>
					</div>
					<div className="col-lg-5 ps-lg-5">
						<h2 className="section-title mb-4">About JONAPWD Anambra state</h2>
						<p>
                            Brief about JONAPWD: JONAPWD is a not for profit and non-governmental organization formed in 2001 in Anambra State but has been in existence in Nigeria since 1987. The Anambra State Chapter registered under the CAC in 2008 with registration number 28709. The Association is being managed by persons with disabilities with support from the Ministry of Women Affairs and Social Development. It is an umbrella body that oversees the activities of all other cluster associations of persons with disabilities in Anambra State.
                       </p>

						<ul className="list-unstyled custom-list my-4">
							<li>An umbrella body of organizations <em>of</em> persons with disabilities in Anambra state</li>
							<li>De facto civil society organization advocating general cause of persons with disabilities</li>
						</ul>
						<p><a href="#" className="btn">Explore</a></p>
					</div>
				</div>
			</div>
		</div>
		{/* End We about Section */}

        </>
    )
}