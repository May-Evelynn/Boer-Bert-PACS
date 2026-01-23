maandelijkslening = 315.17
rente = 1.03
monthcount = 42
totaleschulde = 0
i = 0

while i < monthcount:
    totaleschulde += maandelijkslening
    totaleschulde = totaleschulde * rente
    i += 1
print(totaleschulde)