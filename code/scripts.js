// replace "^\\s*" with "" in highlightcshtmlrazor.js

// insert the CSS
{
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', 'code/css.css');
    document.getElementsByTagName('head')[0].appendChild(link);
}

let meta = (name) => document.querySelector("meta[name='" + name + "']");
let metaget = (name) => meta(name).getAttribute('content');
let metaset = (name, val) => meta(name).setAttribute('content', val);
let metanew = (name, val) => {
    var m = document.createElement('meta');
    m.setAttribute('name', name);
    m.content = val;
    document.getElementsByTagName('head')[0].appendChild(m);
}
// set meta tags
{   
    // dit is standaard in HTML5: <meta charset="utf-8">
    metanew("viewport", "width=device-width, initial-scale=1.0");
    metanew("author", "Pascal van den Bosch");    
}


// insert repeating slides
{
let map = {};
for (let e of document.querySelectorAll("section"))
    if (e.hasAttribute("name"))
        map[e.getAttribute("name")] = e.innerHTML;
for (let e of document.querySelectorAll("section"))
    if (e.hasAttribute("repeat"))
        e.innerHTML = map[e.getAttribute("repeat")];
}

// insert the vscode and vs icons inline
for (let e of document.querySelectorAll("img")) {
    if (e.hasAttribute("vscode")) {
        e.setAttribute("style", "display:inline-block;height:1em;margin:0px;vertical-align: middle;transform:translate(0,-.08em)");
        e.setAttribute("alt", "VS Code logo");
        e.setAttribute("src", "img/vscode.png");
    }
    if (e.hasAttribute("vs")) {
        e.setAttribute("style", "display:inline-block;height:1em;margin:0px;vertical-align: middle;transform:translate(0,-.08em)");
        e.setAttribute("alt", "VS logo");
        e.setAttribute("src", "img/vs.png");
    }
}

let myslides = document.querySelector("i-slides");

// voeg les overzicht toe
{
    let lesoverzicht = document.createElement("section");
    let lis = [...document.querySelectorAll("section[h2]")].map((e) => "<li>" + e.getAttribute("h2") + "</li>").join("");
    lesoverzicht.innerHTML = `
    <h2>Vandaag op het programma</h2>
    <ul>` + lis + `</ul>`;
    myslides.insertBefore(lesoverzicht, myslides.firstChild);
}

let lesnr = parseInt(metaget("description").match(/Les\ (\d+)/)[1]);

// voeg wpfw overzicht toe
{
    let wpfwoverzicht = document.createElement("section");
    wpfwoverzicht.innerHTML = `
    <h2>Waar staan we?</h2>
    <ol>
        <li>Frontend: HTML, CSS, Javascript </li>
        <li>Frontend: Bootstrap </li>
        <li>Backend: C#</li>
        <li>MVC</li>
        <li>Backend: C# LINQ</li>
        <li>ORM</li>
        <li>Testen</li>
        <li>Layout</li>
        <li>Security</li>
        <li>Zoeken/filteren, Sorteren, Pagineren</li>
        <li>Web API, JSON, Ajax, Azure</li>
        <li>Architectuur</li>
    </ol>`;

    myslides.insertBefore(wpfwoverzicht, myslides.firstChild);
    // highlight de huidige les
    let huidig = wpfwoverzicht.querySelectorAll("li").item(lesnr - 1);
    huidig.innerHTML = "<b>" + huidig.innerHTML + "</b>";
}

// voeg voorpagina toe
{
    let voorpagina = document.createElement("section"); 
    voorpagina.innerHTML = `
    Klik <a href="les` + lesnr + `.pdf">hier</a> voor pdf...
    <svg id='titlewordcloud' class='wordcloud' width='100%' height='500px' data=''></svg>
    <h1 id='title'></h1>
    <p>
        <small id='subtitle'></small>
    </p>
    `; // <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>
    myslides.insertBefore(voorpagina, myslides.firstChild);
    
    document.getElementById("titlewordcloud").setAttribute("data", metaget("keywords"));
    document.getElementById("subtitle").innerHTML = metaget("description") + " Webdevelopment";
    document.getElementById("title").innerHTML = document.getElementsByTagName("title")[0].innerHTML; 
}

