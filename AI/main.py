import pandas as pd
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.tsa.stattools import adfuller
import numpy as np
import matplotlib.pyplot as plt

df = pd.read_csv("./test_data.csv")
df.info()
df.plot()

plt.savefig("myfig.pdf")

df = np.log(df)
df.plot()

plt.savefig("myfig2.pdf")

msk = (df.index < len(df)-30)
df_train = df[msk].copy()
df_test = df[~msk].copy()

acf_original = plot_acf(df_train)
pacf_original = plot_pacf(df_train)

acf_original.savefig("myfig3.pdf")
pacf_original.savefig("myfig4.pdf")


adf_test = adfuller(df_train)
print(f'p-value: {adf_test[1]}')


# acf_original = plot_acf(dftrain)
# pacf_original = plot_pacf(dftrain)
