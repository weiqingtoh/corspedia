import csv

def extract(modCode, faculty):
    output = []
    with open('data.csv','rb') as csvfile:
        modData = csv.reader(csvfile)
        for row in modData:
            if row[0] == modCode and row[10] == '20082009':
                output.append(row)
    return output
