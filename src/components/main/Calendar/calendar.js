import React from 'react';
import 'date-fns';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const CalendarButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  marginBottom: '12px',
  marginRight: '12px',
  background: theme.palette.accent.main,
}));

const ModalPaper = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: 450,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2, 4, 3),
}));

function CalendarModal() {
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [selectedDate, setSelectedDate] = React.useState(
    new Date('2005-08-21'),
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <CalendarButton variant="contained" onClick={handleOpen}>
        Calendar
      </CalendarButton>

      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <ModalPaper style={modalStyle}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container justifyContent="space-around">
              <DatePicker
                label="Date picker inline"
                value={selectedDate}
                onChange={handleDateChange}
                format="MM/dd/yyyy"
              />
            </Grid>
          </LocalizationProvider>
          <p>Events Listed Here</p>
        </ModalPaper>
      </Modal>
    </div>
  );
}

export default CalendarModal;
