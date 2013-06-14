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

def extract(modCode, faculty, accType, newStu):
    output = []
    out = []
    faculties = []
    with open('data.csv','rb') as csvfile:
        modData = csv.reader(csvfile)
        for row in modData:
            #Extract Records for Account and ModCode
            if row[0] == modCode:
                if accType == 'p' and row[9] == '1':
                    output.append(row)
                elif accType == 'g' and row[10] == '1':
                    output.append(row)
                    
    #Correct records for faculty, bidrounds
    #if modCode is SS or GEM format and return output
    if modCode[0:3] in ('SSA','SSB','SSD','SSS','GEK','GEM'):
        return output
                    
    for row in output:
        #Filter by Rounds - Round 1A,1B,1C
        if row[11][0] == '1':
            if newStu == '0' and row[8] != '1':
                if row[7] == facultyList[faculty]:
                    out.append(row)
        #Round 2A, 2B, 2C
        elif row[11][0] == '2':
            if row[11] == '2C':
                out.append(row)
            elif newStu == '0' and row[8] != '1':
                if facultyList[faculty] == row[7]:
                    out.append(row)
            elif newStu == '1' and row[8] != '0':
                if facultyList[faculty] == row[7]:
                    out.append(row)
        #Round 3A, 3B, 3C
        else:
            out.append(row)      
    return out


def outformat(list):
    out = []
    #Count number of lecture groups
    #Create output data structure
    #Look up nec information
    
    for row in list:
        out.append(row)
    return out

##
##for row in extract("GEM2900","BIZ","g","0"):
##    print row
