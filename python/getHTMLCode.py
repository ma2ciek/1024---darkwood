import requests

url = "http://www.uw-team.org/hm2/1234.html"

res = requests.get(url)

f = open('dest.html', 'w');
f.writelines(res.text);