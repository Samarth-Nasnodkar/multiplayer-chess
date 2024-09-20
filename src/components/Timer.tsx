import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import '../styles/Timer.css';

interface TimerProps {
  minutes: number,
  seconds: number,
  running: boolean,
};

interface TimerHandle {
  toggleTimer: () => void,
}

// complete the type of ref
const Timer = forwardRef<TimerHandle, TimerProps>((props: TimerProps, ref) => {
  const [minutes, setMinutes] = React.useState(props.minutes);
  const [seconds, setSeconds] = React.useState(props.seconds);
  const [isPaused, setIsPaused] = React.useState(!props.running);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setSeconds(prevSeconds => {
          if (prevSeconds === 0) {
            if (minutes === 0) {
              clearInterval(interval);
              return 0;
            } else {
              setMinutes(prevMinutes => prevMinutes - 1);
              return 59;
            }
          } else {
            return prevSeconds - 1;
          }
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, minutes]);

  const pauseTimer = () => setIsPaused(true);
  const resumeTimer = () => setIsPaused(false);

  const toggleTimer = () => {
    console.log('toggleTimer');
    if (isPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
  };

  useImperativeHandle(ref, () => ({
    toggleTimer,
  }));

  return (
    <div className='timer'>
      <div className="timer-body">
        <div className="time-mins">
          <span className='timer-big'>
            {minutes < 10 ? '0' + minutes : minutes}
            <span className='timer-small'>
              m
            </span>
          </span>
        </div>
        <div className="time-seconds">
          <span className='timer-big'>
            {seconds < 10 ? '0' + seconds : seconds}
            <span className='timer-small'>
              s
            </span>
          </span>
        </div>
      </div>
    </div>
  );
});

export default Timer;