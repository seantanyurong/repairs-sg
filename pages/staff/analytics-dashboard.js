import { ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Scatter, ResponsiveContainer, Label, Brush } from 'recharts';
import { useEffect, useState } from 'react';

export default function AnalyticsDashboard() {
  const [plotData, setPlotData] = useState([]);

  useEffect(() => {
    fetch('/api/notebook?dataset=iris')
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((d) => ({
          x: d.x,
          y: d.y,
          species: d.species
        }));
        setPlotData(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      {/* Header Section */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Analytics Dashboard</h1>
        <p className="text-lg text-gray-600 mt-2">Interactive Scatter Plot for Iris Sepal Dimensions</p>
      </header>

      {/* Center the Graph Section */}
      <div className="w-full max-w-6xl p-4">
        <ResponsiveContainer width="100%" height={600}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Sepal Length" 
              unit="cm" 
              domain={['auto', 'auto']}
            >
              <Label value="Sepal Length (cm)" offset={-10} position="insideBottom" />
            </XAxis>
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Sepal Width" 
              unit="cm" 
              domain={['auto', 'auto']}
            >
              <Label value="Sepal Width (cm)" angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip
              content={({ payload, label }) => {
                if (payload && payload.length) {
                  const { x, y, species } = payload[0].payload;
                  return (
                    <div className="bg-white border border-gray-300 p-2 rounded">
                      <p><strong>Sepal Length:</strong> {x} cm</p>
                      <p><strong>Sepal Width:</strong> {y} cm</p>
                      <p><strong>Species:</strong> {species}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Scatter name="Setosa" data={plotData.filter((d) => d.species === 'setosa')} fill="#8884d8" />
            <Scatter name="Versicolor" data={plotData.filter((d) => d.species === 'versicolor')} fill="#82ca9d" />
            <Scatter name="Virginica" data={plotData.filter((d) => d.species === 'virginica')} fill="#ffc658" />
            <Brush
              dataKey="x"
              height={30}
              stroke="#8884d8"
              startIndex={0}
              endIndex={plotData.length - 1}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


// 'use client';

// import { Card, Title, Text } from '@shadcn/ui';
// import { ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Scatter } from 'recharts';
// import { useEffect, useState } from 'react';

// export default function AnalyticsDashboard() {
//   const [plotData, setPlotData] = useState([]);

//   useEffect(() => {
//     // fetch('/api/notebook?dataset=${dataset}')
//     fetch('/api/notebook?dataset=iris')
//       .then((response) => response.json())
//       .then((data) => {
//         const formattedData = data.x.map((x, index) => ({
//           x: x,
//           y: data.y[index],
//           species: data.species[index]
//         }));
//         setPlotData(formattedData);
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//       });
//   }, []);

//   return (
//     <Card>
//       <Title>Iris Sepal Dimensions</Title>
//       <Text>Interactive Scatter Plot</Text>
//       <ScatterChart width={800} height={600} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="x" name="Sepal Length" unit="cm" />
//         <YAxis dataKey="y" name="Sepal Width" unit="cm" />
//         <Tooltip cursor={{ strokeDasharray: '3 3' }} />
//         <Legend />
//         <Scatter name="Setosa" data={plotData.filter(d => d.species === 'setosa')} fill="#8884d8" />
//         <Scatter name="Versicolor" data={plotData.filter(d => d.species === 'versicolor')} fill="#82ca9d" />
//         <Scatter name="Virginica" data={plotData.filter(d => d.species === 'virginica')} fill="#ffc658" />
//       </ScatterChart>
//     </Card>
//   );
// }
