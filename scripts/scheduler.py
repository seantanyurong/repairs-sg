import schedule
import time
import os

def run_analytics_notebook():
    notebook_path = '../notebook/analytics.ipynb'
    exit_status = os.system(f"jupyter nbconvert --to notebook --execute --inplace {notebook_path}")
    if exit_status == 0:
        print("Analytics Notebook Executed and JSON Files Updated.")
    else:
        print("Failed To Execute Analytics Notebook. Please Check For Errors.")

# def run_modelling_notebook():
#     notebook_path = '../notebook/modelling.ipynb'
#     exit_status = os.system(f"jupyter nbconvert --to notebook --execute --inplace {notebook_path}")
    # if exit_status == 0:
    #     print("Modelling Notebook Executed and JSON Files Updated.")
    # else:
    #     print("Failed To Execute Modelling Notebook. Please Check For Errors.")

# Schedule Analytics Notebook To Run Daily At 4 AM
schedule.every().day.at("04:00").do(run_analytics_notebook)

# Schedule Modelling Notebook To Run Monthly (First Day of Month) At 4 AM
# schedule.every().month.at("04:00").do(run_modelling_notebook)

while True:
    schedule.run_pending()
    time.sleep(1)
