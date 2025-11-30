import { format, parseISO } from 'date-fns';

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return 'N/A';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatTime = (date) => {
  if (!date) return 'N/A';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'hh:mm a');
  } catch (error) {
    return 'Invalid Time';
  }
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM dd, yyyy hh:mm a');
  } catch (error) {
    return 'Invalid Date';
  }
};

