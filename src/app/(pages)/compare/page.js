import CallToActions from "@/components/common/CallToActions";
import ComapareTable from "@/components/pages/compare/ComapareTable";

export const metadata = {
  title: "Compare  || ZeroBroker - Real Estate NextJS Template",
};

const Compare = () => {
  return (
    <>
      {/* Breadcrumb Sections */}
      <section className="breadcumb-section3 p-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <h2 className="title text-white">Compare Properties</h2>
                <div className="breadcumb-list">
                  <a className="text-white" href="#">
                    Home
                  </a>
                  <a className="text-white" href="#">
                    Compare
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Breadcrumb Sections */}

      {/* Our Compare Area */}
      <section className="our-compare">
        <div className="container">
          <div className="row wow fadeInUp" data-wow-delay="300ms">
            <div className="col-lg-12">
              <div className="table-style2 table-responsive">
                <ComapareTable />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Our Compare Area */}

      {/* Our CTA */}
      <CallToActions />
      {/* Our CTA */}
    </>
  );
};

export default Compare;
