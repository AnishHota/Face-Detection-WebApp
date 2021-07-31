const enableWebcamButton = document.getElementById('webcamButton');
const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");

//Check if webcam access is supported
function getUserMediaSupported(){
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// If webcam is supported, add event listener to button
if(getUserMediaSupported()){
    enableWebcamButton.addEventListener('click',loadModel);
} else {
    console.warn('getUserMedia() is not supported by your browser');
}

//Enable the livecam
function enableCam(event){   

    if(!model){
         return;
    }

    navigator.mediaDevices.getUserMedia({
        video: {width: 600, height: 400},
        audio: false
    })
    .then(function(stream){
        video.srcObject = stream;
        video.addEventListener('loadeddata',predictWebcam)
    });
}

async function predictWebcam(){
    const prediction = await model.estimateFaces(video,false);
        // console.log(predictions);

        //TODO: Rather than copying the video to a canvas
        // better to draw over the livevideo
        // Refer to the obj det code.
    ctx.drawImage(video,0,0,600,400);

    prediction.forEach((pred) => {
        ctx.beginPath();
        ctx.lineWidth = "4";
        ctx.strokeStyle = "blue";
        ctx.rect(
            pred.topLeft[0],
            pred.topLeft[1],
            pred.bottomRight[0]-pred.topLeft[0],
            pred.bottomRight[1]-pred.topLeft[1]
        );
        ctx.stroke();

        ctx.fillStyle = "red";
        pred.landmarks.forEach(landmark =>{
           ctx.fillRect(landmark[0],landmark[1],5,5); 
        })
    });

    window.requestAnimationFrame(predictWebcam);
}

var model = undefined;

async function loadModel(){
    model = await blazeface.load();
    enableCam();
}



