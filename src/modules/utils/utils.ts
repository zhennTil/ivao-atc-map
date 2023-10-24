
export const formatDateTime = (date: Date) => Intl.DateTimeFormat(navigator.language, {month: 'short', day: 'numeric', timeZone: 'UTC'}).format(date)
    + `, ${date.getUTCHours().toString().padStart(2, '0')}${date.getUTCMinutes().toString().padStart(2, '0')}z`;

