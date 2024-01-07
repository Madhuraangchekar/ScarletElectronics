const {google} = require('googleapis');
const keyfilepath = __dirname + '/../util/scarletelectronics-key.json';
const parentFolder = ['18JECWflK5JGaS1zvmIjA2UyyNB-6H605'];
const fs = require('fs');
const { Model } = require('sequelize');

const auth = new google.auth.GoogleAuth({
  keyFile: keyfilepath,
  scopes: ['https://www.googleapis.com/auth/drive'],
});


async function listFiles() {
    try {
        const drive = google.drive({version: 'v3', auth});
        const res = await drive.files.list({
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',
        });
        const files = res.data.files;
        if (files.length === 0) {
            console.log('No files found.');
            return;
        }

        console.log('Files:');
        files.map((file) => {
            console.log(`${file.name} (${file.id})`);
        });
    } catch (err) {
        console.log("Error: Unable to connect to drive");
    }
}


async function createDrive(folderName) {
    try {
        const drive = google.drive({version: 'v3', auth});
        const folderMetaData = {
            name: folderName,
            mimeType: "application/vnd.google-apps.folder",
            parents: parentFolder,
        };

        const res = await drive.files.create({
            fields: "id",
            resource: folderMetaData,
        }).catch((err) => console.log(err));
        console.log("Created folder with id : " + res.data.id);
        return res.data.id;
    }
    catch (err) {
        console.log("Error while connecting to drive. Error Message: " + err.message);
        return -1;
    }
}

async function uploadFile(folderId, filePath, fileName, mimeGiven) {
    try {
        const drive = google.drive({version: 'v3', auth});
        const fileMetaData = {
            name: fileName,
            parents: [folderId],
        };

        const media = {
            mimeType: mimeGiven,
            body: fs.createReadStream(filePath),
        };

        const res = await drive.files.create({
            requestBody: fileMetaData,
            media,
            fields: "id",
        }).catch((err) => console.log(err));
        const fileId= res.data.id
        console.log("Uploaded file with id : " + fileId);
        const permissionsResponse = await changePermision(fileId);
        return fileId;
    } catch (err) {
        console.log("Error uploading file to Drive. Error : "+err);
        return -1;
    }
}

async function getImagesInFolder(folderId) {
    try {
        const drive = google.drive({ version: 'v3', auth });
        const query = `'${folderId}' in parents`;
        const response = await drive.files.list({
            q: query,
            fields: 'files(id, name)',
        });
        const imageFiles = response.data.files;
        console.log(`Found ${imageFiles.length} image files in folder ${folderId}:`);
        imageFiles.forEach((file) => {
            console.log(`- ${file.name} (${file.id})`);
        });

        if (!imageFiles) {
            return [{"id" : ""}];
        }
        return imageFiles;
    } catch (err) {
        console.log("Error reading files from Drive. Error : "+err);
        return [-1, -1];
    }
}


async function changePermision(fileId) {
    const drive = google.drive({version: 'v3', auth});
    const permissionsResponse = await drive.permissions.create({
        fileId: fileId,
        requestBody: {
            role: 'reader',
            type: 'anyone',
        },
    }).then((result) => {
        // console.log('Result : ' + JSON.stringify(result, null, 2));
        console.log('Permission updated succesfully for fileId : ' + fileId);
        return result;
    }).catch((err) => {
        console.log('err : ' + err);
        return err;
    });
}


module.exports = {listFiles, createDrive, uploadFile, getImagesInFolder, changePermision};