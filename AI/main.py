import pandas as pd
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.arima.model import ARIMA
import pmdarima as pm
import numpy as np
import matplotlib.pyplot as plt

n_periods = 7
df = pd.read_csv("./foo.csv")
# df = pd.read_csv("./test_data.csv")
df.info()
# df.plot()
# plt.savefig("myfig.pdf")

df = np.log(df)
# df.plot()

# plt.savefig("myfig2.pdf")

msk = (df.index < len(df)-30)
df_train = df[msk].copy()
df_test = df[~msk].copy()


acf_original = plot_acf(df_train)
pacf_original = plot_pacf(df_train)

acf_original.savefig("myfig3.pdf")
pacf_original.savefig("myfig4.pdf")

adf_test = adfuller(df_train)
print(f'p-value: {adf_test}')


df_train_diff = df_train.diff().dropna()
df_train_diff.plot()

acf_diff = plot_acf(df_train_diff)
pacf_diff = plot_pacf(df_train_diff)

acf_diff.savefig("myfig5.pdf")
pacf_diff.savefig("myfig6.pdf")

adf_test = adfuller(df_train_diff)
print(f'p-value: {adf_test}')

# 2nd differential - difference between the differences
df_train_diff2 = df_train_diff.diff().dropna()
df_train_diff2.plot()

acf_diff2 = plot_acf(df_train_diff2)
pacf_diff2 = plot_pacf(df_train_diff2)


acf_diff2.savefig("myfig7.pdf")
pacf_diff2.savefig("myfig8.pdf")

adf_test2 = adfuller(df_train_diff2)
print(f'p-value: {adf_test2}')


model = ARIMA(df_train, order=(2,1,0))
model_fit = model.fit()
print(model_fit.summary())

residuals = model_fit.resid[1:]
fix, ax = plt.subplots(1,2)
residuals.plot(title="Residuals", ax=ax[0])
residuals.plot(title="Density", kind="kde", ax=ax[0])
# plt.show()

forecast_test = model_fit.forecast(len(df_test))
df['forecast_manual'] = [None]*len(df_train) + list(forecast_test)
df.plot()


plt.savefig("hello")
# np.savetxt("hello.csv", df.plot(), delimiter=",")

# df.to_csv("hi.csv",index=False)


fc, confint = model.predict([2,1,0] ,n_periods=n_periods, return_conf_int=True)
index_of_fc = np.arange(len(df.value), len(df.value)+n_periods)

# make series for plotting purpose
fc_series = pd.Series(fc, index=index_of_fc)
lower_series = pd.Series(confint[:, 0], index=index_of_fc)
upper_series = pd.Series(confint[:, 1], index=index_of_fc)

# Plot
plt.plot(df.value)
plt.plot(fc_series, color='darkgreen')
plt.fill_between(lower_series.index, 
                 lower_series, 
                 upper_series, 
                 color='k', alpha=.15)

plt.title("Final Forecast ")
plt.show()

# auto_arima = pm.auto_arima(df_train, stepwise=False, seasonal = False)
# print("BREAK")