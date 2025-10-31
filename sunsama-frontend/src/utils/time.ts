import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export function formatTime(TimeInS : number) : string{
    const totalDuration = dayjs.duration(TimeInS, 'seconds')
    const formatedTime = totalDuration.format('mm:ss')

    return formatedTime;
}