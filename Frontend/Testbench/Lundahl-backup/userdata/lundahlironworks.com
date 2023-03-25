--- 
customlog: 
  - 
    format: combined
    target: /etc/apache2/logs/domlogs/lundahlironworks.com
  - 
    format: "\"%{%s}t %I .\\n%{%s}t %O .\""
    target: /etc/apache2/logs/domlogs/lundahlironworks.com-bytes_log
documentroot: /home/lundahl2600/public_html
group: lundahl2600
hascgi: 0
homedir: /home/lundahl2600
ifmodulealiasmodule: 
  scriptalias: 
    - 
      path: /home/lundahl2600/public_html/cgi-bin/
      url: /cgi-bin/
ifmoduleincludemodule: 
  directoryhomelundahlpublichtml: 
    ssilegacyexprparser: 
      - 
        value: " On"
ifmoduleitkc: {}

ifmodulemodincludec: 
  directoryhomelundahlpublichtml: 
    ssilegacyexprparser: 
      - 
        value: " On"
ifmoduleuserdirmodule: 
  ifmodulempmitkc: 
    ifmoduleruidmodule: {}

ip: 173.201.189.110
owner: gdresell
phpopenbasedirprotect: 1
port: 80
scriptalias: 
  - 
    path: /home/lundahl2600/public_html/cgi-bin
    url: /cgi-bin/
serveradmin: webmaster@lundahlironworks.com
serveralias: mail.lundahlironworks.com www.lundahlironworks.com
servername: lundahlironworks.com
usecanonicalname: 'Off'
user: lundahl2600
userdirprotect: ''
