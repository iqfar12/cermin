// import '@tensorflow/tfjs-backend-cpu';
// import {GPGPUContext, MathBackendWebGL, setWebGLContext} from '@tensorflow/tfjs-backend-webgl';
// import * as tf from '@tensorflow/tfjs-core';
// import {Platform} from '@tensorflow/tfjs-core';
import {Buffer} from 'buffer';
import * as tf from '@tensorflow/tfjs';
import * as faceapi from 'face-api.js';
import Video from 'react-native-video';
import Canvas, {
  Image,
  ImageData,
  CanvasRenderingContext2D,
} from 'react-native-canvas';

function parseHeaders(rawHeaders) {
  const headers = new Headers();
  // Replace instances of \r\n and \n followed by at least one space or
  // horizontal tab with a space https://tools.iefaceapi.tf.org/html/rfc7230#section-3.2
  const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
  preProcessedHeaders.split(/\r?\n/).forEach(line => {
    const parts = line.split(':');
    const key = parts.shift().trim();
    if (key) {
      const value = parts.join(':').trim();
      headers.append(key, value);
    }
  });
  return headers;
}

export async function _fetch(path, init, options) {
  return new Promise((resolve, reject) => {
    const request = new Request(path, init);
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
      const reqOptions = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || ''),
        url: '',
      };
      reqOptions.url =
        'responseURL' in xhr
          ? xhr.responseURL
          : reqOptions.headers.get('X-Request-URL');

      //@ts-ignore — ts belives the latter case will never occur.
      const body = 'response' in xhr ? xhr.response : xhr.responseText;

      resolve(new Response(body, reqOptions));
    };

    xhr.onerror = () => reject(new TypeError('Network request failed'));
    xhr.ontimeout = () => reject(new TypeError('Network request failed'));

    xhr.open(request.method, request.url, true);

    if (request.credentials === 'include') {
      xhr.withCredentials = true;
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false;
    }

    if (options != null && options.isBinary) {
      // In react native We need to set the response type to arraybuffer when
      // fetching binary resources in order for `.arrayBuffer` to work correctly
      // on the response.
      xhr.responseType = 'arraybuffer';
    }

    request.headers.forEach((value, name) => {
      xhr.setRequestHeader(name, value);
    });

    xhr.send(
      //@ts-ignore
      typeof request._bodyInit === 'undefined' ? null : request._bodyInit,
    );
  });
}

const createCanvasElement = function () {
  if (Canvas) {
    return new Canvas();
  }
  throw new Error(
    'createCanvasElement - missing Canvas implementation for RN environment',
  );
};

const createImageElement = function (x) {
  console.log('create image..');

  if (Image) {
    const canvas = createCanvasElement();
    return new Image();
  }
  throw new Error(
    'createImageElement - missing Image implementation for RN environment',
  );
};

class PlatformReactNative {
  async fetch(path, init, options) {
    return _fetch(path, init, options);
  }
}

function setupGlobals() {
  global.Buffer = Buffer;
}

let env = {
  fetch: _fetch,

  Canvas: Canvas,
  ImageData: ImageData,
  Image: Image,
  CanvasRenderingContext2D: CanvasRenderingContext2D,
  createImageElement,
  createCanvasElement,
  Video: Video,
};

faceapi.env.setEnv(env);
faceapi.tf.ENV.set('WEBGL_PACK', false);
// faceapi.tf.setBackend('cpu');
// faceapi.tf.env().registerFlag(
//   'IS_REACT_NATIVE', () => navigator && navigator.product === 'ReactNative');
// // console.log(faceapi.tf.env())

// if (faceapi.tf.env().getBool('IS_REACT_NATIVE')) {

//   // setupGlobals();
//   // registerWebGLBackend();
//   // faceapi.tf.setPlatform('react-native', new PlatformReactNative());
// }
