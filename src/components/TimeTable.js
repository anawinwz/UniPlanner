import React from 'react';
import Timetable from 'react-timetable-events';
import moment from 'moment';

export default ({ filteredCourses }) => {

  const renderEvent = (event, defaultAttributes, styles) => {
    defaultAttributes.style.background = new (require('color-hash'))({lightness: 0.5}).hex(event.name);
    return (
      <div {...defaultAttributes}
           title={event.name}
           key={event.id}>
        <span className={styles.event_info} style={{fontSize: '1.2em'}}>{ event.name }</span>
        <span className={styles.event_info}>
          { event.startTime.format('HH:mm') } - { event.endTime.format('HH:mm') }
        </span>
      </div>
    )
  };
  const getDayLabel = (day) => {
    switch (day) {
      case 'M': return 'จ.'
      case 'T': return 'อ.'
      case 'W': return 'พ.'
      case 'Th': return 'พฤ.'
      case 'F': return 'ศ.'
      case 'Sa': return 'ส.'
      case 'Su': return 'อา.'
      default: return day
    }
  };
  let events, maxHour;
  const generateEvents = () => {
    maxHour = 17;
    events = {M: [], T: [], W: [], Th: [], F: [], Sa: [], Su: []};
    filteredCourses.map(course => { course.sections[0].lects.map(lect => {
      const endTime = moment(lect.end, 'H:mm');
      if (endTime.hour() > maxHour) maxHour = endTime.hour() + 1;

      lect.dow.map(dow => {
        if (typeof events[dow] === 'undefined') events[dow] = [];
        events[dow].push({
          id: `${course.key}_${course.sections[0].key}`,
          name: `${course.code || ''} ${course.name} หมู่ ${course.sections[0].name}`,
          type: 'custom',
          startTime: moment(lect.start, 'H:mm'),
          endTime: endTime
        });
      });
    })});
    
    if (events.Su.length === 0) {
      delete events.Su;
      if (events.Sa.length === 0) delete events.Sa;
    }
  };

  generateEvents();

  return (<Timetable
    hoursInterval={[8, maxHour]}
    timeLabel="เวลา"
    events={events}
    renderEvent={renderEvent}
    getDayLabel={getDayLabel}
  />)
};