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
        return outformat(output, modCode)
                    
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
    return outformat(out,modCode)

#Can remove modCode and seek modCode within data
def outformat(bidInfo, modCode):
    data = {}
    data['Title'] = ""
    data['Module'] = modCode
    with open('modName.csv','rb') as csvfile:
        modData = csv.reader(csvfile)
        for row in modData:
            if row[0] == modCode:
                data['Title']= row[1]
            
    #Create Bidhstory
    bidHist = {}
    for year in ['2008','2009','2010','2011','2012']:
        for sem in ['1','2']:
            aySem = year + 'S' + sem
            bidHist[aySem] = {}
            lectGrp, tempList = [], []

            #Extract Relevant Rows to Display in AY and Sem
            for row in bidInfo:
                if row[12] == year and row[13] == sem:
                    tempList.append(row)
                    if row[1] not in lectGrp:
                        lectGrp.append(row[1])

            #Count number of Lecture Groups, Create Dictionary Output
            numLect = len(lectGrp)
            lectGrp.sort()
            for i in range(0,numLect):
                letter = chr(ord('A')+ i)
                bidHist[aySem][letter] = {}
                for bidRd in ['1A','1B','1C','2A','2B','2C','3A','3B','3C']:
                    bidHist[aySem][letter][bidRd] = [0,0,0,0,0]

            #Input each entry
            for entry in tempList:
                letter = chr(ord('A')+lectGrp.index(entry[1]))
                for i in range(0,5):
                    bidHist[aySem][letter][entry[11]][i]=int(entry[i+2])
    data['BidHistory'] = bidHist
    return data



print extract("GEM2900","BIZ","g","0")
##    print row
