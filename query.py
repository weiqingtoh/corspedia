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

    
#This function is to return a dictionary of keys representing
#the bid history of the module given the certain parameters provided.
def extract(modCode, faculty, accType, newStu):

    #In case of lower letters
    modCode = modCode.upper()
    faculty = faculty.upper()

    ##Load the module information and do error checking
    data = modInfo(modCode, faculty)

    #If error exists in module code or faculty
    if data['error']['module'] or data['error']['faculty']:
        return data
    
    #if modCode is SS or GEM format and return output
    if modCode[0:3] in ('SSA','SSB','SSD','SSS','GEK','GEM'):
        modBidData = extractdata(modCode,'g')
        
    #For all other modules, extract and filter the necessary data
    else:
        modBidData = filterdata(faculty, newStu, extractdata(modCode, accType))                
    
    #Format the necessary bid history
    data['bid_history_by_year'] = bidHistoryByYear(modBidData)

    return data


#Extract the necessary module information from JSON file
def modInfo(modCode, faculty):
    data = {'error':{'faculty': False, 'module': False},
            'module': modCode}
    #Faculty error
    if faculty not in facultyList:
        data['error']['faculty'] = True

    if modCode in ('FIN3101','FIN3102','FIN3103','BSP3001','MKT2401'):
        modCode = modCode + 'A'
    
    with open('data/mod_info.json','r') as infile:
        allInfo = json.load(infile)

        #If modules doesn't exist
        if modCode not in allInfo:
            data['error']['module'] = True
            if data['error']['faculty'] == False:
                data['suggestion'] = checkModCode(modCode)

        if modCode in allInfo and not data['error']['faculty']:
            moduleInfo = allInfo[modCode]
            postfix = '_module'
            
            for datatype in ['title','credit']:
                if datatype in moduleInfo:
                    data[datatype] = moduleInfo[datatype]

            for datatype in ['description','preclusion','prerequisite']:
                if datatype in moduleInfo:
                    data[datatype] = moduleInfo[datatype]
                    if (datatype + postfix) in moduleInfo:
                        data[datatype+postfix] = moduleInfo[datatype+postfix]
        
    return data

#This function is to check if module code is valid -
#returns suggestions for wrong codes
def checkModCode(modCode):

    #Extract total module list 
    modList, suggest = [], []
    infile = csv.reader(open('data/modName.csv','r'))
    infile.next()
    for row in infile:
        modList.append(row[0])
    modList.sort()

    #Extract modules with leven distance 2 or less
    for module in modList:
        if levenDist(module, modCode) <= 2:
            suggest.append(module)

    #If too many modules, score each module and take the top 3 scores
    #to filter down the number of suggested modules.
    if len(suggest) > 3:
        suggestList = []
        baseIndex = getModIndex(modCode,modList)

        #Score each module based on alphabetical distance and leven distance
        #A lower score indicates a 'closer match'
        for module in suggest:
            score = (abs(getModIndex(module,modList)- baseIndex))/(1.0*len(modList))
            score += (levenDist(module,modCode)) * 1000.0
            suggestList.append([module,score])

        #Extract modules with the lowest score
        suggestList = sorted(suggestList, key = lambda score: score[1])
        suggest = []
        for i in range(0,3):
            suggest.append(suggestList[i][0])
    suggest.sort()
    return suggest

#Define module index
def getModIndex(modCode, modList):
    #Find suggestions for modList
    if modCode in modList:
        return modList.index(modCode)
    else:
        for mod in modList:
            if modCode < mod:
                return modList.index(mod)
    return len(modList)        

#This function is to calculate the hamming distance
def hamDist(str1, str2):
    assert len(str1) == len(str2)
    ne = operator.ne
    return sum(imap(ne, str1, str2))

#This function is to calculate the Levenshtein distance
def levenDist(a,b):
    m,n,d = len(a), len(b), []
    d = [[0 for x in range(0,n+1)] for y in range(0,m+1)]
    for i in range(1,m+1):
        d[i][0] = i
    for i in range(1,n+1):
        d[0][i] = i
    for j in range(1,n+1):
        for i in range(1,m+1):
            if a[i-1] == b[j-1]:
                d[i][j] = d[i-1][j-1]
            else:
                d[i][j] = min ( d[i-1][j]+1,
                                d[i][j-1]+1,
                                d[i-1][j-1]+1)
    return int(d[m][n])

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

def bidHistoryByYear(bidInfo):
    
    #Create Bidhistory Dictionary
    bidHist = []
    for year in ['2008','2009','2010','2011','2012','2013']:
        for sem in ['1','2']:
            if year == '2013' and sem == '2':
                continue
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
print extract("fin3100","biz","p","0")
