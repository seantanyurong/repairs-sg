import schedule
import time
import os
import threading
from datetime import datetime

def run_analytics_notebook():
    notebook_path = '../notebook/analytics.ipynb'
    exit_status = os.system(f"jupyter nbconvert --to notebook --execute --inplace {notebook_path}")
    if exit_status == 0:
        print("Analytics Notebook Executed and JSON Files Updated.")
    else:
        print("Failed To Execute Analytics Notebook. Please Check For Errors.")

def run_modelling_notebook():
    notebook_path = '../notebook/modelling.ipynb'
    exit_status = os.system(f"jupyter nbconvert --to notebook --execute --inplace {notebook_path}")
    if exit_status == 0:
        print("Modelling Notebook Executed and PKL Files Updated.")
    else:
        print("Failed To Execute Modelling Notebook. Please Check For Errors.")

# Schedule Analytics Notebook To Run Daily At 4 AM
schedule.every().day.at("04:00").do(run_analytics_notebook)

# Schedule Modelling Notebook To Run Monthly (First Day of Month) At 4 AM
def monthly_task_check():
    now = datetime.now()
    if now.day == 1 and now.hour == 4 and now.minute == 0:
        run_modelling_notebook()

def run_scheduler():
    print("Scheduler Started ...")
    while True:
        schedule.run_pending()
        monthly_task_check()
        time.sleep(1)

# Start the scheduler in a separate thread
def start_scheduler():
    scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()