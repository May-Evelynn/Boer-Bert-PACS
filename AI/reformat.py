# i can not describe how much i dislike this file. i am really not enjoying this fucking reformatting bullshit. 
# it really is not that difficult, i never got my original method of doing this to work though. 
# for some reason i also decided to sort the dataset before processing which just was not necessary.
# fuck you  


from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from datetime import date, timedelta, datetime
import datetime
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

datum = [] 
eachday = []
sybau = ""
sdiybt = []
cnt = -1

df = pd.read_csv("./logs_202601211852.csv")
inputstring = df.to_string()

splitstr = inputstring.splitlines()


for val in splitstr:
    datum.append(val[5:9] + val[10:12] + val[13:15] + val[16:18])

datum.sort()
for x in datum:
    if x == sybau:
        eachday[cnt] += 1
    else:
        eachday.append(1)
        cnt += 1
    sybau = x

np.savetxt("foo.csv", eachday, delimiter=",")

print(eachday)
# print(splitstr)