let currentKey = '';

function apagarID(id){
    document.getElementById(id).style.display = 'none'
};

function prenderID(id){
    document.getElementById(id).style.display = 'inline'
};

// Botones apagados en posición inicial
apagarID('generateKeyInput');
apagarID('manualKeyInput');
apagarID('copyKeyBtn');
apagarID('encryptBtn');

function generateKey(){
    if (document.getElementById('generateKeyInput').value == ''){
        fetch('/generate_key')
        .then(response => response.json())
        .then(data => {
            prenderID('generateKeyInput');
            apagarID('manualKeyInput');
            prenderID('copyKeyBtn');
            prenderID('encryptBtn');
            document.getElementById('manualKeyInput').value = ''
            currentKey = data.key;
            const generatedKey = document.getElementById('generateKeyInput');
            generatedKey.value = data.key;
            generatedKey.disabled = true;
            const buttonKey = document.getElementById('generateKeyBtn');

            // buttonKey.disabled = true;
        });
    } else {
            prenderID('generateKeyInput');
            apagarID('manualKeyInput');
            prenderID('copyKeyBtn');
            prenderID('encryptBtn');
            document.getElementById('manualKeyInput').value = ''

    }


};

function manualKey(){
    apagarID('generateKeyInput');
    prenderID('manualKeyInput');
    // prenderID('copyKeyBtn');
    prenderID('encryptBtn');
    const generatedKey = document.getElementById('generatedKey');
    const buttonKey = document.getElementById('generateKeyBtn');
    generatedKey.disabled = false;
    buttonKey.disabled = false;
};

function copyKeyBtn(generateKey,manualKey){
    let generateValue = ''
    let manualValue = ''
    
    generateValue = document.getElementById(generateKey).style.display
    manualValue = document.getElementById(manualKey).style.display

    if (generateValue=='inline' && manualValue == 'none'){
        var copyText = document.getElementById(generateKey);
        copyText.select();
        navigator.clipboard.writeText(copyText.value);
    } else if (generateValue=='none' && manualValue == 'inline'){
        var copyText = document.getElementById(manualKey);
        copyText.select();
        navigator.clipboard.writeText(copyText.value);
    }

}

function copyTextBtn(){
    var copyText = document.getElementById('decryptOutput');
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
}


function encryptBtn() {
    const text = document.getElementById('encryptInput').value;
    let key = document.getElementById('manualKeyInput').value;
    if (!key) {
        key = currentKey;
    }
    fetch('/encrypt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'text': text,
            'key': key
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.encrypted_text) {
            document.getElementById('encryptOutput').innerText = data.encrypted_text;
            var copyText = document.getElementById('encryptOutput');
            copyText.select();
            navigator.clipboard.writeText(copyText.value);
            alert('Se copió el texto encriptado')
        } else {
            alert('Encryption failed.');
        }
    });
}

function decryptBtn() {
    const text = document.getElementById('decryptInput').value;
    const key = document.getElementById('decryptKey').value;
    fetch('/decrypt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'encrypted_text': text,
            'key': key
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.decrypted_text) {
            document.getElementById('decryptOutput').innerText = data.decrypted_text;
        } else {
            alert('Decryption failed: ' + data.error);
        }
    });
};

function updateWordCount() {
    const textInput = document.getElementById('encryptInput');
    const wordCount = document.getElementById('wordCount');
    const words = textInput.value.length;
    wordCount.textContent = `${words}/150`;
}