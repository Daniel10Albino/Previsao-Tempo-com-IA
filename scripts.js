
let chaveIa="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"

async function buscar() {
    let cidade = document.querySelector(".input-cidade").value;
    let caixa = document.querySelector(".caixa-media");
    let chave = "5b4b5e26d8b5fc6f64fa56b3bc44349e";
    

    let endereco = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${chave}&units=metric&lang=pt_br`;

    let respostaServidor = await fetch(endereco);
    let dadosJson = await respostaServidor.json();

    caixa.innerHTML = `
        <h2 class="cidade">${dadosJson.name}</h2>
        <p class="temp">${Math.floor(dadosJson.main.temp)}°C</p>
        <img class="icone" src="https://openweathermap.org/img/wn/${dadosJson.weather[0].icon}.png" alt="${dadosJson.weather[0].description}">
        <p class="umidade">Umidade: ${dadosJson.main.humidity}%</p>
        <p class="vento">Vento: ${dadosJson.wind.speed} m/s</p>
        <p class="pressao">Pressão: ${dadosJson.main.pressure} hPa</p>
        <p class="sensacao">Sensação térmica: ${Math.floor(dadosJson.main.feels_like)}°C</p>
        <p class="nuvens">Nuvens: ${dadosJson.clouds.all}%</p>
        <p class="nascer">Nascer do sol: ${new Date(dadosJson.sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p class="pôr">Pôr do sol: ${new Date(dadosJson.sys.sunset * 1000).toLocaleTimeString()}</p>
        <p class="latitude">Latitude: ${dadosJson.coord.lat}</p>
        <p class="longitude">Longitude: ${dadosJson.coord.lon}</p>
        <p class="temp-min">Temperatura mínima: ${Math.floor(dadosJson.main.temp_min)}°C</p>
        <p class="temp-max">Temperatura máxima: ${Math.floor(dadosJson.main.temp_max)}°C</p>
        <p class="presenca">Presença de chuva: ${dadosJson.rain ? "Sim" : "Não"}</p>
        <p class="direcao">Direção do vento: ${dadosJson.wind.deg}°</p>
        <p class="rajada">Rajada de vento: ${dadosJson.wind.gust ? dadosJson.wind.gust + " m/s" : "N/A"}</p>
        <p class="descricao">Descrição: ${dadosJson.weather[0].description}</p>
        <button class="botao-ia" onclick="pedirSugestao()">Sugestão de roupa</button>
        <p class="resposta-ia"></p>
    `;
    console.log(dadosJson);
    
}
function detectarVoz() {
    let reconhecimento = new window.webkitSpeechRecognition();
    reconhecimento.lang = "pt-BR";
    let botao = document.getElementById("botao-voz");
    
    reconhecimento.onstart = function() {
        botao.classList.add("gravando");
    };

    reconhecimento.onresult = function(evento){
        let textoTranscrito = evento.results[0][0].transcript;
        document.querySelector(".input-cidade").value = textoTranscrito;
        buscar();
    };
    
    reconhecimento.onend = function() {
        botao.classList.remove("gravando");
    };
    
    reconhecimento.start();
}

    async function pedirSugestao(){
    let temperatura = document.querySelector(".temp").textContent;
    let umidade = document.querySelector(".umidade").textContent;
    let cidade = document.querySelector(".cidade").textContent;


    let resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${chaveIa}`
        },
        body: JSON.stringify({
            model:"openai/gpt-oss-120b",
            messages: [
                {
                    role: "user",
                    content: `Dada a temperatura de ${temperatura}, umidade de ${umidade} e cidade de ${cidade}, o que eu deveria vestir hoje?
                    Me dê 2 frases curtas.`
                }
            ]
        })
    });

    let dadosIa = await resposta.json();
    document.querySelector(".resposta-ia").innerHTML= dadosIa.choices[0].message.content;
    console.log(dadosIa);
}