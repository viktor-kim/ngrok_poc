import https from 'https';
import fs from 'fs';
import path from 'path';

const ngrok64 = 'https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-windows-amd64.zip'
const ngrok32 = ' https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-windows-amd64.zip'
const __dirname = path.resolve()

function isOSWin64() {
  return process.arch === 'x64' || process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432');
}

function downloadNgrok(url, dest) {
    return new Promise((resolve, reject) => {
        fs.access(dest, fs.constants.F_OK, (error) => {
            if (error !== null) reject({ message: "File already exists" })

            const request = https.get(url, response => {
                if (response.statusCode === 200) {
                    const file = fs.createWriteStream(dest, { flags: 'wx' })
                    console.log(file)
                    file.on('finish', () => resolve());
                    file.on('error', err => {
                        file.close();
                        if (err.code === 'EEXIST') reject('File already exists');
                        else fs.unlink(dest, () => reject(err.message)); // Delete temp file
                    });
                    response.pipe(file);
                } else if (response.statusCode === 302 || response.statusCode === 301) {
                    downloadNgrok(response.headers.location, dest).then(()=> resolve())
                } else {
                    reject({message: "Ngrok server error"})
                }
            })

            request.on('error', error => {
                reject({message: error.message})
            })
        })
    })
}

// if (isOSWin64()) {
//     const result = await downloadNgrok(ngrok64, path.join(__dirname, '/'))
//     console.log(result.message)
// } else {
//     const result = await downloadNgrok(ngrok32, path.join(__dirname, '/'))
//     console.log(result.message)
// }