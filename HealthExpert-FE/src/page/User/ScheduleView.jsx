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
import axios from "axios";

dayjs.extend(utc);
dayjs.extend(timezone);

moment.locale('en');
const localizer = momentLocalizer(moment);

const ScheduleView = () => {
    const userName = localStorage.getItem('user');
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
        isOnline: true, // Add isOnline property
    });

    React.useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const accIdRes = await axios.get(`https://localhost:7158/api/Account/GetAccountIdByUserName/${userName}`);
                const accountId = accIdRes.data;
                const response = await axios.get(`https://localhost:7158/api/Schedule/${accountId}`);
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching schedules:', error);
            }
        };
        fetchSchedules();
    }, [userName]);

    const handleSelectSlot = (slotInfo) => {
        setCurrentEvent({
            title: '',
            start: dayjs(slotInfo.start).startOf('day'),
            end: dayjs(slotInfo.start).startOf('day').add(1, 'hour'),
            desc: '',
            googleMeetLink: '',
            zaloLink: '',
            isOnline: true, // Default to online
        });
        setOpenSlot(true);
    };

    const handleEventSelected = (event) => {
        setCurrentEvent({
            ...event,
            start: dayjs.utc(event.start),
            end: dayjs.utc(event.end),
        });
        setOpenEvent(true);
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

    const handleUpdateOnlineStatus = async (status) => {
        try {
            const response = await axios.put(
                `https://localhost:7158/api/Schedule/updateOnlineStatus/${currentEvent.id}`,
                JSON.stringify(status),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            setCurrentEvent(prevState => ({
                ...prevState,
                isOnline: status,
            }));
            alert('Trạng thái cập nhật thành công');
        } catch (error) {
            console.error('Error updating online status:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái.');
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

                {/* Dialog để xem/chỉnh sửa lịch */}
                <Dialog open={openEvent} onClose={() => setOpenEvent(false)}>
                    <div className="dialog-content">
                        <h2>Chi Tiết Lịch Học</h2>
                        <TextField label="Tiêu đề" value={currentEvent.title} fullWidth margin="normal" />
                        <TextField label="Mô tả" value={currentEvent.desc} fullWidth margin="normal" />
                        <TextField label="Link Google Meet" value={currentEvent.googleMeetLink} fullWidth margin="normal" />
                        <TextField label="Link Zalo" value={currentEvent.zaloLink} fullWidth margin="normal" />
                        <TimePicker label="Giờ bắt đầu" value={currentEvent.start} renderInput={(params) => <TextField {...params} fullWidth margin="normal" />} />
                        <TimePicker label="Giờ kết thúc" value={currentEvent.end} renderInput={(params) => <TextField {...params} fullWidth margin="normal" />} />
                        <Button variant="contained" color="default" onClick={handleOpenGoogleMeet}>Mở Google Meet</Button>
                        <Button variant="contained" color="default" onClick={handleOpenZalo}>Mở Zalo</Button>

                        {/* Toggle Online Status */}
                        <Button variant="contained" color="default" onClick={() => handleUpdateOnlineStatus(true)}>
                            Đặt Trạng Thái Online
                        </Button>
                        <Button variant="contained" color="default" onClick={() => handleUpdateOnlineStatus(false)}>
                            Đặt Trạng Thái Offline
                        </Button>
                    </div>
                </Dialog>
            </div>
        </LocalizationProvider>
    );
};

export default ScheduleView;