// <i-slides> = <div class="slides">
window.customElements.define('i-slides', class extends HTMLElement {
    constructor() {
        super(); 
        this.classList.add("slides");
    }
});

// <i-notes> = <div><aside class=\"notes\">
window.customElements.define('i-notes', class extends HTMLElement {
    constructor() {
        super(); 
        this.innerHTML = "<aside class=\"notes\">" + this.innerHTML + "</aside>";
    }
});

// <i-code> and <i-icode>
{
    let hllangs = {
        "js": null, 
        "cs": null, 
        "sql": null, 
        "css": null, 
        "java": null, 
        "xml": null, 
        "url": null, 
        "cshtml": "cshtml-razor", 
        "json": null, 
        "fname": null, 
        "html": null, 
        "http": null, 
        "plaintext": null, 
        "powershell": "powershellshell"
    }
    function getclass(e) {
        let cls = "";
        for (const [k, v] of Object.entries(hllangs))
            if(e.hasAttribute(k))
                if (v == null) cls = k; else cls = v;
        if (cls == "") cls = "plaintext";
        return cls;
    }
    
    // <i-code> = <div><pre><code>
    window.customElements.define('i-code', class extends HTMLElement {
        constructor() {
            super(); 
            this.style.margin = "auto";
            let cls = getclass(this);
            //  style='width:100%;'
            let style = this.getAttribute("style");
            if (!this.hasAttribute("autofit") && this.hasAttribute("autofit")==false)
                style += 'width:initial;display:table;';
            // if (this.hasAttribute("size") && this.getAttribute("size") == "normal")
            if (this.hasAttribute("size") && this.getAttribute("size") == "smaller")
                style += 'font-size: .7em;';
            else if (this.hasAttribute("size") && this.getAttribute("size") == "small")
                style += 'font-size: .5em;';
            else
                style += 'font-size: inherit;';
            let style2 = "";
            if (this.hasAttribute("height"))
                style2 += "height:" + this.getAttribute("height");
            let extra = "";
            if (this.hasAttribute("data-line-numbers"))
                extra += "data-line-numbers='" + this.getAttribute("data-line-numbers") + "'"
            this.innerHTML = "<pre style='" + style + "'><code style='" + style2 + "' class=\"" + cls + "\" data-trim data-noescape " + extra + ">" + this.innerHTML + "</code></pre>";
        }
    });
    
    // <i-icode> = <div><code>
    window.customElements.define('i-icode', class extends HTMLElement {
        constructor() {
            super(); 
            this.style.margin = "0pt";
            let cls = getclass(this);
            //  style='width:100%;'
            this.innerHTML = "<code style=\"display:inline\" class=\"" + cls + " hljs\">" + this.innerHTML + "</code>";
        }
    });    
}

// <i-def> -> italic
window.customElements.define('i-def', class extends HTMLElement {
    constructor() {
        super(); 
        this.style.fontStyle = "italic";
    }
});

// Insert headings in sections
document.querySelectorAll("section").forEach(function(node) {
    for (i = 1; i < 8; i++)
        if (node.hasAttribute("h" + i)) {
            let h = document.createElement("h" + i);
            h.innerHTML = node.getAttribute("h" + i);
            node.insertBefore(h, node.firstChild);
        }
});

// <tag frag=...> = <tag class="fragment" data-fragment-index=...>
// if inside r-stack, use fade-in-then-out
document.querySelectorAll("[frag]").forEach(function(node) {
    if (node.getAttribute('frag') != "")
        node.setAttribute("data-fragment-index", node.getAttribute('frag'));
    node.classList.add("fragment");
    node.removeAttribute("frag");
    if (node.parentElement.classList.contains("r-stack"))
        if (!node.nextElementSibling)
            node.classList.add("fade-in-then-out");
});

// xxxx
for (let ol of document.querySelectorAll("section[data-quiz] ol"))
    ol.style.listStyleType = "upper-latin";

