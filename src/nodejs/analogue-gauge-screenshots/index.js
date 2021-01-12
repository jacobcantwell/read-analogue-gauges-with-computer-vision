/*
invoke with
AWS_PROFILE=cv S3_TRAINING_BUCKET=custom-labels-console-us-east-1-67a9361d65 node index.js
S3 bucket should be generated by Rekogition, e.g. custom-labels-console-us-east-1-67a9361d65
*/
const chromium = require('chrome-aws-lambda')
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const s3Bucket = process.env.S3_TRAINING_BUCKET

const URL_GAUGE_BUILDER_PREFIX = 'https://aws-computer-vision.jacobcantwell.com/gauge/?view=training&bp='
const S3_IMAGE_FOLDER = 'gauge-pressure'
const zeroPad = (num, places) => String(num).padStart(places, '0')
let manifestLabels = []
let imageList = []

function getManifestLabelJson(s3Bucket, s3Key, bp) {
  const s3Url = 's3://' + s3Bucket + '/' + s3Key
  const creationDate = new Date().toISOString()
  let manifestLabelJson = {
    'source-ref': s3Url,
    'gauge-pressure': 0, // FIRST label
    'gauge-pressure-metadata': {
        'class-name': 'GAUGE_PRESSURE',
        'confidence': 1,
        'type': 'groundtruth/image-classification',
        'job-name': 'identify-gauge-pressure-v01',
        'human-annotated': 'yes',
        'creation-date': creationDate
    },
    ['gauge-pressure-' + bp]: 1, // SECOND label
    ['gauge-pressure-' + bp + '-metadata']: {
        'class-name': 'GAUGE_PRESSURE_BP_' + bp,
        'confidence': 1,
        'type': 'groundtruth/image-classification',
        'job-name': 'identify-gauge-pressure-v01',
        'human-annotated': 'yes',
        'creation-date': creationDate
    }
  }
  manifestLabelJson = JSON.stringify(manifestLabelJson, null, null)
  // console.log('manifestLabelJson', manifestLabelJson)
  return manifestLabelJson
}

async function generateImageAndSaveS3(page, bp, transformSuffix, clipX, clipY) {
  const s3KeyPrefix = S3_IMAGE_FOLDER + '/gauge-pressure-' + bp + '/gauge-bp-'
  const s3KeySuffix = '.jpg'
  try {
    // console.log('generateImageAndSaveS3', transformSuffix)
    const s3Key = s3KeyPrefix + bp + transformSuffix + s3KeySuffix
    // console.log('capturing ' + transformSuffix + ' image', s3Key)
    const screenshotParams = {
      path: s3Key, // uncomment if only running locally - need to create a directory for each bp
      clip: { x: clipX, y: clipY, width: 490, height: 490 }
    }
    // console.log('screenshotParams', screenshotParams)
    const screenshot = await page.screenshot(screenshotParams)
    /* save image to S3
    const s3Params = {
      Bucket: s3Bucket,
      Key: s3Key,
      Body: screenshot
    };
    console.log('writing to s3: s3://' + s3Bucket + '/' + s3Key)
    await s3.putObject(s3Params).promise();
    */
    // push to manifest file
    manifestLabels.push(getManifestLabelJson(s3Bucket, s3Key, bp))
    // push to results
    imageList.push(s3Key);
  } catch (error) {
    console.error('error', error)
  }
}

exports.handler = async (event, context, callback) => {
  console.log('running handler')
  let browser = null
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      // headless: chromium.headless,
      ignoreHTTPSErrors: true,
    })
    let page = await browser.newPage();
    for (let i = 10; i < 16; i++) {
        let bp = zeroPad(i, 3);
        const url = URL_GAUGE_BUILDER_PREFIX + bp;
        console.log('loading url', url);
        await page.setViewport({
          width: 700,
          height: 780,
          deviceScaleFactor: 1
        });
        await page.goto(url);
        // original image
        await generateImageAndSaveS3(page, bp, '-original', 155, 98)
        // rotate image 45
        // await page.evaluate(() => { document.body.style.transform = 'rotate(45deg)'; });
        // await generateImageAndSaveS3(page, bp,'-rotated45', 200, 160)
        // rotate image 90
        // await page.evaluate(() => { document.body.style.transform = 'rotate(90deg)'; });
        // await generateImageAndSaveS3(page, bp, '-rotated90', 190, 235)
        // rotate image 135
        // await page.evaluate(() => { document.body.style.transform = 'rotate(135deg)'; });
        // await generateImageAndSaveS3(page, bp, '-rotated135', 135, 290)
        // rotate image 180
        // await page.evaluate(() => { document.body.style.transform = 'rotate(180deg)'; });
        // await generateImageAndSaveS3(page, bp,'-rotated180', 58, 270)
        // rotate image 270
        // await page.evaluate(() => { document.body.style.transform = 'rotate(270deg)'; });
        // await generateImageAndSaveS3(page, bp, '-rotated270', 23, 137)
    }
    // finished
    console.log('finished taking screenshots');
    // write manifest file
    const manifestLabelsText = manifestLabels.join('\r\n')
    console.log('manifestLabelsText', manifestLabelsText)
    // save manifest file to S3
    const manifestS3Key = S3_IMAGE_FOLDER + '/gauge-pressure.manifest'
    const manifestS3Params = {
      Bucket: s3Bucket,
      Key: manifestS3Key,
      Body: manifestLabelsText
    };
    console.log('writing manifest file to S3 - s3://' + s3Bucket + '/' + manifestS3Key)
    await s3.putObject(manifestS3Params).promise();
} catch (error) {
    // return callback(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
  return imageList
  // return callback(null, imageList);
};

exports.handler();
