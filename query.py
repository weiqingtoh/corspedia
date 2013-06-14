import csv

facultyList = {"ART":"ARTS & SOCIAL SCIENCES",
               "ENG":"ENGINEERING",
               "USP":"JOINT MULTI-DISCIPLINARY PROGRAMMES",
               "LAW":"LAW",
               "XX1":"NON-FACULTY-BASED DEPARTMENTS",
               "XX2":"NUS",
               "XX3":"SAW SWEE HOCK SCHOOL OF PUBLIC HEALTH",
               "BIZ":"SCHOOL OF BUSINESS",
               "COM":"SCHOOL OF COMPUTING",
               "SDE":"SCHOOL OF DESIGN AND ENVIRONMENT",
               "SCI":"SCIENCE",
               "XX5":"UNIVERSITY ADMINISTRATION",
               "USP":"UNIVERSITY SCHOLARS PROGRAMME",
               "MED":"YONG LOO LIN SCHOOL OF MEDICINE",
               "YST":"YONG SIEW TOH CONSERVATORY OF MUSIC"}

def extract(modCode, faculty, accType, newStudent):
    output = []
    out = []
    faculties = []
    with open('data.csv','rb') as csvfile:
        modData = csv.reader(csvfile)
        for row in modData:
            #Extract Records for Account and ModCode
            if row[0] == modCode:
                if accType == 'p' and row[9]:
                    output.append(row)
                elif accType == 'g' and (row[10] == '1' or row[11][0] == '3'):
                    output.append(row)
                    
    #Correct records for faculty, bidrounds
    for row in output:
        if newStudent == "0" and row[8] == '0' and row[9] == '1' and row[10] == '1':
            out.append(row)
        elif row[11] in {"3A","3B","3C"}:
            out.append(row)
        elif facultyList[faculty] == row[7]:
            if newStudent == "0":
                if row[8] == '0' or row[8] == '2':
                    out.append(row)
            elif newStudent == "1":
                if row[8] == '1' or row[8] == '2':
                    out.append(row)

    ##Form output data structure. Remember to remove some duplicate entries.
    ##Eg. FIN3130 BIZ p 0 query would return repeats. 
                    
    return out

for row in extract("ACC1002X","SCI","p","0"):
    print row

## Rules. Round 3A and 3B always in.
## Rules. row[8]: NewStu - 2 is for both new and not new, 1 for new, 0 for old.
