import pandas as pd
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
import numpy as np
import matplotlib.pyplot as plt


df = pd.read_csv("./test_data.csv")
df.info()
df.plot()

plt.savefig("myfig.pdf")

# acf_original = plot_acf(dftrain)
# pacf_original = plot_pacf(dftrain)
