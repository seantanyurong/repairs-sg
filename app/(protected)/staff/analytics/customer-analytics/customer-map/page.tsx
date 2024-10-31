export default function CustomerMap() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 md:text-3xl">Customer Interactive Map</h1>
      <iframe 
        src="/analytics/customer/customer-map.html" 
        width="100%" 
        height="500px" 
        style={{ border: 'none' }} 
        title="Map"
      ></iframe>
    </div>
  );
}