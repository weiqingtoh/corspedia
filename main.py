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
import json
import webapp2
import query
import os
import re
import jinja2

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'])

def modValid(modCode):
    match = re.search(r'[a-zA-Z]{2,3}[\d]{4}[a-zA-Z]{0,1}', modCode)
    return match

def escape_html(s):
    s = s.replace('&',"&amp;")
    s = s.replace('>','&gt;')
    s = s.replace('<','&lt;')
    s = s.replace('"','&quot;')
    return s

class MainHandler(webapp2.RequestHandler):
    
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('index.html')
        self.response.write(template.render({'error': ''}))

    def post(self):
        #Check if module code is valid
        modCode = self.request.get('modCode')
        faculty = self.request.get('faculty')
        accType = self.request.get('accType')
        newStudent = self.request.get('newStudent')

        #Check for validity of Module Code - if Valid, proceed, else return error
        code = modValid(modCode)
        if code:
            url = '/mod?code='+code.group()+'&fac=' + faculty + '&acc=' 
            url += accType + '&new='
            if newStudent == "1":
                url += '1'
            else:
                url += '0'
            self.redirect(url)
        #If invalid, redirect back to homepage
        else:
            template = JINJA_ENVIRONMENT.get_template('index.html')
            self.response.write(template.render({'error': 'Invalid Module Code', 'faculty': faculty}))

class ResultsHandler(webapp2.RequestHandler):
    
    def get(self):
        modCode = self.request.get('code')
        if not modValid(modCode):
            self.redirect('/')
        faculty = self.request.get('fac')
        accType = self.request.get('acc')
        newStudent = self.request.get('new')
        self.response.out.write(json.dumps(query.extract(modCode,faculty,accType,
                                              newStudent)))

app = webapp2.WSGIApplication([('/', MainHandler),
                               ('/mod', ResultsHandler)],
                              debug=True)
