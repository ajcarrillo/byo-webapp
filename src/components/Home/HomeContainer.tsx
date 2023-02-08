import React from 'react'

import HeaderVideo01 from '../../assets/video/ByoWave.mp4'
import './Home.css'

const HomeContainer: React.FC = () => {

  return (
    <div className={'App-container'}>
      <div className='Home-container-top'>
        <section>
          <video src={HeaderVideo01} muted loop autoPlay></video>
        </section>
      </div>
    </div>
  )
}

export default HomeContainer