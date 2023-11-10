import { Button, Card, CardContent } from '@mui/material'
import React, { Fragment, useState } from 'react'
import { UpgradeModal } from '../ProteusApp/Firmware'
import GoobenderFixing from '../../assets/images/goobender-fixing.png'
import GoobenderLifting from '../../assets/images/goobender-lifting.png'
import GoobenderSpinner from '../../assets/images/spinner-small.gif'

const FirmwareUpdateButtton: React.FC = () => {
  const [openModalId, setOpenModalId] = useState<string | null>(null)

  const modalScenarios = [
    {
      id: '1',
      isOpen: false,
      title: 'Firmware Upgrade Needed',
      buttonText: 'Ok',
      contentText: <><p>Looks like your device needs to be upgraded.</p><p>Unfortunately, your controller won’t work with the app unless you upgrade it. But don’t worry, it will just take a couple of minutes!</p></>,
      image: GoobenderFixing,
      description: ''
    },
    {
      id: '2',
      isOpen: false,
      title: 'Upload in progress',
      buttonText: 'Uploading...',
      contentText: <p>Please do not add or remove any modules  or power off your device while firmware is uploading.</p>,
      image: GoobenderSpinner,
      description: ''
    },
    {
      id: '3',
      isOpen: false,
      title: 'Success!',
      buttonText: 'Return to app',
      contentText: <p>Your update was successful! Now you can get back to makin’ some cool configurations.</p>,
      image: GoobenderLifting,
      description: <p>P.S firmware updates are done on charging modules, so if you have a charging module from another kit, you may have to update that part too</p>
    },
    {
      id: '4',
      isOpen: false,
      title: 'Oops, that didn’t work',
      buttonText: 'Try Again',
      contentText: <><p>Something went wrong, let’s try again</p></>,
      image: 'https://placehold.co/309x199?text=Goobender%20Image%20Here',
      description: <p>Keep having issues? Look here for trouble shooting options</p>
    },
  ]

  const handleOpenModal = (id: string) => {
    setOpenModalId(id)
  }

  const handleCloseModal = () => {
    setOpenModalId(null)
  }

  return (
    <Card variant='outlined'>
      <CardContent className='tw-flex tw-gap-4'>
        {
          modalScenarios.map((scenario) => (
            <Fragment key={scenario.id}>
              <Button variant='contained' color='primary' onClick={() => handleOpenModal(scenario.id)}>
                {scenario.title}
              </Button>
              <UpgradeModal
                isOpen={openModalId === scenario.id}
                title={scenario.title}
                buttonText={scenario.buttonText}
                contentText={scenario.contentText}
                image={scenario.image}
                description={scenario.description}
                onClose={handleCloseModal}
                handleButtonAction={handleCloseModal}
              />
            </Fragment>
          ))
        }
      </CardContent>
    </Card >
  )
}

export default FirmwareUpdateButtton