import numpy as np
import pandas as pd
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS
from scheduler import start_scheduler

app = Flask(__name__)
CORS(app, origins=["http://localhost:*"])

# Job Duration Prediction
with open("../public/analytics/advanced/job-duration-model.pkl", "rb") as f:
    job_duration_model = pickle.load(f)

@app.route("/predict/job-duration", methods=["POST"])
def predict_job_duration():
    feature_names = [
        'items', 
        'staff', 
        'category_aircon', 
        'category_electrician', 
        'category_handyman', 
        'category_plumber', 
        'category_ventilation',
        'equipment_basin', 
        'equipment_bidet', 
        'equipment_circuit-breaker', 
        'equipment_filter', 
        'equipment_general', 
        'equipment_inline', 
        'equipment_leak', 
        'equipment_light', 
        'equipment_servicing', 
        'equipment_shower-bath', 
        'equipment_socket', 
        'equipment_switch', 
        'equipment_toilet-bowl', 
        'equipment_wall-mounted', 
        'equipment_water-heater', 
        'equipment_water-leak', 
        'equipment_window-mounted', 
        'service_Install', 
        'service_Repair'
    ]

    features = request.json.get("features")
    features = np.array(features).reshape(1, -1)
    predictors_df = pd.DataFrame(features, columns=feature_names)
    prediction = job_duration_model.predict(predictors_df)
    return jsonify({"prediction": prediction[0]})

# Service Price Prediction
with open("../public/analytics/advanced/service-price-model.pkl", "rb") as f:
    service_price_model = pickle.load(f)

@app.route("/predict/service-price", methods=["POST"])
def predict_service_price():
    feature_names = [
        'items', 
        'category_aircon', 
        'category_electrician', 
        'category_handyman', 
        'category_plumber', 
        'category_ventilation',
        'equipment_basin', 
        'equipment_bidet', 
        'equipment_circuit-breaker', 
        'equipment_filter', 
        'equipment_general', 
        'equipment_inline', 
        'equipment_leak', 
        'equipment_light', 
        'equipment_servicing', 
        'equipment_shower-bath', 
        'equipment_socket', 
        'equipment_switch', 
        'equipment_toilet-bowl', 
        'equipment_wall-mounted', 
        'equipment_water-heater', 
        'equipment_water-leak', 
        'equipment_window-mounted', 
        'service_Install', 
        'service_Repair'
    ]

    features = request.json.get("features")
    features = np.array(features).reshape(1, -1)
    predictors_df = pd.DataFrame(features, columns=feature_names)
    prediction = service_price_model.predict(predictors_df)
    return jsonify({"prediction": prediction[0]})

if __name__ == "__main__":
    start_scheduler()
    app.run(host="0.0.0.0", port=5000)