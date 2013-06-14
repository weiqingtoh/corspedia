#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
import query

form = """
<form method="post">
    Module Code
    <br>
    <input type="text" name="modCode">
    <br>
    Faculty: <select name="faculty">
        <option value="ART">Arts</option>
        <option value="BIZ">Business</option>
        <option value="COM">Computing</option>
        <option value="SDE">Design & Environment</option>
        <option value="ENG">Engine</option>
        <option value="LAW">Law</option>
        <option value="MED">Medicine</option>
        <option value="YST">Music</option>
        <option value="SCI">Science</option>
        <option value="USP">USP</option>
    </select>
    <br><br>
    <input type="checkbox" name="newStudent" value=1>I am a New Student<br>
    <br>
    <input type="radio" name="accType" value="p" checked>P Account
    <br>
    <input type="radio" name="accType" value="g">G Account
    <br><br>
    <input type="submit">
    <br><br>
    <div style="color: red">%(error)s</div>
</form>
"""
def modValid(modCode):
    return True

def escape_html(s):
    s = s.replace('&',"&amp;")
    s = s.replace('>','&gt;')
    s = s.replace('<','&lt;')
    s = s.replace('"','&quot;')
    return s

class MainHandler(webapp2.RequestHandler):
    def write_form(self,error="",faculty=""):
        self.response.out.write(form % {'error':error,
                                        })
    
    def get(self):
        #self.response.headers['Content-Type'] = 'text/plain'
        self.write_form()
        
    def post(self):
        #Check if module code is valid
        modCode = self.request.get('modCode')
        faculty = self.request.get('faculty')
        accType = self.request.get('accType')
        newStudent = self.request.get('newStudent')

        #Check for validity of Module Code
        #If valid, move to separate handler to process query
        if modValid(modCode):
            url = '/mod?code='+modCode+'&fac=' + faculty
            url += '&acc=' + accType
            if newStudent == "1":
                url += '&new=1'
            else:
                url += '&new=0'
            self.redirect(url)
        #If invalid, redirect back to homepage
        else:
            self.write_form(error = "Invalid Module Code",
                            faculty = faculty)


class ResultsHandler(webapp2.RequestHandler):
    def get(self):
        modCode = self.request.get('code')
        if not modValid(modCode):
            self.redirect('/')
        faculty = self.request.get('fac')
        accType = self.request.get('acc')
        newStudent = self.request.get('new')
        self.response.out.write(query.extract(modCode,faculty,accType,
                                              newStudent))

app = webapp2.WSGIApplication([('/', MainHandler),
                               ('/mod', ResultsHandler)],
                              debug=True)
