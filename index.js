//CONNECTION TYPE
typeSelection = document.getElementById("connection-type");
submitTypeBtn = document.getElementById("submit-type");
submitTypeBtn.onclick = submitType;

//LOCAL
submitLocalBtn = document.getElementById("submit-local");
localOfferBox = document.getElementById("local-offer");

//REMOTE
submitRemoteBtn = document.getElementById("submit-remote");
remoteOfferBox = document.getElementById("remote-offer");

//TEXTBOX
submitTextBtn = document.getElementById("submit-text");
sendBox = document.getElementById("chat-box-send");
recieveBox = document.getElementById("chat-box-recieve");

function submitType() {
    /**
     * Usually executed when the type selector button is pressed.
     */
    submitTypeBtn.disabled = true;
    typeSelection.disabled = true;
    if (typeSelection.value == "local") {
        createLocalConnection();
    } else {
        submitRemoteBtn.disabled = false;
        submitRemoteBtn.onclick = createRemoteConnection;
    }
}

function createLocalConnection() {
    const lc = new RTCPeerConnection();
    const dc = lc.createDataChannel("channel");
    dc.onmessage = message => recieveBox.textContent = message.data;
    dc.onopen = e => {
        console.log("Connection opened.")
        startChatBox(dc);
    };
    lc.onicecandidate = e => {
        console.log("Created new ICE candidate.")
        localOfferBox.textContent = JSON.stringify(lc.localDescription)/*.replace("UDP", "TCP").replace("udp","tcp")*/;
    }
    lc.createOffer().then(offer => lc.setLocalDescription(offer)).then(a => console.log("Local description set successfully."));
    submitRemoteBtn.disabled = false;
    submitRemoteBtn.onclick = () => {
        const answer = JSON.parse(remoteOfferBox.value);
        lc.setRemoteDescription(answer);
    }
}

function createRemoteConnection() {
    submitRemoteBtn.disabled = true;
    const offer = JSON.parse(remoteOfferBox.value);
    const rc = new RTCPeerConnection;
    rc.onicecandidate = e => {
        console.log("Created new ICE candidate.");
        localOfferBox.textContent = JSON.stringify(rc.localDescription);
    }
    rc.ondatachannel = dataChannel => {
        rc.dc = dataChannel.channel;
        rc.dc.onmessage = message => recieveBox.textContent = message.data;
        rc.dc.onopen = e => console.log("Connection opened.");
        startChatBox(rc.dc);
    }
    rc.setRemoteDescription(offer).then(a => console.log("Offer set."));
    rc.createAnswer().then(answer => rc.setLocalDescription(answer)).then(a => console.log("Answer created."))
    
}

function startChatBox(dataChannel) {
    submitTextBtn.onclick = () => {
        dataChannel.send(sendBox.value);
        sendBox.value = "";
    }
}