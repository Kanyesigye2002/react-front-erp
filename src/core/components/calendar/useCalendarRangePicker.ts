import { useState } from 'react';
import { isSameDay, isSameMonth, getYear, isBefore } from 'date-fns';
import { FORMAT_DATE_FRONT } from '../../../config-global';
// utils
import { fDate } from '../../../utils/formatTime';
//
import { CalendarRangePickerProps } from './types';

// ----------------------------------------------------------------------

type ReturnType = CalendarRangePickerProps;

export default function useCalendarRangePicker(start: Date | null, end: Date | null): ReturnType {


  const [endDate, setEndDate] = useState(end);
  const [startDate, setStartDate] = useState(start);

  const isError =
    (startDate && endDate && isBefore(new Date(endDate), new Date(startDate))) || false;

  const currentYear = new Date().getFullYear();

  const startDateYear = startDate ? getYear(startDate) : null;

  const endDateYear = endDate ? getYear(endDate) : null;

  const isCurrentYear = currentYear === startDateYear && currentYear === endDateYear;

  const isSameDays =
    startDate && endDate ? isSameDay(new Date(startDate), new Date(endDate)) : false;

  const isSameMonths =
    startDate && endDate ? isSameMonth(new Date(startDate), new Date(endDate)) : false;

  const standardLabel = `${fDate(startDate)} - ${fDate(endDate)}`;

  const getLabel = () => `${fDate(startDate, FORMAT_DATE_FRONT)} - ${fDate(endDate, FORMAT_DATE_FRONT)}`;

  const onChangeStartDate = (newValue: Date | null) => {
    setStartDate(newValue);
  };

  const onChangeEndDate = (newValue: Date | null) => {
    if (isError) {
      setEndDate(null);
    }
    setEndDate(newValue);
  };

  const onReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return {
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    //
    onReset,
    //
    isSelected: !!startDate && !!endDate,
    isError,
    //
    label: getLabel() || '',
    //
    setStartDate,
    setEndDate
  };
}
