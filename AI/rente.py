maandelijkslening = 315.17
rente = 1.0233
monthcount = 42
totaleschulde = 0
i = 0

while i < monthcount:
    totaleschulde += maandelijkslening
    totaleschulde = totaleschulde * rente
    i += 1
i=0
# s
print(totaleschulde)
# bleh = totaleschulde / 35 / 12
# print(bleh)