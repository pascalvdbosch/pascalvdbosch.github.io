
import markdown
with open("all.md", "r", encoding="utf-8") as f:
    text = f.read()

html = markdown.markdown(text, tab_length=2)

html = html.replace("<code>", "<code style='font-family:monospace'>")
html = "<style>body { font-family: sans-serif }</style>" + html
with open("all.html", "w", encoding="utf-8") as f:
    f.write(html)

from bs4 import BeautifulSoup
from bs4.element import Comment
import urllib.request

from gensim.summarization import keywords

def tag_visible(element):
    return not (element.parent.name in ['style', 'script', 'head', 'title', 'meta', '[document]'] or isinstance(element, Comment))
def text_from_html(body):
    soup = BeautifulSoup(body, 'html.parser')
    texts = soup.findAll(text=True)
    visible_texts = filter(tag_visible, texts)  
    return u" ".join(t.strip() for t in visible_texts)

for i in range(1, 7):
    print(i)
    with open('les' + str(i) + '.html', 'r', encoding="UTF8") as f:
        print(keywords(text_from_html(html), words=20))

