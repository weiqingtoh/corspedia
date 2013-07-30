import csv, json, operator
from itertools import imap

facultyList = {"ART":"ARTS & SOCIAL SCIENCES",
               "ENG":"ENGINEERING",
               "MDP":"JOINT MULTI-DISCIPLINARY PROGRAMMES",
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

#This function is to calculate the hamming distance
def hamdist(str1, str2):
    assert len(str1) == len(str2)
    ne = operator.ne
    return sum(imap(ne, str1, str2))


#This function is to return a dictionary of keys representing
#the bid history of the module given the certain factors provided.
def extract(modCode, faculty, accType, newStu):

    #In case of lower letters
    modCode = modCode.upper()
    faculty = faculty.upper()

    #Catch errors of module and/or faculty
    facErr, modErr, modList = False, False, []
    infile = csv.reader(open('modName.csv','r'))
    infile.next()
    for row in infile:
        modList.append(row[0])
    if faculty not in facultyList:
        facErr = True
    if modCode not in modList:
        modErr = True
    if facErr or modErr :
        module = {}
        module['module'] = modCode
        module['faculty_error'] = facErr
        module['module_error'] = modErr
        return module        

    #if modCode is SS or GEM format and return output
    if modCode[0:3] in ('SSA','SSB','SSD','SSS','GEK','GEM'):
        return outformat(extractdata(modCode,'g'), modCode)
    
    #Extract the Module Records
    output = extractdata(modCode, accType)    

    #Correct records for faculty, bidrounds
    out = filterdata(faculty, newStu, output)                
          
    return outformat(out,modCode)


#This function extracts all the module data from the CSV file
def extractdata(modCode, accType):
    
    output = []
    with open('data/data.csv','rb') as csvfile:
        modData = csv.reader(csvfile)
        for row in modData:
            #Extract Records for Account and ModCode
            if row[0] == modCode or ((row[0] == 'EG1413') and (modCode == 'ES1531')):
                if accType == 'p' and row[9] == '1':
                    output.append(row)
                elif accType == 'g' and row[10] == '1':
                    output.append(row)
    return output


#This function identifies the necessary bid point sets to display
def filterdata(faculty, newStu, output):
    
    out, faculties = [], []
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
            elif row[9] == '1' and row[10] == '1':
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



#To format the current dictonary into the return schema
def outformat(bidInfo, modCode):

    ##Load the module information
    data = modInfo(modCode)

    data['bid_history_by_year'] = bidHistoryByYear(bidInfo)
    return data

#Extract the necessary module information from JSON file
def modInfo(modCode):
    data = {}
    data['module'] = modCode
    with open('data/mod_info.json','r') as infile:
        allInfo = json.load(infile)
        if modCode in allInfo:
            moduleInfo = allInfo[modCode]

            data['title'] = moduleInfo['title']
            data['credit'] = moduleInfo['credit']
            if 'description' in moduleInfo:
                data['description'] = moduleInfo['description']
            if 'preclusion' in moduleInfo:
                data['preclusions'] = moduleInfo['preclusion']
                if 'preclusion_module' in moduleInfo:
                    data['preclusion_module'] = moduleInfo['preclusion_module']
            if 'prerequisite' in moduleInfo:
                data['prerequisites'] = moduleInfo['prerequisite']
                if 'prerequisite_module' in moduleInfo:
                    data['prerequisite_module'] = moduleInfo['prerequisite_module']
    return data


def bidHistoryByYear(bidInfo):
    
    #Create Bidhistory Dictionary
    bidHist = []
    for year in ['2008','2009','2010','2011','2012']:
        for sem in ['1','2']:
            aySem = 'AY' + year[2:] + '/' + str(int(year[2:]) + 1).zfill(2) + ' Sem ' + sem
            bidHist.insert(0,{"year":aySem, "data":[]})
            currSem = bidHist[0]["data"]
            lectGrp, tempList = [], []

            #Extract Relevant Rows to Display in AY and Sem
            for row in bidInfo:
                if row[12] == year and row[13] == sem:
                    tempList.append(row)
                    if row[1] not in lectGrp:
                        lectGrp.append(row[1])

            #Count number of Lecture Groups, Create Dictionary Output
            numLect = len(lectGrp)
            for i in range(0,numLect):
                currSem.append({"bid_info":[]})

            #Input each entry of bid points into final output
            for entry in tempList:
                num = lectGrp.index(entry[1])
                bidPoints = {"bid_round": entry[11], "bid_summary":[0,0,0,0,0]}
                for i in range(0,5):
                    bidPoints["bid_summary"][i] = int(entry[i+2])   
                currSem[num]["bid_info"].append(bidPoints)
    bidHist1 = []
    for item in bidHist:
        if len(item['data']) > 0:
            bidHist1.append(item)
    return bidHist1

print extract("GEM2900","BIZ","g","0")
print extract("eg1413","eng","p","0")
##    print row
