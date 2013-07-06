import csv
import json

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


#This function is to return a dictionary of keys representing
#the bid history of the module given the certain factors provided.
def extract(modCode, faculty, accType, newStu):

    #In case of lower letters
    modCode = modCode.upper()

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
            if row[0] == modCode:
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

    ##TO DELETE
    data['BidHistory'] = bidHistory(bidInfo)

    data['bid_history'] = bidHistory1(bidInfo)
    return data

#Extract the necessary module information from JSON file
def modInfo(modCode):
    data = {}
    data['Module'] = modCode
    with open('data/mod_info.json','r') as infile:
        allInfo = json.load(infile)
        if modCode in allInfo["cors"]:
            moduleInfo = allInfo["cors"][modCode]

            ###*** To Delete After Change ***###
            data['Title'] = moduleInfo['title']
            data['Credit'] = moduleInfo['mcs']
            data['Description'] = moduleInfo['description']
            if 'preclusion' in moduleInfo:
                data['Preclusions'] = moduleInfo['preclusion']
            if 'prerequisite' in moduleInfo:
                data['Prerequisities'] = moduleInfo['prerequisite']
            ###*** END OF DELETE ***###
            
            data['title'] = moduleInfo['title']
            data['credit'] = moduleInfo['mcs']
            data['description'] = moduleInfo['description']
            if 'preclusion' in moduleInfo:
                data['preclusions'] = moduleInfo['preclusion']
            if 'prerequisite' in moduleInfo:
                data['prerequisities'] = moduleInfo['prerequisite']
    return data

#Represent the bidHistory in the output schema format
def bidHistory(bidInfo):
    
    #Create Bidhistory Dictionary
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

                ## Can uncomment this if [0,0,0,0,0] is needed in all rounds
                ##for bidRd in ['1A','1B','1C','2A','2B','2C','3A','3B','3C']:
                    ##bidHist[aySem][letter][bidRd] = [0,0,0,0,0]

            #Input each entry of bid points into final output
            for entry in tempList:
                #Create the Letters for each Lecture Group
                letter = chr(ord('A')+lectGrp.index(entry[1]))
                bidHist[aySem][letter][entry[11]] = [0,0,0,0,0]
                #Add in the necessary bidding points
                for i in range(0,5):
                    bidHist[aySem][letter][entry[11]][i]=int(entry[i+2])
    return bidHist

def bidHistory1(bidInfo):
    
    #Create Bidhistory Dictionary
    bidHist = []
    for year in ['2008','2009','2010','2011','2012']:
        for sem in ['1','2']:
            aySem = year + 's' + sem
            bidHist.insert(0,{aySem:[]})
            currSem = bidHist[0][aySem]
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
                letter = chr(ord('a')+ i)
                currSem.insert(len(currSem), {letter:[]})

            #Input each entry of bid points into final output
            for entry in tempList:
                num = lectGrp.index(entry[1])
                letter = chr(ord('a') + num)
                bidPoints = [0,0,0,0,0]
                for i in range(0,5):
                    bidPoints[i] = int(entry[i+2])   
                currSem[num][letter].insert(len(currSem[num][letter]),{entry[11].lower(): bidPoints})

    return bidHist

##print extract("GEM2900","BIZ","g","0")
print extract("cs4243","COM","p","0")
##    print row
