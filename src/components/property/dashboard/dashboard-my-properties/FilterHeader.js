"use client"
import dynamic from "next/dynamic";
import Link from "next/link";

const Select = dynamic(() => import("react-select"), { ssr: false });

const Options = [
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
];

const customStyles = {
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? "#0f8363" : isFocused ? "#ebfff9" : undefined,
  }),
};

const FilterHeader = ({ show, handleChange, selectedValue }) => {
  // Find the selected option based on the selectedValue
  const selectedOption = Options.find(option => option.value === selectedValue) || Options[0];

  return (
    <div className="dashboard_search_meta d-md-flex items-center justify-content-xxl-end gap-3">
      <div className="item1 mb15-sm">
        <div className="search_area">
          <input
            type="text"
            className="form-control bdrs12"
            placeholder="Property Name ..."
            required
          />
          <label>
            <span className="flaticon-search" />
          </label>
        </div>
      </div>
      {/* End item1 */}

      {show ? (
        <div className="sm:col-3">
          <div className="">
            <div className="location-area">
              <Select
                name="status"
                value={selectedOption}
                onChange={handleChange}
                options={Options}
                styles={customStyles}
                className="select-custom pl-0"
                classNamePrefix="select"
                required
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="page_control_shorting bdr1 bdrs12 py-2 ps-3 pe-2 mx-1 mx-xxl-3 bgc-white mb15-sm maxw160">
          <div className="pcs_dropdown d-flex align-items-center">
            <span style={{ minWidth: "50px" }} className="title-color text-nowrap">
              Sort by:
            </span>
            <select className="form-select show-tick">
              <option>Published</option>
              <option>Pending</option>
              <option>Processing</option>
            </select>
          </div>
        </div>
      )}
      {<Link href="/dashboard/seller/request-to-add-new-property" className="ud-btn btn-thm">
        Request to add New Property
        <i className="fal fa-arrow-right-long" />
      </Link>}
    </div>
  );
};

export default FilterHeader;
