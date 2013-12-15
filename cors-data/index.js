
/*
 * GET home page.
 */

var fs = require('fs');
var allModulesInfo = JSON.parse(fs.readFileSync('./cors-data/modules-info.json'));

var csv = require('csv');
var biddingData;
csv().from.path('./cors-data/bidding-data.csv', { delimiter: ','}).to.array(function(data) {
    biddingData = data;
    console.log('CSV loaded');
});

module.exports = {
    facultyList: {
        "ART":"ARTS & SOCIAL SCIENCES",
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
        "YST":"YONG SIEW TOH CONSERVATORY OF MUSIC"
    },
    extract: function(modCode, faculty, accType, newStu) {
        // This function is to return a dictionary of keys representing
        // the bid history of the module given the certain parameters provided.
        
        var modCode = modCode.toUpperCase();
        var faculty = faculty.toUpperCase();

        // Load the module information and do error checking
        var data = this.modInfo(modCode, faculty);

        // If error exists in module code or faculty
        if (data.error.module || data.error.faculty) {
            return data;
        }

        function extractData(modCode, accType) {
            var output = []
            biddingData.forEach(function(row) {
                // Extract Records for Account and ModCode
                if (row[0] == modCode || ((row[0] == 'EG1413') && (modCode == 'ES1531'))) {
                    if (accType == 'p' && row[9] == '1') {
                        output.push(row);
                    } else if (accType == 'g' && row[10] == '1') {
                        output.push(row);
                    }
                }
            });
            return output
        } 

        var that = this;
        
        // This function identifies the necessary bid point sets to display
        function filterData(faculty, newStu, output) {
            var out = [];
            var faculties = [];
            output.forEach(function(row) {
                // Filter by Rounds - Round 1A,1B,1C
                if (row[11][0] == '1'){
                    if (newStu == '0' && row[8] != '1' && row[7] == that.facultyList[faculty]) {
                        out.push(row);
                    }
                } else if (row[11][0] == '2') {
                    // Round 2A, 2B, 2C
                    if (row[11] == '2C') {
                        out.push(row);
                    } else if (row[9] == '1' && row[10] == '1') {
                        out.push(row);
                    } else if (newStu == '0' && row[8] != '1' && that.facultyList[faculty] == row[7]) {
                        out.push(row);
                    } else if (newStu == '1' && row[8] != '0') {
                        if (that.facultyList[faculty] == row[7]) {
                            out.push(row);
                        }
                    }
                } else {
                    // Round 3A, 3B, 3C         
                    out.push(row);
                }
            });

            return out
        }


        function bidHistoryByYear(bidInfo) {
            // Create Bidhistory Dictionary
            var bidHist = [];
            ['2008','2009','2010','2011','2012','2013'].forEach(function(year) {
                ['1','2'].forEach(function(sem) {
                    if (!(year == '2013' && sem == '2')) {
                        function zfill(num, len) { return (Array(len).join("0") + num).slice(-len); }
                        var aySem = 'AY' + year.slice(2) + '/' + zfill((parseInt(year.slice(2)) + 1).toString(), 2) + ' Sem ' + sem;
                        bidHist.unshift({"year": aySem, "data": []});
                        var currSem = bidHist[0]["data"];
                        var lectGrp = [];
                        var tempList = [];

                        // Extract Relevant Rows to Display in AY and Sem
                        bidInfo.forEach(function(row) {
                            if (row[12] == year && row[13] == sem) {
                                tempList.push(row);
                                if (lectGrp.indexOf(row[1]) == -1) {
                                    lectGrp.push(row[1]);
                                }
                            }
                        });

                        // Count number of Lecture Groups, Create Dictionary Output
                        var numLect = lectGrp.length;
                        for (var i = 0; i < numLect; i++) {
                            currSem.push({"bid_info":[]});
                        }

                        // Input each entry of bid points into final output
                        tempList.forEach(function(entry) {
                            var num = lectGrp.indexOf(entry[1]);
                            var bidPoints = {"bid_round": entry[11], "bid_summary":[0,0,0,0,0]}
                            for (var i = 0; i < 5; i++) {
                                bidPoints["bid_summary"][i] = parseInt(entry[i+2]);
                            }
                            currSem[num]["bid_info"].push(bidPoints);
                        });
                    }
                });
            });

            bidHist1 = [];
            if (bidHist.length > 1) {
                bidHist.forEach(function(item) {
                    if (item['data'].length > 0) {
                        bidHist1.push(item);
                    }
                });
            }
            return bidHist1
        }

        // If modCode is SS or GEM format and return output
        if (['SSA','SSB','SSD','SSS','GEK','GEM'].indexOf(modCode.slice(0, 3)) != -1) {
            var modBidData = extractData(modCode, accType);
        } else {
            // For all other modules, extract and filter the necessary data
            var modBidData = filterData(faculty, newStu, extractData(modCode, accType));
        }
        
        console.log(modBidData);
        // Format the necessary bid history
        data.bid_history_by_year = bidHistoryByYear(modBidData);

        return data;
    },
    modInfo: function(modCode, faculty) {
        // Extract the necessary module information from JSON file

        var data = {'error': {'faculty': false, 'module': false },
                    'module': modCode }; 
        // Faculty error
        if (!this.facultyList[faculty]) {
            data.error.faculty = true;
        }

        if (['FIN3101','FIN3102','FIN3103','BSP3001','MKT2401'].indexOf(modCode) != -1) {
            modCode += 'A';
        }

        // If module doesn't exist
        if (!allModulesInfo[modCode]) {
            data.error.module = true;
            if (!data.error.faculty) {
                data.suggestion = this.checkModCode(modCode);
            }
        }

        if (allModulesInfo[modCode] && !data.error.faculty) {
            var moduleInfo = allModulesInfo[modCode];
            var postfix = '_module';
            
            ['title','credit'].forEach(function(dataType) {
                if (moduleInfo[dataType]) {
                    data[dataType] = moduleInfo[dataType];
                }
            });

            ['description','preclusion','prerequisite'].forEach(function(dataType) {
                if (moduleInfo[dataType]) {
                    data[dataType] = moduleInfo[dataType];
                    if (moduleInfo[dataType + postfix]) {
                        data[dataType + postfix] = moduleInfo[dataType + postfix];
                    }
                }
            });
        }

        return data;
    },
    checkModCode: function(modCode) {
        // This function checks if the module code is valid -
        // returns suggestions for wrong codes

        // Extract total module list 
        var modList = Object.keys(allModulesInfo).sort();

        function levenshteinDist(a, b) {
            // This function calculates the Levenshtein distance
            // between two module codes (strings)
            var m = a.length;
            var n = b.length;
            var d = [];

            for (var y = 0; y <= m; y++) { 
                var li = [];
                for (var x = 0; x <= n; x++) { li.push(0); }
                d.push(li); 
            }
            for (var i = 1; i <= m; i++) { d[i][0] = i; }
            for (var i = 1; i <= n; i++) { d[0][i] = i; }

            for (var j = 1; j <= n; j++) {
                for (var i = 1; i <= m; i++) {
                    if (a[i-1] == b[j-1]) {
                        d[i][j] = d[i-1][j-1];
                    } else {
                        d[i][j] = Math.min(d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1]+1);
                    }
                }
            }

            return d[m][n];
        }

        function getModIndex(modCode, modList) {
            // Define module index
            // Find suggestions for modList
            if (modList.indexOf(modCode) != -1) {
                return modList.indexOf(modCode);
            } else {
                for (var i = 0; i < modList.length; i++) {
                    if (modCode < modList[i]) {
                        return i;
                    }
                }
            }
            return modList.length;
        }

        // Extract modules with leven distance 2 or less
        var suggestions = modList.filter(function(module) {
            return levenshteinDist(module, modCode) <= 2;
        });

        // If too many modules, score each module and take the top 3 scores
        // to filter down the number of suggested modules.
        if (suggestions.length > 3) {
            var baseIndex = getModIndex(modCode,modList);

            // Score each module based on alphabetical distance and leven distance
            // A lower score indicates a 'closer match'
            var suggestionsList = suggestions.map(function(module) {
                score = (Math.abs(getModIndex(module, modList) - baseIndex)) / (1.0*modList.length);
                score += (levenshteinDist(module, modCode)) * 1000.0;
                return [module, score];
            });

            // Extract modules with the lowest score
            suggestionsList.sort(function(a, b) {
                return a[1] - b[1];
            });

            return suggestionsList.slice(0, 3).map(function(s) {
                return s[0];
            })
        }

        suggestions.sort();
        return suggestions;
<<<<<<< HEAD
=======
<<<<<<< Updated upstream
=======
>>>>>>> route-change
    },
    extractModulesCatalogue: function() {
        var list = [];
        for (var key in allModulesInfo) {
<<<<<<< HEAD
            list.push([key, allModulesInfo[key].title]);
=======
            var title = allModulesInfo[key].title;
            if (title) {
                if (title.split(' ').length > 1) {
                    title = title.split(' ').map(function(word) {
                        word = word.toLowerCase();
                        word = word[0].toUpperCase() + word.slice(1);
                        return word;
                    }).join(' ');
                }
            }
            list.push([key, title]);
>>>>>>> route-change
        }
        return list.sort(function (a, b) {
            if (a[0] > b[0])
              return 1;
            if (a[0] < b[0])
              return -1;
            // a must be equal to b
            return 0;
        });
<<<<<<< HEAD
=======
>>>>>>> Stashed changes
>>>>>>> route-change
    }
}