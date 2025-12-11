import { Box, Snackbar } from '@mui/material'
import React from 'react'

function StatusSnackbar({message, state, status}) {
  return (
    <>
    <Box>
        <Snackbar
          anchorOrigin={{
            vertical: state.vertical,
            horizontal: state.horizontal,
          }}
          open={state.open}
          key={state.vertical + state.horizontal}
          autoHideDuration={5000}
          message={
            <div>
              {message}!{" "}
              <i className= {`${status ? 'fa fa-check-circle' : 'fa fa-times-circle'}`}></i>
            </div>
          }
          sx={{
            "& .MuiSnackbarContent-root": {
              backgroundColor: `${status ?  "#0f8363" : "#FB2C36"}`,
              color: "white",
              fontWeight: "bold",
            },
          }}
        />
      </Box>
    </>
  )
}

export default StatusSnackbar