import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import './UpgradeModal.css'

interface UpgradeModalProps {
  isOpen: boolean;
  title: string;
  buttonText: string;
  contentText: React.ReactNode;
  image?: string;
  description?: React.ReactNode,
  onClose: () => void;
  handleButtonAction: () => void;
}

const LearMorePaper = () => {
  return (
    <>
      <Typography color="black" variant="h6">What is a firmware upgrade?</Typography>
      <Typography variant='body1'>
        Firmware is the software on your controller. Every once in a while, you will need to update your controller so that it has the most up to date firmware.
      </Typography>
      <Typography color="black" variant="h6">Why do I have to update my controller?</Typography>
      <Typography variant='body1'>
        Updating your controller will make sure your controller works with the latest version of the app, and so you can use any new features that have been released.
      </Typography>
      <Typography color="black" variant="h6">What are the latest changes?</Typography>
      <Typography variant='body1'>
        Visit byowave.com/updates to see what the latest changes are.
      </Typography>
      <Typography color="black" variant="h6">Want more info?</Typography>
      <Typography variant='body1'>
        Visit our FAQ to find even more information at byowave.com/faq
      </Typography>
    </>
  )
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 467,
    fontSize: theme.typography.pxToRem(12),
    border: '2px solid #2D3648',
    padding: 24
  },
}))

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  title,
  buttonText,
  contentText,
  image,
  description,
  onClose,
  handleButtonAction
}) => {
  const [showLearMore, setShowLearMore] = useState(false)

  const handleOnLeanMore = () => {
    setShowLearMore(!showLearMore)
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth='xs'
    >
      <div style={{
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#F6F6F6',
      }}>
        <div className='circle-container'>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
        <div style={{
          backgroundColor: '#EDEDED',
          borderRadius: '10px',
        }}>
          <DialogTitle sx={{
            color: '#000',
            paddingTop: '43px'
          }} id="alert-dialog-title"
          >
            {title}
            {
              title === 'Firmware Upgrade Needed' ?
                <HtmlTooltip placement="bottom" title={<LearMorePaper />}>
                  <IconButton size="small" style={{ marginLeft: '10px' }}>
                    <HelpOutlineIcon />
                  </IconButton>
                </HtmlTooltip> : null
            }
          </DialogTitle>
          <DialogContent color='red'>
            {contentText}
          </DialogContent>
          <DialogActions sx={{
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: '25px',
          }}>
            <Button size='large' sx={{ textTransform: 'none' }} variant='contained' onClick={handleButtonAction} color="neutral-1150" autoFocus>
              {buttonText}
            </Button>
            {image ? <img src={image} alt="Goobender" /> : null}
          </DialogActions>
          {description ?
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {description}
              </DialogContentText>
            </DialogContent> : null}
        </div>
      </div>

    </Dialog>
  )
}