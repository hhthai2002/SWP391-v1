import React, { useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import Header from "../../components/Header";
import './schedule.css';
import { useParams } from "react-router-dom";
import axios from "axios";

moment.locale('en');
const localizer = momentLocalizer(moment);

const ScheduleManagement = () => {
  const { accountId } = useParams();
  const [events, setEvents] = useState([]);
  const [openSlot, setOpenSlot] = useState(false);
  const [openEvent, setOpenEvent] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({
    title: '',
    start: dayjs(),
    end: dayjs(),
    desc: '',
    googleMeetLink: '',
    zaloLink: '',
  });

  React.useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(`https://localhost:7158/api/Schedule/${accountId}`);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };
    fetchSchedules();
  }, [accountId]);

  const createSchedule = async () => {
    const scheduleDTO = {
      title: currentEvent.title,
      description: currentEvent.desc,
      googleMeetLink: currentEvent.googleMeetLink,
      zaloLink: currentEvent.zaloLink,
      timeStart: currentEvent.start.toISOString(),
      timeEnd: currentEvent.end.toISOString(),
    };

    try {
      const response = await axios.post(`https://localhost:7158/api/Schedule/create/${accountId}`, scheduleDTO);
      setEvents((prevEvents) => [...prevEvents, response.data]);
      setOpenSlot(false);
    } catch (error) {
      console.error('Error creating schedule:', error);
      alert('Failed to create schedule.');
    }
  };

  const handleSelectSlot = (slotInfo) => {
    setCurrentEvent({
      title: '',
      start: dayjs(slotInfo.start).startOf('day'),
      end: dayjs(slotInfo.start).startOf('day').add(1, 'hour'),
      desc: '',
      googleMeetLink: '',
      zaloLink: '', 
    });
    setOpenSlot(true);
  };
  

  const handleEventSelected = (event) => {
    setCurrentEvent({
      ...event,
      start: dayjs(event.start),
      end: dayjs(event.end),
    });
    setOpenEvent(true);
  };

  const handleTitleChange = (e) => setCurrentEvent({ ...currentEvent, title: e.target.value });
  const handleDescChange = (e) => setCurrentEvent({ ...currentEvent, desc: e.target.value });
  const handleGoogleMeetChange = (e) => setCurrentEvent({ ...currentEvent, googleMeetLink: e.target.value });
  const handleZaloChange = (e) => setCurrentEvent({ ...currentEvent, zaloLink: e.target.value });

  const handleStartTimeChange = (date) => setCurrentEvent({ ...currentEvent, start: date });
  const handleEndTimeChange = (date) => setCurrentEvent({ ...currentEvent, end: date });

  const handleUpdateEvent = async () => {
    try {
      const response = await axios.put(`https://localhost:7158/api/Schedule/update/${currentEvent.id}`, {
        title: currentEvent.title,
        description: currentEvent.desc,
        googleMeetLink: currentEvent.googleMeetLink,
        zaloLink: currentEvent.zaloLink,
        timeStart: currentEvent.start.toISOString(),
        timeEnd: currentEvent.end.toISOString(),
      });
      const updatedEvents = events.map((event) =>
        event.id === currentEvent.id ? response.data : event
      );
      setEvents(updatedEvents);
      setOpenEvent(false);
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update schedule.');
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`https://localhost:7158/api/Schedule/delete/${currentEvent.id}`);
      setEvents(events.filter((event) => event.id !== currentEvent.id));
      setOpenEvent(false);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete schedule.');
    }
  };

  const handleOpenGoogleMeet = () => {
    if (currentEvent.googleMeetLink) {
      window.open(currentEvent.googleMeetLink, '_blank');
    } else {
      alert('Please Add Link Google Meet.');
    }
  };

  const handleOpenZalo = () => {
    if (currentEvent.zaloLink) {
      window.open(currentEvent.zaloLink, '_blank');
    } else {
      alert('Please Add Link Zalo.');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Header />
      <div className="schedule-container">
        <h1 className="schedule-title">Lịch Học Của Học Viên</h1>
        <div className="calendar">
          <Calendar
            localizer={localizer}
            events={events.map(event => ({
              ...event,
              start: dayjs(event.timeStart).toDate(),
              end: dayjs(event.timeEnd).toDate(),
            }))}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleEventSelected}
            views={{ month: true, week: true, day: true }}
            defaultView={Views.WEEK}
            step={30}
            timeslots={2}
            style={{ height: 600 }}
          />
        </div>

        {/* Dialog để thêm lịch mới */}
        <Dialog open={openSlot} onClose={() => setOpenSlot(false)}>
          <div className="dialog-content">
            <h2>Thêm Lịch Học Mới</h2>
            <TextField label="Tiêu đề" value={currentEvent.title} onChange={handleTitleChange} fullWidth margin="normal" />
            <TextField label="Mô tả" value={currentEvent.desc} onChange={handleDescChange} fullWidth margin="normal" />
            <TextField label="Link Google Meet" value={currentEvent.googleMeetLink} onChange={handleGoogleMeetChange} fullWidth margin="normal" />
            <TextField label="Link Zalo" value={currentEvent.zaloLink} onChange={handleZaloChange} fullWidth margin="normal" />
            <TimePicker label="Giờ bắt đầu" value={currentEvent.start} onChange={handleStartTimeChange} renderInput={(params) => <TextField {...params} fullWidth margin="normal" />} />
            <TimePicker label="Giờ kết thúc" value={currentEvent.end} onChange={handleEndTimeChange} renderInput={(params) => <TextField {...params} fullWidth margin="normal" />} />
            <Button variant="contained" color="primary" onClick={createSchedule}>Tạo Lịch</Button>
          </div>
        </Dialog>


        {/* Dialog để xem/chỉnh sửa lịch */}
        <Dialog open={openEvent} onClose={() => setOpenEvent(false)}>
          <div className="dialog-content">
            <h2>Chi Tiết Lịch Học</h2>
            <TextField label="Tiêu đề" value={currentEvent.title} onChange={handleTitleChange} fullWidth margin="normal" />
            <TextField label="Mô tả" value={currentEvent.desc} onChange={handleDescChange} fullWidth margin="normal" />
            <TextField label="Link Google Meet" value={currentEvent.googleMeetLink} onChange={handleGoogleMeetChange} fullWidth margin="normal" />
            <TextField label="Link Zalo" value={currentEvent.zaloLink} onChange={handleZaloChange} fullWidth margin="normal" />
            <TimePicker label="Giờ bắt đầu" value={currentEvent.start} onChange={handleStartTimeChange} renderInput={(params) => <TextField {...params} fullWidth margin="normal" />} />
            <TimePicker label="Giờ kết thúc" value={currentEvent.end} onChange={handleEndTimeChange} renderInput={(params) => <TextField {...params} fullWidth margin="normal" />} />
            <Button variant="contained" color="primary" onClick={handleUpdateEvent}>Cập Nhật</Button>
            <Button variant="outlined" color="secondary" onClick={handleDeleteEvent}>Xóa Lịch</Button>
            <Button variant="contained" color="default" onClick={handleOpenGoogleMeet}>Mở Google Meet</Button>
            <Button variant="contained" color="default" onClick={handleOpenZalo}>Mở Zalo</Button>
          </div>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
};

export default ScheduleManagement;
