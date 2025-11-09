"use client";

import { useState, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

import FullCalendar, {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventDropArg,
  EventContentArg,
} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

interface CustomEvent extends EventInput {
  priority?: "low" | "medium" | "high";
}

export default function CalendarPage() {
  const calendarRef = useRef<FullCalendar>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventPriority, setEventPriority] = useState<"low" | "medium" | "high">("medium");
  const [events, setEvents] = useState<CustomEvent[]>([
    { id: "1", title: "Team Meeting", start: new Date().toISOString().split("T")[0], allDay: true, priority: "high" },
  ]);
  const [currentView, setCurrentView] = useState<"dayGridMonth" | "timeGridWeek" | "timeGridDay">("dayGridMonth");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const eventBackgroundColor = (priority: string | undefined) => {
    switch (priority) {
      case "high":
        return "#ef4444"; // red
      case "medium":
        return "#38bdf8"; // sky blue
      case "low":
        return "#60a5fa"; // lighter blue
      default:
        return "#38bdf8";
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setEventStart(selectInfo.startStr);
    setIsAddEventOpen(true);
    setSelectedDate(selectInfo.startStr);
    calendarRef.current?.getApi().unselect();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (window.confirm(`Delete event '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove();
      setEvents(events.filter(ev => ev.id !== clickInfo.event.id));
    }
  };

  const handleEventDrop = (dropInfo: EventDropArg) => {
    console.log("Event moved to", dropInfo.event.startStr);
  };

  const saveNewEvent = () => {
    if (eventTitle && eventStart) {
      const newEv: CustomEvent = {
        id: String(events.length + 1),
        title: eventTitle,
        start: eventStart,
        priority: eventPriority,
        allDay: true,
      };
      setEvents([...events, newEv]);
      setEventTitle("");
      setEventStart("");
      setEventPriority("medium");
      setIsAddEventOpen(false);
    }
  };

  const changeView = (view: "dayGridMonth" | "timeGridWeek" | "timeGridDay") => {
    setCurrentView(view);
    calendarRef.current?.getApi().changeView(view);
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    const priorityColor = eventBackgroundColor(eventInfo.event.extendedProps.priority);
    const title = eventInfo.event.title;
    const timeText = eventInfo.timeText;

    if (eventInfo.el) {
      tippy(eventInfo.el, {
        content: `<strong>${title}</strong><br/>${timeText}<br/><span style="color:${priorityColor}">● ${eventInfo.event.extendedProps.priority?.toUpperCase()}</span>`,
        allowHTML: true,
        theme: "light-border",
        animation: "scale",
        delay: [100, 0],
      });
    }

    return (
      <div className="flex justify-between items-center px-1">
        <span className="font-medium text-xs text-gray-900">{timeText}</span>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: priorityColor }}
        >
          {eventInfo.event.extendedProps.priority?.toUpperCase()}
        </span>
      </div>
    );
  };

  const dayCellClassNames = (dateStr: string) => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (dateStr === todayStr) return "bg-sky-300 text-gray-900 font-semibold rounded-full";
    if (dateStr === selectedDate) return "bg-sky-400 text-white font-semibold rounded-full";
    return "text-gray-900"; // dark font for all weekdays
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header & Add Button */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">📅 Calendar</h1>
              <button
                onClick={() => setIsAddEventOpen(true)}
                className="flex items-center gap-2 bg-sky-500 text-white px-4 py-1.5 rounded-2xl shadow hover:bg-sky-600 transition font-medium"
              >
                <PlusIcon className="h-4 w-4" /> Add
              </button>
            </div>

            {/* View Tabs */}
            <div className="flex gap-2 mb-3">
              {[
                { label: "Month", view: "dayGridMonth" },
                { label: "Week", view: "timeGridWeek" },
                { label: "Day", view: "timeGridDay" },
              ].map(tab => (
                <button
                  key={tab.view}
                  onClick={() => changeView(tab.view as any)}
                  className={`px-3 py-1 rounded-lg font-medium text-sm transition ${
                    currentView === tab.view
                      ? "bg-sky-500 text-white shadow"
                      : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Calendar Panel */}
            <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                initialView="dayGridMonth"
                headerToolbar={false} // Remove arrows and today
                selectable={true}
                editable={true}
                select={handleDateSelect}
                events={events.map(ev => ({
                  ...ev,
                  backgroundColor: eventBackgroundColor(ev.priority),
                  borderColor: "transparent",
                  textColor: "#111",
                  display: "block",
                }))}
                eventClick={handleEventClick}
                eventDrop={handleEventDrop}
                dayMaxEvents={true}
                height="auto"
                contentHeight="auto"
                eventContent={renderEventContent}
                dayCellClassNames={(arg: any) => dayCellClassNames(arg.dateStr)}
                dayHeaderClassNames={() => "text-gray-900 font-semibold"} // Dark weekdays
                titleFormat={{ year: 'numeric', month: 'long' }} // Month name
                viewDidMount={(arg: any) => {
                  const headerEl = document.querySelector('.fc-toolbar-title') as HTMLElement;
                  if (headerEl) {
                    headerEl.classList.add('text-black', 'text-3xl', 'font-bold', 'mb-4');
                  }
                }}
              />
            </div>
          </div>
        </main>

        {/* Add Event Modal */}
        {isAddEventOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg border border-gray-200 relative">
              <button
                onClick={() => setIsAddEventOpen(false)}
                className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition"
              >
                <XMarkIcon className="h-4 w-4 text-gray-700" />
              </button>
              <h2 className="text-lg font-bold text-gray-900 mb-3">New Event</h2>
              <input
                type="text"
                placeholder="Title"
                value={eventTitle}
                onChange={e => setEventTitle(e.target.value)}
                className="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 bg-gray-50 text-gray-900 placeholder-gray-500 transition"
              />
              <input
                type="datetime-local"
                value={eventStart}
                onChange={e => setEventStart(e.target.value)}
                className="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 bg-gray-50 text-gray-900 transition"
              />
              <select
                value={eventPriority}
                onChange={e => setEventPriority(e.target.value as "low" | "medium" | "high")}
                className="w-full mb-3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 bg-gray-50 text-gray-900 transition"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button
                onClick={saveNewEvent}
                className="w-full py-2 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