// htmltester
{
    function mytrim(s) {
        let indentation = (st) => st.match(/^\ */)[0].length;
        let ret = '';
        let count = null;
        for (let line of (s.replace('\r', '') + '\n').split("\n"))
            if (line.match(/^\ *$/) == null || count != null) {
                if (count == null)
                    count = indentation(line);
                if (indentation(line.substr(0, count)) == count)
                    ret += line.substr(count) + '\n';
                else
                    ret += line + '\n';
            }
        return ret.substr(0, ret.length - 1).trim();
    }
    
    fetch('htmltester.html')
        .then((response) => response.text())
            .then((htmltester) => {
                for (let o of document.querySelectorAll('[htmltester]'))
                    o.srcdoc = htmltester
                        .replace("###ORIENTATION###", (o.hasAttribute('vertical') ? 'vertical' : 'horizontal'))
                        .replace("###CODE###", mytrim(o.textContent.replace(/<!-- Code injected by live-server[^<]+<[^<]+<[^<]+<[^<]+<[^<]+<[^<]+/, '')));
            }); 
}

var runJS = (url) => new Promise((resolve, reject) => {
    var script = document.createElement('script');
    script.src = url;
    script.charset = "UTF-8"; 
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
});

// code/revealjs/dist/reveal.js ...EDITED... at "Date.now()-this.lastMouseWheelStep" set the threshold to 0, and added "&&!e.altKey"
// code/revealjs/plugin/highlight/highlight.js ...EDITED... replace "pre code" by "code"

