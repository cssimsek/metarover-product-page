const functions = require('firebase-functions');
const express = require('express');
const engines = require('consolidate');

const admin = require('firebase-admin');
const adminApp = admin.initializeApp();


const app = express();

app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

let year = (new Date()).getFullYear();
let copyText = "Copyright © 2017" + (year > 2017 ? "-" + year : "") + " MetaRover by Cem Simsek";

let routingTable = {
    '/': 'index',
    '/404': '404',
    '/demo-videos': 'demo-videos',
    '/privacy-policy': 'privacy-policy',
    '/report-issue': 'report-issue'
};
let paths = Object.keys(routingTable);

/* 
Create and Deploy Your First Cloud Functions
https://firebase.google.com/docs/functions/write-firebase-functions
*/
exports.app = functions.https.onRequest(app);


//Define specific routes
app.get(paths, (request, response) => {
    let originalUrl = request.originalUrl;
    //Strip url of query params for routing purposes
    let oUrl = originalUrl.replace(/[\?|\#]{1}.*/i, "");
    console.log(oUrl);
    if (originalUrl in routingTable) {
        if (originalUrl == "/404") response.status(404);
        response.set({
            'X-Robots-Tag': 'noindex',
            'Cache-Control': 'public, max-age=300, s-maxage=600'
        });
        response.locals.copyrightText = JSON.stringify(copyText);
        response.render(routingTable[originalUrl]);
    } else if (oUrl.indexOf('/metarover-add-on-lp/us-central1/app')!=-1){
        oUrl = oUrl.replace('/metarover-add-on-lp/us-central1/app','');
        response.set({
            'X-Robots-Tag': 'noindex',
            'Cache-Control': 'public, max-age=300, s-maxage=600'
        });
        response.locals.copyrightText = JSON.stringify(copyText);
        response.render(routingTable[oUrl]);

    }else if (oUrl in routingTable) {
        response.set({
            'X-Robots-Tag': 'noindex',
            'Cache-Control': 'public, max-age=300, s-maxage=600'
        });
        response.locals.copyrightText = JSON.stringify(copyText);
        response.render(routingTable[oUrl]);
    } else {
        response.status(404);
        response.set({
            'X-Robots-Tag': 'noindex',
            'Cache-Control': 'public, max-age=300, s-maxage=600'
        });
        response.locals.copyrightText = JSON.stringify(copyText);
        response.render(routingTable['/404']);
    }
});

//Redirect all else to 404

app.get('*', (request, response) => {
    response.status(404);
    response.set({
        'X-Robots-Tag': 'noindex',
        'Cache-Control': 'public, max-age=300, s-maxage=600'
    });
    response.locals.copyrightText = JSON.stringify(copyText);
    response.render(routingTable['/404']);
});