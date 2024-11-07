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
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Header from "../../components/Header";
import './schedule.css';
import { useParams } from "react-router-dom";
import axios from "axios";
import MenuItem from '@mui/material/MenuItem'; // <-- Import MenuItem

dayjs.extend(utc);
dayjs.extend(timezone);

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
  const [weekPattern, setWeekPattern] = useState('even');

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

  const calculateScheduleDates = (startDate, weekPattern) => {
    const dates = [];
    let currentDate = dayjs(startDate);

    const daysOfWeek = weekPattern === 'even' ? [1, 3, 5] : [2, 4, 6];

    // create 12 days from the date created
    while (dates.length < 12) {
      if (daysOfWeek.includes(currentDate.day())) {
        dates.push(currentDate);
      }
      currentDate = currentDate.add(1, 'day');
    }

    return dates;
  };

  const createSchedule = async () => {
    const scheduleDTO = {
      title: currentEvent.title,
      description: currentEvent.desc,
      googleMeetLink: currentEvent.googleMeetLink,
      zaloLink: currentEvent.zaloLink,
      isOnline: true,
    };

    // get days - 12 days by looping through
    const scheduleDates = calculateScheduleDates(dayjs(), weekPattern);

    // create event schedule
    for (let i = 0; i < scheduleDates.length; i++) {
      const eventStart = scheduleDates[i].set('hour', currentEvent.start.hour()).set('minute', currentEvent.start.minute());
      const eventEnd = scheduleDates[i].set('hour', currentEvent.end.hour()).set('minute', currentEvent.end.minute());

      const schedule = {
        ...scheduleDTO,
        timeStart: eventStart.utc().toISOString(),
        timeEnd: eventEnd.utc().toISOString(),
      };

      try {
        const response = await axios.post(`https://localhost:7158/api/Schedule/create/${accountId}`, schedule);
        setEvents((prevEvents) => [...prevEvents, response.data]);
      } catch (error) {
        console.error('Error creating schedule:', error);
        alert('Failed to create schedule.');
      }
    }
    setOpenSlot(false);
  };

  const handleSelectSlot = (slotInfo) => {
    const selectedStartDate = dayjs(slotInfo.start);

    if (selectedStartDate.isBefore(dayjs(), 'minute')) {
      alert("Không thể tạo lịch học ở quá khứ");
      return;
    }
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
      <div className="schedule-container w-full max-w-full mx-auto mt-12">
        <h1 className="schedule-title">Lịch Học Của Học Viên</h1>
        <div className="calendar">
          <Calendar
            localizer={localizer}
            events={events.map(event => ({
              ...event,
              start: dayjs.utc(event.timeStart).toDate(),
              end: dayjs.utc(event.timeEnd).toDate(),
              isOnline: event.isOnline,
              title: (
                <div>
                  <div>{event.title}</div>
                  <span
                    style={{
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: event.isOnline ? 'green' : 'red'
                    }}
                  >
                    {event.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              ),
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
        <Dialog open={openSlot} onClose={() => setOpenSlot(false)} >
          <div className="dialog-content">
            <h2>Thêm Lịch Học Mới</h2>
            <TextField label="Tiêu đề" value={currentEvent.title} onChange={handleTitleChange} fullWidth margin="normal" />
            <TextField label="Mô tả" value={currentEvent.desc} onChange={handleDescChange} fullWidth margin="normal" />
            <TextField label="Link Google Meet" value={currentEvent.googleMeetLink} onChange={handleGoogleMeetChange} fullWidth margin="normal" />
            <TextField label="Link Zalo" value={currentEvent.zaloLink} onChange={handleZaloChange} fullWidth margin="normal" />
            <TextField
              label="Chọn kiểu lịch học"
              select
              value={weekPattern}
              onChange={(e) => setWeekPattern(e.target.value)}
              fullWidth
              margin="normal"
            >
              <MenuItem value="even">Lịch học thứ 2, 4, 6</MenuItem>
              <MenuItem value="odd">Lịch học thứ 3, 5, 7</MenuItem>
            </TextField>
            <div className="time-picker">
              <TimePicker value={currentEvent.start} onChange={handleStartTimeChange} label="Thời gian bắt đầu" />
              <TimePicker value={currentEvent.end} onChange={handleEndTimeChange} label="Thời gian kết thúc" />
            </div>
            <div className="dialog-actions">
              <Button onClick={createSchedule} color="primary">Lưu</Button>
              <Button onClick={() => setOpenSlot(false)} color="secondary">Hủy</Button>
            </div>
          </div>
        </Dialog>

        {/* Dialog để chỉnh sửa lịch học */}
        <Dialog open={openEvent} onClose={() => setOpenEvent(false)}>
          <div className="dialog-content">
            <h2>Chỉnh Sửa Lịch Học</h2>
            <TextField label="Tiêu đề" value={currentEvent.title} onChange={handleTitleChange} fullWidth margin="normal" />
            <TextField label="Mô tả" value={currentEvent.description} onChange={handleDescChange} fullWidth margin="normal" />
            <TextField label="Link Google Meet" value={currentEvent.googleMeetLink} onChange={handleGoogleMeetChange} fullWidth margin="normal" />
            <TextField label="Link Zalo" value={currentEvent.zaloLink} onChange={handleZaloChange} fullWidth margin="normal" />
            <div className="time-picker">
              <TimePicker value={currentEvent.start} onChange={handleStartTimeChange} label="Thời gian bắt đầu" />
              <TimePicker value={currentEvent.end} onChange={handleEndTimeChange} label="Thời gian kết thúc" />
            </div>
            <div className="dialog-actions">
              <Button onClick={handleUpdateEvent} color="primary">Lưu</Button>
              <Button onClick={handleDeleteEvent} color="secondary">Xóa</Button>
              <Button onClick={() => setOpenEvent(false)} color="default">Hủy</Button>
            </div>
          </div>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
};

export default ScheduleManagement;
