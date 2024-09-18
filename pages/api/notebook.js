import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // const response = await fetch('http://localhost:8888/api/contents/notebook/analytics.ipynb', {
    //   headers: {
    //       'Authorization': 'Token 4ae60a01909c94e12b4abba08f62b15315e7f476a31664d0'
    //   }
    // });

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }

    const { dataset } = req.query;
    const datasets = {
      iris: 'iris_data.json',
      // Add more datasets here
    };

    const fileName = datasets[dataset];
    if (!fileName) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    const filePath = path.join(process.cwd(), 'public', fileName);
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);
    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to read data file:', error);
    res.status(500).json({ error: 'Failed to read data file' });
  }
}