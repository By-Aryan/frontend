
'use client'

import Link from 'next/link';

import React, { useEffect, useState } from 'react'
import PopularListings from './PopularListings'
import listings from '@/data/listings'
import { pageRoutes } from '@/utilis/common';
import { usePropertyStore } from '@/store/store';
export default function PopulerProperty() {
  const [pageData, setPageData] = useState([])
  const { properties } = usePropertyStore()
  const [currentType, setCurrentType] = useState('Rent')
  useEffect(() => {
    console.log(properties)
    const filtered = properties?.filter((elm) => elm.details.purpose == currentType)
    setPageData(filtered)


  }, [currentType])

  return (
    <section className="bgc-dark rounded-b-4xl">
      <div className="container">
        <div className="row " data-aos="fade-up">
          <div className="col-lg-9">
            <div className="main-title2">
              <h2 className="title text-white">
                Discover Popular Properties
              </h2>
              <p className="paragraph text-white">
                Aliquam lacinia diam quis lacus euismod
              </p>
            </div>
          </div>
          {/* End .col */}

          <div className="col-lg-3">
            <div className="dark-light-navtab text-start text-lg-end mt-0 mt-lg-4 mb-4">
              <ul className="nav nav-pills justify-content-start justify-content-lg-end">
                <li className="nav-item" onClick={() => setCurrentType('Rent')}>
                  <button className={`nav-link ${currentType == 'Rent' ? 'active' : ''} `}>For Rent</button>
                </li>
                <li className="nav-item" onClick={() => setCurrentType('Sell')}>
                  <button className={`nav-link me-0 ${currentType == 'Sell' ? 'active' : ''} `}>For Sale</button>
                </li>
              </ul>
            </div>
          </div>
          {/* End .col */}
        </div>
        {/* End .row */}

        <div className="row" data-aos="fade-up" data-aos-delay="300">
          <div className="col-lg-12">
            <PopularListings data={pageData} />
            <div className="d-grid d-md-block text-center mt30 mt0-md">
              <Link href="/properties/All/uae" className="ud-btn btn-thm">
                See All Properties<i className="fal fa-arrow-right-long"></i>
              </Link>

            </div>
          </div>
        </div>
        {/* End .row */}
      </div>
    </section>
  )
}
