from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import mysql.connector

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def queryGenerator(request):
    yearQuery = request.args.get('year')
    topicQuery = request.args.get('topic')
    sectorQuery = request.args.get('sector')
    pestQuery = request.args.get('pest')
    regionQuery = request.args.get('region')

    extraQuery = ""
    if (yearQuery != "" or topicQuery != "" or sectorQuery != "" or pestQuery != "" or regionQuery != ""):
        extraQuery += " WHERE"
    if yearQuery != "":
        extraQuery += " start_year='"+yearQuery+"'"
    if topicQuery != "":
        if yearQuery != "":extraQuery += " AND"
        extraQuery += " topic='"+topicQuery+"'"
    if sectorQuery != "":
        if yearQuery != "" or topicQuery != "":extraQuery += " AND"
        extraQuery += " sector='"+sectorQuery+"'"
    if pestQuery != "":
        if yearQuery != "" or topicQuery != "" or sectorQuery != "":extraQuery += " AND"
        extraQuery += " pestle='"+pestQuery+"'"
    if regionQuery != "":
        if yearQuery != "" or topicQuery != "" or sectorQuery != "" or pestQuery != "":extraQuery += " AND"
        extraQuery += " region='"+regionQuery+"'"

    return extraQuery

# def mergeSort(arr,freqArr,start,end):
#     mid = (start+end)/2
#     mergeSort(arr,start,mid)
#     mergeSort(arr,mid+1,end)
#     p = start
#     q = mid+1
#     tempArr = []
#     for i in range(start,end+1):
#         if (p>mid):
#             tempArr.append(arr[q])
#             q+=1
#         elif (q>end):
#             tempArr.append(arr[p])
#             p+=1
#         elif (freqArr[arr[p]]>freqArr[arr[q]]):
#             tempArr.append(arr[q])
#             q+=1
#         else:
#             tempArr.append(arr[p])
    
#     for i in range(0,len(tempArr)):
#         arr[start] = tempArr[i]
#         start+=1
#         i+=1

@app.route('/getCountries', methods=['GET'])
def getCountires():
    extraQuery = queryGenerator(request)
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="test"
    )
    mycursor = mydb.cursor()
    mycursor.execute("SELECT country FROM blackcoffer"+extraQuery)
    result = mycursor.fetchall()
    CountryArtcleCount = {}
    for x in result:
        if x[0] != "":
            if (x[0] not in CountryArtcleCount.keys()):
                CountryArtcleCount[x[0]] = 1
            else: 
                CountryArtcleCount[x[0]] = CountryArtcleCount[x[0]] + 1
    countries = []
    data = []
    keys = list(CountryArtcleCount.keys())
    for i in range(0,len(keys)):
        countries.append(keys[i])
        data.append(CountryArtcleCount[keys[i]])

    msg = "SUCCESS"
    if (not countries):
        msg = "NO RECORDS FOUND"
        
    response = {
        "status": True,
        "message": msg,
        "result": [countries, data]
    }
    mycursor.close()
    mydb.close()
    return jsonify(response)

@app.route('/getYears', methods=['GET'])
def getYears():
    extraQuery = queryGenerator(request)
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="test"
    )
    mycursor = mydb.cursor()
    mycursor.execute("SELECT start_year,end_year FROM blackcoffer"+extraQuery)
    result = mycursor.fetchall() 
    yearArtcleCount = {}
    for x in result:
        if x[0] != "" and x[1] != "":
            for i in range(int(x[0]), int(x[1])+1):
                y = str(i)
                if (y not in yearArtcleCount.keys()):
                    yearArtcleCount[y] = 1
                else: 
                    yearArtcleCount[y] = yearArtcleCount[y] + 1
        else :
            for y in x:
                if (y != ""):
                    if (y not in yearArtcleCount.keys()):
                        yearArtcleCount[y] = 1
                    else: 
                        yearArtcleCount[y] = yearArtcleCount[y] + 1
    years = []
    data = []
    keys = list(yearArtcleCount.keys())
    keys.sort()
    for i in range(0,len(keys),10):
        start = i
        end = i+9
        if (end > len(keys)-1):
            end = len(keys)-1
        years.append(keys[start]+'-'+keys[end])
        sum = 0
        for j in range(start,end+1):
            sum += yearArtcleCount[keys[j]]
        data.append(sum)

    msg = "SUCCESS"
    if (not years):
        msg = "NO RECORDS FOUND"
        
    response = {
        "status": True,
        "message": msg,
        "result": [years,data]
    }
    mycursor.close()
    mydb.close()
    return jsonify(response)

