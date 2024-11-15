	import React from 'react';
	
	const CityMap = ({ handleLevelClick, completedLevels }) => {
	 const levelData = [
	  { id: 1, name: 'Fix Streetlight', x: 50, y: 50, width: 150, height: 150, color: 'lightblue' },
	  { id: 2, name: 'Repair Road', x: 250, y: 50, width: 150, height: 150, color: 'lightgreen' },
	  { id: 3, name: 'Clean Park', x: 450, y: 50, width: 150, height: 150, color: 'lightyellow' },
	  { id: 4, name: 'Build Playground', x: 50, y: 250, width: 150, height: 150, color: 'lightcoral' },
	  { id: 5, name: 'Fix Water Pipe', x: 250, y: 250, width: 150, height: 150, color: 'lightpink' },
	 ];
	
	 return (
	  <div className="map-container">
	   <svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
	    {levelData.map(level => (
	     <React.Fragment key={level.id}>
	      <rect
	       x={level.x} y={level.y} width={level.width} height={level.height}
	       fill={completedLevels.includes(level.id) ? '#555' : level.color}
	       onClick={() => handleLevelClick(level.id)}
	       style={{ cursor: 'pointer', opacity: completedLevels.includes(level.id) ? 0.5 : 1 }}
	      />
	      <text x={level.x + level.width / 2} y={level.y + level.height / 2} fontSize="16" textAnchor="middle" dy=".3em">
	       {level.name}
	      </text>
	     </React.Fragment>
	    ))}
	   </svg>
	  </div>
	 );
	};
	
	export default CityMap;