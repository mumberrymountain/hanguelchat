import React from 'react'

const ChatIcon = ({ iconThemeColor }: { iconThemeColor: string }) => {
  return (
    <>
        <svg viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
            style={{stroke: iconThemeColor, fill: "none", width: "14px", height: "14px"}}>
            <g id="SVGRepo_bgCarrier" style={{strokeWidth: 0}}/>
            <g id="SVGRepo_tracerCarrier" style={{strokeLinecap: "round", strokeLinejoin: "round"}}/>
            <g id="SVGRepo_iconCarrier"> 
            <path d="M7 18L7 15" style={{stroke: iconThemeColor, strokeWidth: "1.5", strokeLinecap: "round"}}/>
            <path d="M12 18V12" style={{stroke: iconThemeColor, strokeWidth: "1.5", strokeLinecap: "round"}}/> 
            <path d="M17 18V9" style={{stroke: iconThemeColor, strokeWidth: "1.5", strokeLinecap: "round"}}/> 
            <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" style={{stroke: iconThemeColor, strokeWidth: "1.5", strokeLinecap: "round"}}/> 
            </g>
        </svg>
    </>
  )
}

export default ChatIcon