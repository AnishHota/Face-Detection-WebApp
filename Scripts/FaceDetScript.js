const enableWebcamButton = document.getElementById('webcamButton');
const video = document.getElementById('webcam');
//Only use the below two elements if you want to use canvas
//to draw or show the facial detection below the real video.
// const canvas = document.getElementById('canvas');
// let ctx = canvas.getContext("2d");
const liveView = document.getElementById('liveView');

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

    //Hide the button once clicked.
    enableWebcamButton.setAttribute('class','removed');
    
    navigator.mediaDevices.getUserMedia({
        video: {width: 600, height: 400},
        audio: false
    })
    .then(function(stream){
        video.srcObject = stream;
        video.addEventListener('loadeddata',predictWebcam)
    });
}

var children=[]

async function predictWebcam(){
    const prediction = await model.estimateFaces(video,false);
    //Below commented code uses canvas to draw facial detection.  
    // ctx.drawImage(video,0,0,600,400);

    // prediction.forEach((pred) => {
    //     ctx.beginPath();
    //     ctx.lineWidth = "4";
    //     ctx.strokeStyle = "blue";
    //     ctx.rect(
    //         pred.topLeft[0],
    //         pred.topLeft[1],
    //         pred.bottomRight[0]-pred.topLeft[0],
    //         pred.bottomRight[1]-pred.topLeft[1]
    //     );
    //     ctx.stroke();

    //     ctx.fillStyle = "red";
    //     pred.landmarks.forEach(landmark =>{
    //        ctx.fillRect(landmark[0],landmark[1],5,5); 
    //     })
    // });
    for(let i=0;i<children.length;i++) 
    {
        liveView.removeChild(children[i]);
    }
    children.splice(0);

    for(let n=0;n<prediction.length;n++)
    {
        const faceBox = document.createElement('div');

        faceBox.setAttribute('class','faceBox');
        faceBox.style='left: '+prediction[n].topLeft[0]+'px; top:'
        +prediction[n].topLeft[1]+'px; width:'
        +(prediction[n].bottomRight[0]-prediction[n].topLeft[0])+'px; height:'
        +(prediction[n].bottomRight[1]-prediction[n].topLeft[1])+'px;';

        liveView.appendChild(faceBox);
        children.push(faceBox);
    }
    
    window.requestAnimationFrame(predictWebcam);
}

var model = undefined;

async function loadModel(){
    model = await blazeface.load();
    enableCam();
}



