

// Inject jQuery into the page

var tag = document.createElement('script');
tag.src = 'http://code.jquery.com/jquery.min.js';
tag.type = 'text/javascript';
var hookTag = document.getElementsByTagName('script')[0];
hookTag.parentNode.insertBefore(tag, hookTag);

// Inject a stylesheet into the page

var head = document.head;
var link = document.createElement("link");
link.type = "text/css";
link.rel = "stylesheet";
link.href = "/injectables/injectables.css";
head.appendChild(link);


// const initialized = new CustomEvent("initialized", {
//     detail: {
//         message: "Initialized",
//     },
// });

// document.addEventListener('initialized', function (e) {
//     console.log(e.detail.message);
// });

// document.addEventListener('changed', function (e) {
//     console.log(e.detail.message);
//     console.log(e.detail.uuid);
//     console.log(e.detail.new_inner_html);
// });

window.addEventListener('load', function () {
    // Set all elements contenteditable to false

    $("*").attr("contenteditable", "false");

    // Set all elements with UUIDs to contenteditable true with jQuery

    $("*[uuid]").attr("contenteditable", "true");

    // Add a initialized class to html tag

    $("html").addClass("initialized");

    // Trigger initialized event, trigger on document root

    //window.parent.document.dispatchEvent(initialized);

    window.parent.postMessage("initialized", "*");

    // Add event listeners any time its changed to all items that are contenteditable to emit that they are changed. 
    
    $("*[contenteditable='true']").on("input", function (e) {
        // const changed = new CustomEvent("changed", {
        //     bubbles: true,
        //     cancelable: true,
        //     detail: {
        //         message: "Changed",
        //         uuid: $(this).attr("uuid"),
        //         new_inner_html: $(this).html(),
        //     },
        // });

        // window.parent.document.dispatchEvent(changed);

        window.parent.postMessage({
            message: "changed",
            uuid: $(this).attr("uuid"),
            new_inner_html: $(this).html(),
        }, "*");

        // Stop propagation so only the lowest element emits.

        e.stopPropagation();
    });
})