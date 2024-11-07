'use client';

import { useState } from "react";

export default function ServicePrice() {
  type CategoryType = 'aircon' | 'electrician' | 'handyman' | 'plumber' | 'ventilation';
  type ServiceType = 'Install' | 'Repair';
  type EquipmentType = 'basin' | 'bidet' | 'circuit_breaker' | 'filter' | 'general'
    | 'inline' | 'leak' | 'light' | 'servicing' | 'shower_bath' | 'socket'
    | 'switch' | 'toilet_bowl' | 'wall_mounted' | 'water_heater'
    | 'water_leak' | 'window_mounted';

  const equipmentOptions: { [key: string]: string[] } = {
    electrician: ["Light", "Switch", "Socket", "Circuit_Breaker"],
    ventilation: ["Inline", "Wall_Mounted", "Window_Mounted"],
    plumbing: ["Water_Leak", "Water_Heater", "Toilet_Bowl", "Shower_Bath", "Basin", "Bidet"],
    handyman: ["General"],
    aircon: ["Leak", "Servicing", "Filter"],
  };

  const [pricePrediction, setPricePrediction] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [service, setService] = useState<ServiceType | null>(null);
  const [equipment, setEquipment] = useState<EquipmentType | null>(null);
  const [quantityCount, setQuantityCount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleCategoryChange = (selectedCategory: CategoryType) => {
    setCategory(selectedCategory);
    setEquipment(null); 
  };

  const handleEquipmentChange = (selectedEquipment: EquipmentType) => {
    setEquipment(selectedEquipment);
  };

  const handleServiceChange = (selectedService: ServiceType) => {
    setService(selectedService);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setQuantityCount(value);
  };

  const handlePriceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(category, service, equipment);

    // Reset validation error
    setValidationError(null);
    if (!category || !service || !equipment) {
      setValidationError("Please Ensure That Category, Service, And Equipment Are Selected Before Submitting.");
      return;
    }
    setLoading(true);

    const featureMap = {
      items: quantityCount,
      category_aircon: false,
      category_electrician: false,
      category_handyman: false,
      category_plumber: false,
      category_ventilation: false,
      equipment_Basin: false,
      equipment_Bidet: false,
      equipment_Circuit_Breaker: false,
      equipment_Filter: false,
      equipment_General: false,
      equipment_Inline: false,
      equipment_Leak: false,
      equipment_Light: false,
      equipment_Servicing: false,
      equipment_Shower_Bath: false,
      equipment_Socket: false,
      equipment_Switch: false,
      equipment_Toilet_Bowl: false,
      equipment_Wall_Mounted: false,
      equipment_Water_Heater: false,
      equipment_Water_Leak: false,
      equipment_Window_Mounted: false,
      service_Install: false,
      service_Repair: false,
    } as Record<string, boolean | number>;

    // Set the selected category, equipment, and service to true
    if (category) featureMap[`category_${category}`] = true;
    if (equipment) featureMap[`equipment_${equipment}`] = true;
    if (service) featureMap[`service_${service}`] = true;

    // Map each featureMap property to a specific position in the featureArray
    const featureArray = new Array(25).fill(false);
    featureArray[0] = featureMap.items;
    featureArray[1] = featureMap.category_aircon;
    featureArray[2] = featureMap.category_electrician;
    featureArray[3] = featureMap.category_handyman;
    featureArray[4] = featureMap.category_plumber;
    featureArray[5] = featureMap.category_ventilation;
    featureArray[6] = featureMap.equipment_Basin;
    featureArray[7] = featureMap.equipment_Bidet;
    featureArray[8] = featureMap.equipment_Circuit_Breaker;
    featureArray[9] = featureMap.equipment_Filter;
    featureArray[10] = featureMap.equipment_General;
    featureArray[11] = featureMap.equipment_Inline;
    featureArray[12] = featureMap.equipment_Leak;
    featureArray[13] = featureMap.equipment_Light;
    featureArray[14] = featureMap.equipment_Servicing;
    featureArray[15] = featureMap.equipment_Shower_Bath;
    featureArray[16] = featureMap.equipment_Socket;
    featureArray[17] = featureMap.equipment_Switch;
    featureArray[18] = featureMap.equipment_Toilet_Bowl;
    featureArray[19] = featureMap.equipment_Wall_Mounted;
    featureArray[20] = featureMap.equipment_Water_Heater;
    featureArray[21] = featureMap.equipment_Water_Leak;
    featureArray[22] = featureMap.equipment_Window_Mounted;
    featureArray[23] = featureMap.service_Install;
    featureArray[24] = featureMap.service_Repair;

    console.log(featureArray);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/predict/service-price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features: featureArray }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Service Price prediction. Please try again later.');
      }

      const data = await response.json();
      setPricePrediction(data.prediction.toFixed(2));
      setPriceError(null);
    } catch (error) {
      if (error instanceof Error) {
        setPriceError(error.message);
        setPricePrediction(null);
      } else {
        console.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Service Price Prediction</h2>
      <div className="mb-4">
      <label>Job Category:</label>
      <select onChange={(e) => handleCategoryChange(e.target.value as CategoryType)} value={category || ""}>
      <option value="" disabled>Select A Category</option>
      {Object.keys(equipmentOptions).map((key) => (
        <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
      ))}
      </select>
      </div>

      <form onSubmit={handlePriceSubmit}>
      {category && (
        <div className="mb-4">
        <label>Equipment Type:</label>
        <select onChange={(e) => handleEquipmentChange(e.target.value as EquipmentType)} value={equipment || ""}>
            <option value="" disabled>Select An Equipment</option>
            {equipmentOptions[category].map((equipment) => (
            <option key={equipment} value={equipment}>{equipment}</option>
            ))}
        </select>
        </div>
      )}

      <div className="mb-4">
        <label>Service Type:</label>
        <select onChange={(e) => handleServiceChange(e.target.value as ServiceType)} value={service || ""}>
        <option value="" disabled>Select A Service</option>
        <option value="Install">Install</option>
        <option value="Repair">Repair</option>
        </select>
      </div>

      <div className="mb-4">
        <label>Number of Quantity:</label>
        <select onChange={handleQuantityChange}>
        <option value="" disabled>Select A Number</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        </select>
      </div>

      <button type="submit" className="bg-primary text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Prediction In Progress ...' : 'Predict Price'}
      </button>

      {validationError && <div className="text-red-500 mt-2">{validationError}</div>}
      </form>

      {pricePrediction && <p className="mt-4">Predicted Service Price: ${pricePrediction}</p>}
      {priceError && <p className="mt-4 text-red-500">{priceError}</p>}

  </div>
  );
}