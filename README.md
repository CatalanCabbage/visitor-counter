# visitor-counter
Count the number of visitors to your website.

## What does this do?
Provides a serverless-API that returns the number of visitors to your website as a number.  
This API needs to be called on page load; every time it's called, the count is incremented.  

## Setup
- Set up a new project in [Zoho Catalyst](https://catalyst.zoho.com)
- Add a new table called `systemParams` with these 2 columns:
|Column name|Data type|isMandatory|  
|:---:|:---:|:---:|  
|param_key|text|`true`|  
|param_value|text|`true`|  
- Add a row to the table with `param_key = 'numberOfViews'` and `param_value = 0`.
- Authorize your GitHub account in Catalyst to sync code. Alternatively, download the code and upload it as an Advanced I/O function.  
- To deploy: `catalyst deploy`

### Change number of views
To change the number of views at any time, locate the row where `param_key` is `numberOfViews` and edit the `param_value` column in the table directly.

### Security
Configure an API gateway rule and set throttling. There are 2 types:  
- General throttling: Total allowed requests/minute
- IP-based throttling: Total allowed requests/minute from each unique IP