Promise.all([
    runJS("https://kit.fontawesome.com/16c32b8074.js"),
    /*runJS("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/codemirror.min.js").then(() => Promise.all([
        runJS("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/mode/htmlmixed/htmlmixed.min.js"),
        runJS("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/mode/xml/xml.min.js"),
        runJS("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/mode/javascript/javascript.min.js"),
        runJS("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/mode/css/css.min.js")]).then(() => {
            for (let q of document.querySelectorAll("textarea[html]"))
                CodeMirror.fromTextArea(q, {mode: "htmlmixed", theme: "eclipse"});
        })),*/
    runJS('https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.min.js').then(() => 
        runJS('https://cdnjs.cloudflare.com/ajax/libs/d3-cloud/1.2.5/d3.layout.cloud.min.js')),
    runJS('code/revealjs/dist/reveal.js').then(() => Promise.all([
        runJS('https://cdnjs.cloudflare.com/ajax/libs/d3-cloud/1.2.5/d3.layout.cloud.min.js'),
        runJS('code/revealjs/plugin/zoom/zoom.js'),
        runJS('code/revealjs/plugin/notes/notes.js'),
        runJS('code/revealjs/plugin/search/search.js'),
        runJS('code/revealjs/plugin/markdown/markdown.js'),
        runJS('code/revealjs/plugin/highlight/highlight.js').then(() => 
            runJS('code/highlightcshtmlrazor.js')),
        runJS('code/revealjs/plugin/menu/menu.js'),
        runJS('code/revealjs/plugin/chart/Chart.min.js').then(() => 
            runJS('code/revealjs/plugin/chart/plugin.js')),
        runJS('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js').then(() => 
            runJS('https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js')).then(() => {
                let el = document.createElement("div");
                el.id = "quizwindow";
                el.style.boxSizing = "border-box"; 
                el.style.width = "200px"; 
                el.classList.add("draggable");
                el.classList.add("ui-widget-content");
                el.innerHTML = "<div style='width:100%;box-sizing: border-box;height:16px;background-color:gray;'><div style='width:16px;box-sizing: border-box;height:16px;background-color:black;' onclick='toggleQuiz()'></div></div><iframe style='max-width:100%;width:100%;max-height:100%;height:calc(100% - 16px);box-sizing: border-box;' id='quizwindowiframe'></iframe>";
                el.style.display = "none";
                el.style.zIndex = "30";
                el.style.fontSize = "12"; 
                el.style.marin = "0"; 
                document.querySelector(".reveal").appendChild( el );
                $( function() {
                    $( ".draggable" ).draggable({
                    start: () => document.getElementById("quizwindowiframe").style.display = "none",
                    stop: () => document.getElementById("quizwindowiframe").style.display = ""});
                    $( ".draggable" ).resizable({
                        start: () => document.getElementById("quizwindowiframe").style.display = "none",
                        stop: () => document.getElementById("quizwindowiframe").style.display = ""});
                } );
            }),
        runJS('code/revealjs/plugin/chalkboard/plugin.js')]))]).then(() => {
    function hexToRgb(hex) {
        var i = parseInt(hex, 16);
        return ((i >> 16) & 255) + "," + ((i >> 8) & 255) + "," + (i & 255);
    }
    
    Reveal.initialize({
        controls: true,
        progress: true,
        center: true,
        mouseWheel: true,
        hash: true,
        width: 1920,
        height: 1080, 
        transitionSpeed: 'fast',
        slideNumber: false,
        chalkboard: {
            theme: "whiteboard",
            grid: { color: 'rgb(50,50,10,0.5)', distance: 80, width: 2},
            toggleChalkboardButton: false,
            toggleNotesButton: { left: "130px" },
        },    
        plugins: [
            RevealZoom, 
            RevealNotes, 
            RevealSearch, 
            RevealMarkdown, 
            RevealHighlight,
            RevealMenu,
            RevealChalkboard,
            RevealChart], 
        chart: {
                defaults: { 
                    global: { 
                        animation: {duration: 2000},
                        title: { fontColor: "#000" }, 
                        legend: {
                            position: "bottom",
                            labels: { fontColor: "#000", fontSize: 40 }
                        },
                        tooltips: {
                            labels: { fontColor: "#000", fontSize: 40 },
                        },
                    }, 
                    scale: { 
                        scaleLabel: { fontColor: "#000" }, 
                        gridLines: { color: "#000", zeroLineColor: "#000" }, 
                        ticks: { fontColor: "#000", fontSize: 40 }, 
                    } 
                },
                line: { borderWidth: [ 5 ], borderColor: [
                    "rgba(" + hexToRgb("003f5c") + ",1)",
                    "rgba(" + hexToRgb("58508d") + ",1)",
                    "rgba(" + hexToRgb("bc5090") + ",1)",
                    "rgba(" + hexToRgb("ff6361") + ",1)",
                    "rgba(" + hexToRgb("ffa600") + ",1)"
                ], //"borderDash": [ [5,10], [0,0] ] 
            }, 
                bar: {backgroundColor: [ "rgba(20,220,220,.8)" , "rgba(220,120,120,.8)", "rgba(20,120,220,.8)" ]}, 
                pie: { backgroundColor: [ ["rgba(0,0,0,.8)" , "rgba(220,20,20,.8)", "rgba(20,220,20,.8)", "rgba(220,220,20,.8)", "rgba(20,20,220,.8)"] ]},
                radar: { borderColor: [ "rgba(20,220,220,.8)" , "rgba(220,120,120,.8)", "rgba(20,120,220,.8)" ]}, 
            },
        menu: {
            side: 'left',
            width: 'normal',
            numbers: false,
            titleSelector: 'h1, h2, h3, h4, h5, h6',
            hideMissingTitles: true,
            markers: true,
            custom: false,
            themes: false,
            transitions: false,
            openButton: true,
            openSlideNumber: true,
            keyboard: true,
            sticky: true,
            autoOpen: true,
            delayInit: false,
            openOnInit: false,
            loadIcons: false
        }
    }).then( () => {
        console.time('last');
        Reveal.getPlugin("highlight").hljs.registerLanguage("powershellc", function (hljs) { return { name: 'Powershell shell', aliases: ['powershellc'], contains: [{ className: 'regexp', begin: '^\\s*[A-Za-z\\d\\-]*', starts: { end: '$', subLanguage: 'powershell' } }] } });
        Reveal.getPlugin("highlight").hljs.registerLanguage("powershellshell", function (hljs) { return { name: 'Powershell shell', aliases: ['powershellshell'], contains: [{ className: 'meta', begin: '^\\s{0,3}[/\\w\\d\\[\\]()@-]*>', starts: { end: '$', subLanguage: 'powershellc' } }] } });
        Reveal.getPlugin("highlight").hljs.registerLanguage("sln", function (hljs) {
            return {
                name: 'sln',
                aliases: ['sln'],
                case_insensitive: true,
                illegal: /\S/,
                contains: [
                    {className: 'string', begin: /^#/, end: /$/ },
                    //{ begin: /^[^=]*$/, className: 'keyword' },
                    {
                        begin: /^[^=]*/,
                        className: 'keyword',
                        starts: {
                            end: /$/,
                            contains: [
                                {
                                    className: "string",
                                    variants: [
                                        { begin: "'''", end: "'''", relevance: 10 },
                                        { begin: '"""', end: '"""', relevance: 10 },
                                        { begin: '"', end: '"' },
                                        { begin: "'", end: "'" }
                                    ]
                                },
                                {
                                    className: "attr",
                                    begin: "="
                                }
                            ]
                        }
                    },
                ]
            };
        }); 
        Reveal.getPlugin("highlight").hljs.registerLanguage("http", function (hljs) {
            return {
                name: 'http',
                aliases: ['http'],
                case_insensitive: false,
                illegal: /\S/,
                contains: [
                    {className: 'keyword', begin: /POST/ },
                    {className: 'keyword', begin: /GET/ },
                    {className: 'string', begin: /^[^:]/, end: /:/ }
                ]
            };
        }); 
        Reveal.getPlugin("highlight").hljs.registerLanguage("fname", function (hljs) {
            return {
                name: 'fname',
                aliases: ['fname'],
                contains: [
                    {
                        className: 'allname', 
                        begin: /[^\/\\.]/, 
                        end: /\/|\\/,
                        contains: [
                            {
                                className: 'extension', 
                                begin: /\.[^\/\\.]+/, 
                            },
                            {
                                className: 'basename', 
                                begin: /[^\/\\.]+/, 
                            }
                        ]
                    },
                ]
            };
        }); 
        Reveal.getPlugin("highlight").hljs.registerLanguage("url", function (hljs) {
            return {
                name: 'url',
                aliases: ['url'],
                contains: [
                    {
                        className: 'http', 
                        begin: /^http:\/\//
                    },
                    {
                        className: 'https', 
                        begin: /^https:\/\//
                    },
                    {
                        className: 'localhost', 
                        begin: /localhost/
                    },
                    {
                        className: 'port', 
                        begin: /:\d*/
                    },
                    {
                        className: 'slash', 
                        begin: /\//
                    },
                    {
                        className: 'urlpart', 
                        begin: /[^/]+/
                    }
                ]
            };
        }); 
        Reveal.getPlugin("highlight").hljs.registerLanguage("cshtml-razor", window.hljsDefineCshtmlRazor);
    
        // The following works, if you want to make a scrollbar...
        /*
        function resetSlideScrolling(slide) {
            slide.classList.add('scrollable-slide');
        }
        
        function handleSlideScrolling(slide) {
            if (slide.scrollHeight >= 800) {
                slide.classList.add('scrollable-slide');
            }
        }
        
        Reveal.addEventListener('ready', function (event) {
            handleSlideScrolling(event.currentSlide);
        });
        
        Reveal.addEventListener('slidechanged', function (event) {
            if (event.previousSlide) {
                resetSlideScrolling(event.previousSlide);
            }
            handleSlideScrolling(event.currentSlide);
        });
        */
    
        /*document.querySelectorAll('code').forEach((block) => {
            if (block.parentElement.tagName != "pre")
                Reveal.getPlugin("highlight").hljs.highlightBlock(block);
        });*/
    
        // Reveal.on( 'slidetransitionend', event => { event.currentSlide.
            document.querySelectorAll('.wordcloud').forEach(function(wc) {
                var w=wc.width.baseVal.value;
                if (w==0) {
                    console.log("Error: width = 0");
                    return;
                }
                console.log(w);
                var h=wc.height.baseVal.value;
                // edited from https://github.com/cesine/d3-cloud/tree/master/examples, originally from https://github.com/jasondavies/d3-cloud/issues/118#issuecomment-387876795
                function wordCloud(wc){
                    if (wc.childNodes.length > 0)
                        return;
                    var e = d3.scale.category20();
                    var n = d3.select(wc).append("g").attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");
        
                    function o(t) {
                        var o = n.selectAll("g text").data(t, function(t) {
                            return t.text
                        });
                        o.enter().append("text").style("font-family", "Impact").style("fill", function(t, n) {
                            return e(n)
                        }).attr("text-anchor", "middle").attr("font-size", 1).text(function(t) {
                            return t.text
                        }), o.transition().duration(600).style("font-size", function(t) {
                            return t.size + "px"
                        }).attr("transform", function(t) {
                            return "translate(" + [t.x, t.y] + ")rotate(" + t.rotate + ")"
                        }).style("fill-opacity", 1), o.exit().transition().duration(200).style("fill-opacity", 1e-6).attr("font-size", 1).remove()
                    }
                    return {
                        update: function(t) {
                            d3.layout.cloud().size([w, h]).words(t).padding(5).rotate(function() {
                                return 2 * Math.random() * 90
                            }).font("Impact").fontSize(function(t) {
                                return t.size
                            }).on("end", o).start()
                        }
                    }
                }
                var words = wc.getAttribute("data").split(",");
                let t = wordCloud(wc);
                setInterval(() => {
                    if (document.evaluate("ancestor::section", wc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.classList.contains("present"))
                        t.update(words.map(function(t){return{text:t,size:10+60*Math.random()}}))
                }, 3000);
            });
        /*var secret = "";
        document.addEventListener("keydown", function(e) {
            if (e.key == 'l')
                secret = prompt("Secret: ");
        });*/
        Reveal.on( 'slidechanged', event => {
            /*for (let quiz of event.currentSlide.querySelectorAll(".quiz")) {
                if (secret != "")
                    quiz.src = "https://94.209.210.86/nextquestionviewer?maxtime=" + quiz.getAttribute("maxtime") + "&options=" + quiz.getAttribute("options") + "&secret=" + secret;
            }*/

            // if quiz is open, refresh to new question
            if (document.getElementById("quizwindow").style.display == "") {
                toggleQuiz();
                toggleQuiz();
            }
        });
        
        let quizButton = true;
        if ( quizButton ) {
            console.log("initializing quiz button")
            var button = document.createElement( 'div' );
            button.className = "quiz-button";
            button.id = "toggle-quiz";
            button.style.visibility = "visible";
            button.style.position = "absolute";
            button.style.zIndex = 30;
            button.style.fontSize = "24px";
    
            button.style.left =  "80px";
            button.style.bottom = "30px";
            button.style.top = "auto";
            button.style.right = "auto";
    
            button.innerHTML = '<a href="#" onclick="toggleQuiz(); return false;"><i class="fa fa-question-circle"></i></a>'
            document.querySelector(".reveal").appendChild( button );
        }

        console.timeEnd('last');
        window.addEventListener('load', function () {
            let loader = document.getElementById('loading')
            if (loader != null) loader.style.display = 'none';
            
        




        /*
                    let o = document.createElement( 'div' );
                    o.classList.add( 'overlay' );
                    o.classList.add( 'overlay-extra' );
                    document.querySelector( '.reveal' ).appendChild( o );
        
                    let html = '<p class="title">Keyboard awefawfe</p><br/>';
        
        
                    o.innerHTML = `
                        <header>
                            <a class="close" href="#"><span class="icon"></span></a>
                        </header>
                        <div class="viewport">
                            <div class="viewport-inner">${html}</div>
                        </div>
                    `;
        
                    o.querySelector( '.close' ).addEventListener( 'click', event => {
                        o.parentNode.removeChild( o );
                        o = null;
                        event.preventDefault();
                    }, false );
        */
                
















        
        
        })
    } );
}
);

var toggleQuiz = function() {
    let el = document.getElementById("quizwindow");
    if (el.style.display == "") {
        el.style.display = "none";
        document.getElementById("quizwindowiframe").src = "about:blank";
    }
    else {
        el.style.display = "";
        let kind = "";
        let time = "20";
        let slide = Reveal.getCurrentSlide();
        if (slide.hasAttribute("data-quiz"))
            kind = slide.getAttribute("data-quiz");
        if (slide.hasAttribute("data-quiz-time"))
            time = slide.getAttribute("data-quiz-time");
        document.getElementById("quizwindowiframe").src = "https://quizjes.herokuapp.com/new.html?kind=" + kind + "&time=" + time;
    }
}
