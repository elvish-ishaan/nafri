import React from 'react';

interface StorageCellsProps {
  value: number; // Current storage used in GB
  outOf: number; // Total storage capacity in GB
}

const StorageCells: React.FC<StorageCellsProps> = ({ value, outOf }) => {
  console.log(value,'getting st value', outOf)
  const fillPercentage = Math.min((value / outOf) * 100, 100).toFixed(1);

  // Determine how many cells to fill based on the total number of cells (10)
  const totalCells = 20;
  const filledCells = Math.round((value / outOf) * totalCells);

  // Determine the color based on fill percentage
  const cellColor = Number(fillPercentage) > 70 ? 'bg-orange-500' : 'bg-green-500';

  return (
    <div>
      <div className="flex items-center space-x-1">
        {/* Battery Cells */}
        {[...Array(totalCells)].map((_, index) => (
          <div
            key={index}
            className={`w-1 h-4 ${index < filledCells ? cellColor : ' bg-muted'}`}
          />
        ))}
      </div>
      <p className="text-muted-foreground py-2 text-xs">
        {fillPercentage}% of {outOf} GB used
      </p>
    </div>
  );
};

export default StorageCells;
