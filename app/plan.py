import os
from http.server import BaseHTTPRequestHandler, HTTPServer

PORT_NUMBER = 8080

FILE_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = '/'.join(FILE_DIR.split('/')[:-1])

HEADER_MAP = {
    'png': 'image/png',
    'jpg': 'image/jpg',
    'js': 'text/javascript',
    'css': 'text/css',
    '': 'text/html'
}


class myHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        """Handles the GET requests."""
        resource = self.path
        # read the html to be displayed
        with open(BASE_DIR + '/templates/base.html') as f:
            self.html_tempalte = f.read()

        content, content_type = self.handle_request(self.path)

        self.send_response(200)
        self.send_header('Content-type', content_type)
        self.end_headers()
        self.wfile.write(content)

    def handle_request(self, path):
        """Returns the content type and the content according to the given path."""
        # extention is blank if no resource is requested
        extention = self.path.split('/')[-1].split('.')[-1]

        if extention in ["jpg", "png"]:
            # read images as binary files
            with open(BASE_DIR + path, 'rb') as f:
                content = f.read()
        elif extention in ['css', 'js']:
            # encode strings
            with open(BASE_DIR + path, 'r') as f:
                content = f.read().encode('utf-8')
        else:
            with open(BASE_DIR + '/templates/base.html') as f:
                content = f.read().encode('utf-8')

        try:
            # content type according to the extention
            content_type = HEADER_MAP[extention]
        except KeyError:
            content_type = 'text/plain'

        return content, content_type


def run():
    try:
        # Create a web server and define the handler to manage the
        # incoming request
        server = HTTPServer(('', PORT_NUMBER), myHandler)
        print('Started httpserver on port ', PORT_NUMBER)

        # Wait forever for incoming htto requests
        server.serve_forever()

    except KeyboardInterrupt:
        server.socket.close()


if __name__ == '__main__':
    run()
