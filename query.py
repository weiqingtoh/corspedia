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

def extract(modCode, faculty):
    output = []
    with open('data.csv','rb') as csvfile:
        modData = csv.reader(csvfile)
        for row in modData:
            if row[0] == modCode and row[7] == facultyList[faculty]:
                output.append(row)
    return output
