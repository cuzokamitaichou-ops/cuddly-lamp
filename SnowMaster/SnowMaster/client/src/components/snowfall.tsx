import { useEffect } from "react";

export default function Snowfall() {
  useEffect(() => {
    const createSnowflake = () => {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.innerHTML = '❄';
      snowflake.style.left = Math.random() * 100 + 'vw';
      snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
      snowflake.style.opacity = Math.random().toString();
      snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
      
      const container = document.getElementById('snowfall-container');
      if (container) {
        container.appendChild(snowflake);
        
        setTimeout(() => {
          if (snowflake.parentNode) {
            snowflake.remove();
          }
        }, 5000);
      }
    };

    const interval = setInterval(createSnowflake, 300);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div id="snowfall-container" className="fixed inset-0 pointer-events-none z-0" />;
}
