import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from dotenv import load_dotenv


load_dotenv()

SERVICE_ACCOUNT_FILE = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

def get_google_sheet_data(week_num: int):
    if not SERVICE_ACCOUNT_FILE:
        print("GOOGLE_APPLICATION_CREDENTIALS environment variable not set.")
        return []
    
    spreadsheet_id = '1XMVHhCLZ0Ipx18_ZnRXDB05DdRUr2KPMXwo6nJXxXY4'  
    start_column = chr(ord('A') + week_num)  # column letter
    end_column = start_column
    start_row = 2  # Starting from row 2 
    end_row = 10  # number of users
    
    range_name =  f'Sheet1!{start_column}{start_row}:{end_column}{end_row}'
   
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    
    service = build('sheets', 'v4', credentials=credentials)
    sheet = service.spreadsheets()
    
    result = sheet.values().get(spreadsheetId=spreadsheet_id, range=range_name).execute()
    values = result.get('values', [])

    return values

 
data = get_google_sheet_data(2)
print(data)