@app.route('/getThreeQuality', methods=['GET'])
def getThreeQuality():
    extraQuery = queryGenerator(request)
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="test"
    )
    mycursor = mydb.cursor()
    mycursor.execute("SELECT start_year,end_year,intensity,relevance,likelihood,topic FROM blackcoffer"+extraQuery)
    result = mycursor.fetchall()
    yearArtcleCount = {}
    for x in result:
        if x[0] != "" and x[1] != "":
            for i in range(int(x[0]), int(x[1])+1):
                y = str(i)
                if (y not in yearArtcleCount.keys()):
                    yearArtcleCount[y] = [1, x[2], x[3], x[4], [x[5]]]
                else: 
                    yearArtcleCount[y][0] = yearArtcleCount[y][0] + 1
                    yearArtcleCount[y][1] = yearArtcleCount[y][1] + x[2]
                    yearArtcleCount[y][2] = yearArtcleCount[y][2] + x[3]
                    yearArtcleCount[y][3] = yearArtcleCount[y][3] + x[4]
                    yearArtcleCount[y][4] = yearArtcleCount[y][4] + [x[5]]
        else :
            for y in x[:2]:
                if (y != ""):
                    if (y not in yearArtcleCount.keys()):
                        yearArtcleCount[y] = [1, x[2], x[3], x[4], [x[5]]]
                    else: 
                        yearArtcleCount[y][0] = yearArtcleCount[y][0] + 1
                        yearArtcleCount[y][1] = yearArtcleCount[y][1] + x[2]
                        yearArtcleCount[y][2] = yearArtcleCount[y][2] + x[3]
                        yearArtcleCount[y][3] = yearArtcleCount[y][3] + x[4]
                        yearArtcleCount[y][4] = yearArtcleCount[y][4] + [x[5]]
    for keys in yearArtcleCount.keys():
        yearArtcleCount[keys][4] = list(set(yearArtcleCount[keys][4]))
        try:
            yearArtcleCount[keys][4].remove("")
        except ValueError:
            pass
        yearArtcleCount[keys][1] = yearArtcleCount[keys][1]/yearArtcleCount[keys][0]
        yearArtcleCount[keys][2] = yearArtcleCount[keys][2]/yearArtcleCount[keys][0]
        yearArtcleCount[keys][3] = yearArtcleCount[keys][3]/yearArtcleCount[keys][0]
        yearArtcleCount[keys] = yearArtcleCount[keys][1:]

    years = []
    intensity = []
    relevance = []
    likelihood = []
    topics = []
    keys = list(yearArtcleCount.keys())
    keys.sort()
    for i in range(0,len(keys),4):
        start = i
        end = i+3
        if (end > len(keys)-1):
            end = len(keys)-1
        years.append(keys[start]+'-'+keys[end])
        intensitySum = 0
        relevanceSum = 0
        likelihoodSum = 0
        topicList = []
        for j in range(start,end+1):
            intensitySum += yearArtcleCount[keys[j]][0]
            relevanceSum += yearArtcleCount[keys[j]][1]
            likelihoodSum += yearArtcleCount[keys[j]][2]
            topicList += yearArtcleCount[keys[j]][3]

        intensitySum /= (end-start+1)
        intensitySum = int(intensitySum)
        relevanceSum /= (end-start+1)
        relevanceSum = int(relevanceSum)
        likelihoodSum /= (end-start+1)
        likelihoodSum = int(likelihoodSum)
        topicList = list(set(topicList))

        intensity.append(intensitySum)
        relevance.append(relevanceSum)
        likelihood.append(likelihoodSum)
        topics.append(topicList)

    msg = "SUCCESS"
    if (not years):
        msg = "NO RECORDS FOUND"
        
    response = {
        "status": True,
        "message": msg,
        "result": [years,intensity,relevance,likelihood,topics]
    }
    mycursor.close()
    mydb.close()
    return jsonify(response)
    
