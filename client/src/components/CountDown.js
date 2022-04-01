/* eslint-disable */
import React from 'react';

export default function CountDown({flag, setFlag, color}) {
  const [start, setStart] = React.useState(Number(new Date()));
  const [current, setCurrent] = React.useState(Number(new Date()));
  const [ timer, setTimer ] = React.useState(null);

  React.useEffect(() => {
    if(flag === true){
      let time = Math.ceil((current - start)/1000);

      time < 60 && setTimer(setTimeout(() => {
        setCurrent(Number(new Date()));
      }, 1000));
      if(time >= 60) {
        setFlag(false);
      }
    } else {
      setStart(Number(new Date()));
      localStorage.setItem('start', Number(new Date()))
    }
  }, [current, flag]);

  React.useEffect(() => {
    let starttime = Number(localStorage.getItem('start'));
    let time = Math.ceil((current - starttime)/1000);

    if(time < 60) {
      setStart(starttime)
      setFlag(true);
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    }
  }, [ timer ]);

  return (
    <p style={{margin: 0, color: color ? color : 'auto'}}>{60 - Math.ceil((current - start)/1000)}</p>
  )
}
