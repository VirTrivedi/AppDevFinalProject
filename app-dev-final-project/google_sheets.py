import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from dotenv import load_dotenv


load_dotenv()

# Get the file path from the environment variable
SERVICE_ACCOUNT_FILE = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

def get_google_sheet_data(spreadsheet_id: str, range_name: str):
    if not SERVICE_ACCOUNT_FILE:
        print("GOOGLE_APPLICATION_CREDENTIALS environment variable not set.")
        return []
   
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    
    service = build('sheets', 'v4', credentials=credentials)
    sheet = service.spreadsheets()
    
    result = sheet.values().get(spreadsheetId=spreadsheet_id, range=range_name).execute()
    values = result.get('values', [])

    return values

spreadsheet_id = '1XMVHhCLZ0Ipx18_ZnRXDB05DdRUr2KPMXwo6nJXxXY4'  
range_name = 'Sheet1!A2:D6'  
data = get_google_sheet_data(spreadsheet_id, range_name)
print(data)