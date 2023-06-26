import React from 'react'
import { Helmet } from 'react-helmet-async'

import HeaderVideo01 from '../../assets/video/ByoWave.mp4'
import './Home.css'

const HomeContainer: React.FC = () => {

  return (
    <>
      <Helmet>
        <title>ByoWave Home</title>
        <meta
          name="description"
          content="Developing tools to ensure everyone has bespoke access to gaming and the digital world."
        />
        <meta
          name="keywords"
          content="some, homepage, keywords"
        />
        <link rel="canonical" href="/" />
      </Helmet>

      <div className={'App-container'}>
        <div className='Home-container-top'>
          <section>
            <video src={HeaderVideo01} muted loop autoPlay></video>
          </section>
        </div>
      </div>    
    </>
  )
}

export default HomeContainer