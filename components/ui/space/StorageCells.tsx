import React from 'react';

interface BatteryIndicatorProps {
  value: number; // Number of filled cells
  outOf: number; // Total cells in battery
}

const StorageCells: React.FC<BatteryIndicatorProps> = ({ value, outOf }) => {
  // Calculate fill percentage
  const fillPercentage = (value / outOf) * 100;

  // Determine the color based on fill percentage
  const cellColor = fillPercentage > 70 ? 'bg-orange-500' : 'bg-green-500';

  return (
    <div>
        <div className="flex items-center space-x-1">
       
       {/* Battery Cells */}
       {[...Array(outOf)].map((_, index) => (
         <div
           key={index}
           className={`w-1 h-4 ${index < value ? cellColor : ' bg-muted'}`}
         />
       ))}
     </div>
     <p className=' text-muted-foreground py-2 text-xs'>{fillPercentage}% of 20 GB used</p>
     
    </div>
  );
};

export default StorageCells;
