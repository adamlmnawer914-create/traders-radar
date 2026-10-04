import http.server
import socketserver
import os

PORT = 3000

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def guess_type(self, path):
        ctype = super().guess_type(path)
        if ctype.startswith('text/html'):
            return 'text/html; charset=utf-8'
        if ctype.startswith('text/css'):
            return 'text/css; charset=utf-8'
        if ctype.startswith('application/javascript'):
            return 'application/javascript; charset=utf-8'
        return ctype

with socketserver.TCPServer(("", PORT), NoCacheHandler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    httpd.serve_forever()
