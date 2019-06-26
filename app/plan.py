import os
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer

PORT_NUMBER = 8080


# This class will handles any incoming request from
# the browser
class myHandler(BaseHTTPRequestHandler):

    # Handler for the GET requests
    def do_GET(self):
        # get the directory of the root of the project
        file_dir = os.path.dirname(os.path.abspath(__file__))
        root_dir = '/'.join(file_dir.split('/')[:-1])

        # read the html to be displayed
        with open(root_dir + '/templates/base.html') as f:
            self.html_tempalte = f.read()

        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        # Send the html message
        self.wfile.write(self.html_tempalte)


try:
    # Create a web server and define the handler to manage the
    # incoming request
    server = HTTPServer(('', PORT_NUMBER), myHandler)
    print('Started httpserver on port ', PORT_NUMBER)

    # Wait forever for incoming htto requests
    server.serve_forever()

except KeyboardInterrupt:
    server.socket.close()
