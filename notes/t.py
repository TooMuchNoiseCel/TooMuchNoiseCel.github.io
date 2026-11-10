import pandas as pd
import webbrowser

df = pd.read_csv("./portafolios-dev-design.csv")
for ind,i in df.iterrows():
    webbrowser.open(i['site'])
#print(f"sitio:{i['site']}")
