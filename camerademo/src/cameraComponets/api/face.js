import * as faceapi from '../../../node_modules/face-api.js';



// Load models and weights
export async function loadModels() {
  return new Promise(async (resolve, reject) => {


  const MODEL_URL = process.env.PUBLIC_URL + '/models';
   const WEIGHT_URL = process.env.PUBLIC_URL + '/weights';

  await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
  await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
  await faceapi.loadFaceExpressionModel(MODEL_URL);
  await faceapi.loadAgeGenderModel(WEIGHT_URL);
  await faceapi.loadFaceLandmarkModel(MODEL_URL);
  await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL)

 return resolve(true);
  //await faceapi.loadSsdMobilenetv1Model(WEIGHT_URL);
   //await faceapi.loadFaceRecognitionModel(MODEL_URL);
 // await faceapi.loadFaceDetectionModel(WEIGHT_URL);
  // await faceapi.loadTinyFaceDetectorModel('/models')
  // await faceapi.loadMtcnnModel('/models')
  // await faceapi.loadFaceLandmarkTinyModel('/models')
   //await faceapi.loadFaceExpressionModel(WEIGHT_URL)

  });
}
export async function loadSSDModel(){
  const MODEL_URL = process.env.PUBLIC_URL + '/models';
   await faceapi.loadFaceLandmarkModel(MODEL_URL);

  await faceapi.loadSsdMobilenetv1Model(MODEL_URL).then(()=>{
    console.log("SSDMOdel Loaded")
  })
  //await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)


}

export async function getFullFaceDescription(blob, inputSize = 512, tinyModelBool, faceRecong, faceMatcher) {
 /* if (tinyModelBool && !faceRecong) {
      console.log('tinyModel')

    // tiny_face_detector options
    let scoreThreshold = 0.5;
    const tinyModel = new faceapi.TinyFaceDetectorOptions({
      inputSize,
      scoreThreshold
    });
    const useTinyModel = true;

    // fetch image to cameraComponets
    let img = await faceapi.fetchImage(blob);

    // detect all faces and generate full description from image
    // including landmark and descriptor of each face
    let fullDesc = await faceapi
      .detectAllFaces(img, tinyModel)
      .withFaceLandmarks(useTinyModel)
      .withFaceExpressions().withAgeAndGender()
    return fullDesc;

  } else if (!tinyModelBool&& !faceRecong){
    console.log('SSDModel')

    const ssdMobileModel = new faceapi.SsdMobilenetv1Options({minConfidence: 0.8});

    let img = await faceapi.fetchImage(blob);

    let fullDesc = await faceapi
    .detectAllFaces(img,ssdMobileModel )
    .withFaceLandmarks(false)
    .withFaceExpressions()
   .withAgeAndGender();
    return fullDesc;

  } else if(faceRecong){*/
    let model =  new faceapi.TinyFaceDetectorOptions({
      inputSize,
      scoreThreshold:0.5
    });


    let img = await faceapi.fetchImage(blob);

    const fullDesc =await faceapi.detectAllFaces(img, model).withFaceLandmarks(tinyModelBool).withFaceExpressions().withAgeAndGender().withFaceDescriptors()

    //console.log(faceMatcher)

    return fullDesc

}
function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(content)], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
export async function exportLabeledFaceDescriptors(imgs) {
    const labels = ['Employee123']
    const labeledFaceDescriptors = await Promise.all(
        labels.map(async ( label,i) => {

            const img = await faceapi.fetchImage(imgs[i]);
            const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()

            if (!fullFaceDescription) {
                throw new Error(`no faces detected for ${label}`)
            }

            const faceDescriptors = [fullFaceDescription.descriptor]

            return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
        }))
    download(labeledFaceDescriptors,'faceDesc.json','application/json')



}

export async function getCustomerFace(blob, inputSize = 160, customerLabel){
    let model =  new faceapi.TinyFaceDetectorOptions({
        inputSize,
        scoreThreshold:0.5
    });
    const labels = [customerLabel];
    let img = await faceapi.fetchImage(blob);
    const labeledFaceDescriptors = await Promise.all( labels.map(async (label)=> {
            const fullDesc = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
            if (!fullDesc) {
                throw new Error(`no faces detected for ${label}`)
            }

            const faceDescriptors = [fullDesc.descriptor]

            return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
        }))
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors)//, maxDescriptorDistance)
   // console.log(faceMatcher)
    return faceMatcher;

}

export async function getFaceMatcher (){
    //const labeledFaceDescriptors = await faceapi.fetchJson('faceDesc.json');
    const JSON_PROFILE = require('./faceDesc.json');


    //const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors)//, maxDescriptorDistance)
    const faceMatcher = await createMatcher(JSON_PROFILE);

    return faceMatcher

}

export async function setFaceRecognition(imgs){
 const labels = ['Employee123']
 const labeledFaceDescriptors = await Promise.all(
      labels.map(async ( label,i) => {

        const img = await faceapi.fetchImage(imgs[i]);
        const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()

        if (!fullFaceDescription) {
          throw new Error(`no faces detected for ${label}`)
        }

        const faceDescriptors = [fullFaceDescription.descriptor]

        return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
      }))
      //const maxDescriptorDistance = 0.9
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors)//, maxDescriptorDistance)
      //console.log(faceMatcher)
      return faceMatcher;
}

const maxDescriptorDistance = 0.5;
export async function createMatcher(faceProfile) {
  // Create labeled descriptors of member from profile
  //let members = Object.keys(faceProfile);
  let labeledDescriptors = faceProfile.map(
      (member,index) =>
      new faceapi.LabeledFaceDescriptors(
        faceProfile[index].label,
        faceProfile[index].descriptors.map(
          descriptor => new Float32Array(descriptor)
        )
      )
  );

  // Create face matcher (maximum descriptor distance is 0.5)
  let faceMatcher = new faceapi.FaceMatcher(
    labeledDescriptors,
    maxDescriptorDistance
  );
  return faceMatcher;
}
