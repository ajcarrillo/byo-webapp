import { Button } from '@mui/material'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search'


type Size = 'small' | 'medium' | 'large'

export const Buttons: React.FC = () => {
  const sizes = ['small', 'medium', 'large']
  return (
    <>
      <h1>Buttons</h1>
      <div className='tw-flex tw-items-center tw-flex-wrap tw-gap-4 tw-mb-4'>
        {
          sizes.map((size, i) => (
            <Button
              startIcon={<SearchIcon />}
              key={i}
              color='primary'
              variant='contained'
              size={size as Size}
            >
              Save
            </Button>
          ))
        }
      </div>
      <div className='tw-flex tw-items-center tw-flex-wrap tw-gap-4 tw-mb-4'>
        {
          sizes.map((size, i) => (
            <Button
              endIcon={<SearchIcon />}
              key={i}
              color='secondary'
              variant='contained'
              size={size as Size}
            >
              Save
            </Button>
          ))
        }
      </div>
      <div className='tw-flex tw-items-center tw-flex-wrap tw-gap-4 tw-mb-4'>
        {
          sizes.map((size, i) => (
            <Button
              key={i}
              color='secondary-2'
              variant='contained'
              size={size as Size}
            >
              Save
            </Button>
          ))
        }
      </div>
      <div className='tw-flex tw-items-center tw-flex-wrap tw-gap-4 tw-mb-4'>
        {
          sizes.map((size, i) => (
            <Button
              key={i}
              color='highlight'
              variant='contained'
              size={size as Size}
            >
              Save
            </Button>
          ))
        }
      </div>
      <div className='tw-flex tw-items-center tw-flex-wrap tw-gap-4 tw-mb-4'>
        {
          sizes.map((size, i) => (
            <Button
              key={i}
              color='highlight-2'
              variant='contained'
              size={size as Size}
            >
              Save
            </Button>
          ))
        }
      </div>
      <div className='tw-flex tw-items-center tw-flex-wrap tw-gap-4 tw-mb-4'>
        {
          sizes.map((size, i) => (
            <Button
              key={i}
              sx={{ background: theme => theme.palette['gradient-1-horizontal'].main }}
              variant='contained'
              size={size as Size}
            >
              Save
            </Button>
          ))
        }
      </div>
      <div className='tw-flex tw-items-center tw-flex-wrap tw-gap-4 tw-mb-4'>
        {
          sizes.map((size, i) => (
            <Button
              startIcon={<SearchIcon />}
              key={i}
              sx={{ background: theme => theme.palette['gradient-2-horizontal'].main }}
              variant='contained'
              size={size as Size}
            >
              Save
            </Button>
          ))
        }
      </div>
      <div className='tw-flex tw-items-center tw-flex-wrap tw-gap-4 tw-mb-4'>
        {
          sizes.map((size, i) => (
            <Button
              endIcon={<SearchIcon />}
              key={i}
              sx={{ background: theme => theme.palette['gradient-3-horizontal'].main }}
              variant='contained'
              size={size as Size}
            >
              Save
            </Button>
          ))
        }
      </div>
    </>
  )
}