# Country Explorer

Web app (HTML/CSS/JS) that fetches country data from an external API. Users can **search**, **filter by region**, and **sort** by name or population. Useful for students, travelers, and researchers.

- **Live (Load Balancer):** http://LB01_IP
- **Demo video (max 2 min):** PASTE_LINK_HERE

## API
[REST Countries API](https://restcountries.com) ([docs](https://restcountries.com/#api-endpoints-v3)). Free, **no API key needed**, so no secrets are in this repo. Thanks to the REST Countries developers.

## Run Locally
```bash
git clone https://github.com/nagasaro1-afk/country-explorer.git
cd country-explorer
python3 -m http.server 8000   # open http://localhost:8000
```

## Deploy (run on Web01 and Web02)
```bash
sudo apt update && sudo apt install -y nginx git
git clone https://github.com/nagasaro1-afk/country-explorer.git
sudo cp country-explorer/{index.html,style.css,app.js} /var/www/html/
echo 'add_header X-Served-By $hostname;' | sudo tee /etc/nginx/conf.d/served-by.conf
sudo nginx -t && sudo systemctl restart nginx
```
Update later: `cd country-explorer && git pull && sudo cp index.html style.css app.js /var/www/html/`

## Load Balancer (Lb01, HAProxy)
```bash
sudo apt update && sudo apt install -y haproxy
sudo tee -a /etc/haproxy/haproxy.cfg <<'CFG'

frontend http_front
    bind *:80
    default_backend web_servers

backend web_servers
    balance roundrobin
    server web01 WEB01_IP:80 check
    server web02 WEB02_IP:80 check
CFG
sudo haproxy -c -f /etc/haproxy/haproxy.cfg && sudo systemctl restart haproxy
```

## Test Load Balancing
```bash
for i in 1 2 3 4 5 6; do curl -sI http://LB01_IP | grep -i x-served-by; done
```
Output alternates between web-01 and web-02.

## Error Handling
API down or bad response gives a message plus Retry button. No matches gives a "no results" message. Missing fields show N/A.

## Challenges
- REST Countries v3.1 requires the `fields` parameter, so I request only the fields I need.
- API data is HTML-escaped before display to prevent XSS.
- Proved round-robin balancing with an `X-Served-By` response header.

## Credits
REST Countries API, Nginx, HAProxy.
