#!/usr/bin/env python
#
# Copyright 2009 Facebook
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.
import sys
import logging
import tornado.auth
import tornado.escape
import tornado.ioloop
import tornado.options
import tornado.web
import os.path
import uuid
import json
import pprint
import pymongo

from  tornado.escape import json_decode
from  tornado.escape import json_encode

from tornado.options import define, options

define("port", default=8000, help="run on the given port", type=int)

class Application(tornado.web.Application):
    def __init__(self):
        PATH = os.path.dirname(sys.argv[0])
        static_path = os.path.join(PATH, 'static')
        template_path = os.path.join(PATH, 'template')

        handlers = [
            (r'/static/(.*)', tornado.web.StaticFileHandler, {'path': static_path}),
            (r'/template/(.*)', tornado.web.StaticFileHandler, {'path': template_path}),
            
            (r"/", MainHandler),
            (r"/getUserList", GetUserList),
            (r"/add", AddHandler),
            (r"/review/", ReviewHandler),
            (r"/edit/([0-9Xx\-]+)", EditHandler),
            (r"/delete/([0-9Xx\-]+)", DelHandler),
        ]
        settings = dict(
            template_path=os.path.join(os.path.dirname(__file__), "template"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            debug=True,
            )
        conn = pymongo.MongoClient("localhost", 27017)
        self.db = conn["demo2"]
        tornado.web.Application.__init__(self, handlers, **settings)

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        print "--> MainHandler"
        self.render("index.html")

class GetUserList(tornado.web.RequestHandler):
    def get(self):
        print "--> GetUserList"

        coll = self.application.db.blog
        blogs = coll.find().sort("index",pymongo.DESCENDING)

        response = []
        for blog in blogs:
            response.append([blog["index"], blog["name"], blog['birth'], blog['id']])

        self.write(json.dumps(response))

class ReviewHandler(tornado.web.RequestHandler):
    def get(self):
        # set cookie
        self.render("review.html")

# Working on
class AddHandler(tornado.web.RequestHandler):
    def get(self):
        # set cookie
        self.render("edit.html")

    def post(self):
        json_obj = json_decode(self.request.body)

        for key in json_obj.keys():
            print('key: %s , value: %s' % (key, json_obj[key]))

        coll = self.application.db.blog
        last = coll.find().sort("index",pymongo.DESCENDING).limit(1)

        lastone = 0
        for obj in last:
            print obj
            lastone = int(obj['index'][0])
        
        blog = {}
        blog['index'] = lastone + 1,
        blog['name'] = json_obj['name'],
        blog['birth'] = json_obj['birth'],
        blog['id'] = json_obj['id']
        # blog['id'] = lastone + 1
        coll.insert(blog)

        response = {}
        response['status'] = 'true'
        response['info'] = ''

        self.write(json.dumps(response))
        # self.redirect("/")

class EditHandler(tornado.web.RequestHandler):
    def get(self, id=None):
        blog = dict()
        coll = self.application.db.blog
        blog = coll.find_one({"id": int(id)})
        # set cookie
        self.render("edit.html")

    def post(self, id=None):
        json_obj = json_decode(self.request.body)

        if id:
            blog = coll.find_one({"id": int(id)})   
            # blog['index'] = index
            blog['name'] = json_obj['name'],
            blog['birth'] = json_obj['birth']
            blog['id'] = json_obj['id']
            coll.save(blog)
            self.redirect("/")
        else:
            print "Invalid id"

class DelHandler():
    def delete(self, id=None):
        if id:
            coll = self.application.db.blog
            blog = coll.remove({"id": int(id)})
            self.redirect("/")
        else:
            print "Invalid id"

class TestHandler(tornado.web.RequestHandler):
    def post(self):
        json_obj = json_decode(self.request.body)
        print('Post data received')

        for key in list(json_obj.keys()):
            print('key: %s , value: %s' % (key, json_obj[key]))

        # new dictionary
        response_to_send = {}
        response_to_send['newkey'] = json_obj['key1']

        print('Response to return')

        pprint.pprint(response_to_send)

        self.write(json.dumps(response_to_send))

def cleanDB():
    coll = self.application.db.blog
    coll.delete_many({})

def main():
    tornado.options.parse_command_line()
    app = Application()
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()
    # cleanDB()

