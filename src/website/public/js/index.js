class Manager {
    constructor(socket) {
        this.socket = socket;

        this.cache = {};

        this.mobile = false;

        this.socket.on("connection", () => console.log("working"));

        this.socket.emit("init_data", {
            viewport: this.getScreenSize(),
            quality: parseInt(localStorage.getItem("quality")) || 20,
            refresh_rate: parseInt(localStorage.getItem("refresh_rate")) || 500
        });

        this.lauchEvents();

        this.elements = {
            screen: document.querySelector("#screen")
        }

        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            this.mobile = true;
        }
    }

    lauchEvents() {
        this.socket.on("event", async (event) => {
            console.log(`Received event: ${event.type}`);
            
            switch(event.type) {
                case "set_url":
                    this.setURL(event.data);
                    break;
                case "set_status":
                    this.setStatus(event.data);
                    break;
                case "browser_ready":
                    let url = new URLSearchParams(window.location.search).get("url") ?? "https://duckduckgo.com/";
                    this.socket.emit("navigation", {type: "goto", data: url});
                    break;
                case "update_frame":
                    this.updateFrame(event.data);
                    break;
                case "show_keyboard":
                    if(this.mobile) {
                        let text = prompt("What would you like to enter?");
                        if(text.length < 1) return;

                        socket.emit("input", {type: "text", data: text});
                    }
                    break;
                default:
                    console.log("Unknown event");
                    break;
            }
        });

        $(document).keydown((e) => {
            if(!this.isHoveringOverScreen()) return;
            this.socket.emit("input", {type: "key", data: { key: e.key, shiftKey: e.shiftKey, action: "down" }});
        });

        $(document).keyup((e) => {
            if(!this.isHoveringOverScreen()) return;
            this.socket.emit("input", {type: "key", data: { key: e.key, shiftKey: e.shiftKey, action: "up" }});
        });

        $(window).on("resize", () => {
            this.socket.emit("set_viewport", this.getScreenSize());
        });

        $("a[data-navigation-action]").click((e) => {
            let action = $(e.target).attr("data-navigation-action");

            this.socket.emit("navigation", {type: action});
        });

        $(document).on("mousemove", ((e) => {
            let cache = this.cache["mouse_position"] = {x: e.clientX, y: e.clientY};

            let offset = $("#screen").offset()?.top || 0;

            if(this.isHoveringOverScreen()) {
                this.socket.emit("input", {type: "mouse_move", data: {...cache, y: cache.y - offset}});
            }
        }));

        $(window).on("wheel", (e) => {
            this.socket.emit("input", {type: "scroll_wheel", data: e.originalEvent.deltaY});
        });

        $("#screen").on("mousedown", ((e) => {
            let cache = this.cache["mouse_position"] = {x: e.clientX, y: e.clientY};

            let offset = $("#screen").offset()?.top || 0;

            if(this.isHoveringOverScreen()) {
                this.socket.emit("input", {type: "mouse_down", data: {...cache, y: cache.y - offset}});
            }
        }));

        $("#screen").on("mouseup", ((e) => {
            let cache = this.cache["mouse_position"] = {x: e.clientX, y: e.clientY};

            let offset = $("#screen").offset()?.top || 0;

            if(this.isHoveringOverScreen()) {
                this.socket.emit("input", {type: "mouse_up", data: {...cache, y: cache.y - offset}});
            }
        }));

        $("#screen").on("dragstart", () => {
            return false;
        });
    }

    getScreenSize() {
        return {
            width: parseInt(($("#screen").width()).toFixed()),
            height: parseInt((window.innerHeight - $("#screen").offset().top).toFixed())
        }
    }

    setStatus(text) {
        $("#status").text(`Status: ${text}`);
    }

    setURL(text) {
        $("#web_browser_url_bar").val(text);
    }

    updateFrame(image) {
        let blob = new Blob([image]);

        let reader = new FileReader();
        reader.onload = (event) => {
            let base64 = event.target.result
            let img = this.elements.screen;
            img.src = base64;
        };

        reader.readAsDataURL(blob);
    }

    isHoveringOverScreen() {
        let mousePosition = this.cache["mouse_position"];

        let element = document.elementFromPoint(mousePosition.x, mousePosition.y);

        return element.id === "screen";
    }
}

new Manager(window.socket);