@app.route('/getRegion', methods=['GET'])
def getRegion():
    extraQuery = queryGenerator(request)
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="test"
    )
    mycursor = mydb.cursor()
    mycursor.execute("SELECT region FROM blackcoffer"+extraQuery)
    result = mycursor.fetchall()
    RegionArtcleCount = {}
    for x in result:
        if x[0] != "":
            if (x[0] not in RegionArtcleCount.keys()):
                RegionArtcleCount[x[0]] = 1
            else: 
                RegionArtcleCount[x[0]] = RegionArtcleCount[x[0]] + 1
    regions = []
    data = []
    keys = list(RegionArtcleCount.keys())
    for i in range(0,len(keys)):
        regions.append(keys[i])
        data.append(RegionArtcleCount[keys[i]])
        
    msg = "SUCCESS"
    if (not regions):
        msg = "NO RECORDS FOUND"
        
    response = {
        "status": True,
        "message": msg,
        "result": [regions, data]
    }
    mycursor.close()
    mydb.close()
    return jsonify(response)

@app.route('/getTopSevenTopics', methods=['GET'])
def getTopSevenTopics():
    extraQuery = queryGenerator(request)
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="test"
    )
    mycursor = mydb.cursor()
    mycursor.execute("SELECT topic FROM blackcoffer"+extraQuery)
    result = mycursor.fetchall()
    TopicCount = {}
    for x in result:
        if x[0] != "":
            if (x[0] not in TopicCount.keys()):
                TopicCount[x[0]] = 1
            else: 
                TopicCount[x[0]] = TopicCount[x[0]] + 1
    topics = []
    data = []
    keys = list(TopicCount.keys())
    for i in range(0,len(keys)):
        for j in range(i+1,len(keys)):
            if (TopicCount[keys[i]] > TopicCount[keys[j]]):
                temp = keys[i]
                keys[i] = keys[j]
                keys[j] = temp
    for i in range(len(keys)-1,len(keys)-8,-1):
        if i<0: break
        topics.append(keys[i])      
        data.append(TopicCount[keys[i]])
        
    msg = "SUCCESS"
    if (not topics):
        msg = "NO RECORDS FOUND"
        
    response = {
        "status": True,
        "message": msg,
        "result": [topics, data]
    }
    mycursor.close()
    mydb.close()
    return jsonify(response)

@app.route('/averageQuality', methods=['GET'])
def averageQuality():
    extraQuery = queryGenerator(request)
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="test"
    )
    mycursor = mydb.cursor()
    mycursor.execute("SELECT intensity,likelihood,relevance FROM blackcoffer"+extraQuery)
    result = mycursor.fetchall()
    averages = {"Intensity":0,"Likelihood":0,"Relevance":0}
    for x in result:
        averages["Relevance"] += x[2]
        averages["Likelihood"] += x[1]
        averages["Intensity"] += x[0]
    
    if (len(result)):
        averages["Relevance"] /= len(result)
        averages['Likelihood'] /= len(result)
        averages['Intensity'] /= len(result)

    msg = "SUCCESS"
    if (averages["Intensity"] == 0 and averages["Likelihood"] == 0 and averages["Relevance"] == 0):
        msg = "NO RECORDS FOUND"
        
    response = {
        "status": True,
        "message": msg,
        "result": averages
    }
    mycursor.close()
    mydb.close()
    return jsonify(response)

@app.route('/getOptions', methods=['GET'])
def getOptions():
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="test"
    )
    mycursor = mydb.cursor()
    mycursor.execute("SELECT start_year,topic,sector,region,pestle FROM blackcoffer")
    result = mycursor.fetchall()
    yearList  = []
    topicList = []
    sectorList = []
    regionList = []
    pestleList = []
    for x in result:
        if x[0] != "":yearList += [x[0]]
        if x[1] != "":topicList += [x[1]]
        if x[2] != "":sectorList += [x[2]]
        if x[3] != "":regionList += [x[3]]
        if x[4] != "":pestleList += [x[4]]
    
    yearList = list(set(yearList))
    yearList.sort()
    topicList = list(set(topicList))
    topicList.sort()
    sectorList = list(set(sectorList))
    sectorList.sort()
    regionList = list(set(regionList))
    regionList.sort()
    pestleList = list(set(pestleList))
    pestleList.sort()

    msg = "SUCCESS"
    if (not yearList):
        msg = "NO RECORDS FOUND"
        
    response = {
        "status": True,
        "message": msg,
        "result": [yearList,topicList,sectorList,regionList,pestleList]
    }
    mycursor.close()
    mydb.close()
    return jsonify(response)
if __name__ == '__main__':
    app.run()

