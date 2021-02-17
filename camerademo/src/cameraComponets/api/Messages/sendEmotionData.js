export async function sendEmotionData(emotionArr){

    const formData = new FormData();
    formData.append('emotionArr',JSON.stringify(emotionArr));

  const response=  await fetch(` https://face-recongize.azurewebsites.net/api/trigscoemotion?code=KPKuZUfE0eHaC6j6rargUk56BnscRgBAbPn4sZSkZhooRUpY7h5XGA==`,{
        method:'POST',
        credentials: 'same-origin',
      mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin':'*'
        },
        body:formData
    });
console.log(response)
return true
}

