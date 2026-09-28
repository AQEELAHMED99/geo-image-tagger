import exifr from 'exifr';
import piexif from 'piexifjs';
import { decimalToDMS } from './geoUtils';

/**
 * Converts a JS string to UCS-2 / UTF-16LE byte array for Windows Explorer XP tags (XPTitle, XPKeywords, etc.)
 */
function stringToUCS2(str) {
  if (!str) return [];
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    bytes.push(code & 0xff);
    bytes.push((code >> 8) & 0xff);
  }
  bytes.push(0, 0);
  return bytes;
}

/**
 * Converts UCS-2 byte array back to JS string
 */
function ucs2ToString(bytes) {
  if (!bytes || !Array.isArray(bytes)) return '';
  let str = '';
  for (let i = 0; i < bytes.length - 1; i += 2) {
    const code = bytes[i] | (bytes[i + 1] << 8);
    if (code === 0) break;
    str += String.fromCharCode(code);
  }
  return str;
}

/**
 * Reads existing EXIF metadata and preview for an image file
 */
export async function readImageMetadata(file) {
  const previewUrl = URL.createObjectURL(file);

  // Get image dimensions
  const dimensions = await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = previewUrl;
  });

  let exifData = null;
  try {
    exifData = await exifr.parse(file, {
      gps: true,
      xmp: true,
      iptc: true,
      tiff: true,
      exif: true,
      reviveValues: true,
      translateKeys: true,
    });
  } catch (err) {
    console.warn('Could not parse EXIF with exifr:', err);
  }

  let latitude = null;
  let longitude = null;
  let altitude = null;
  let title = '';
  let description = '';
  let keywords = '';
  let author = '';
  let copyright = '';
  let dateTime = '';

  if (exifData) {
    if (typeof exifData.latitude === 'number') latitude = exifData.latitude;
    if (typeof exifData.longitude === 'number') longitude = exifData.longitude;
    if (typeof exifData.altitude === 'number') altitude = exifData.altitude;

    title = exifData.XPTitle || exifData.headline || exifData.title || '';
    if (Array.isArray(title)) title = ucs2ToString(title);

    description = exifData.ImageDescription || exifData.description || exifData.caption || '';
    if (Array.isArray(description)) description = ucs2ToString(description);

    const xpKeywords = exifData.XPKeywords || exifData.Keywords || exifData.subject;
    if (Array.isArray(xpKeywords)) {
      if (typeof xpKeywords[0] === 'number') {
        keywords = ucs2ToString(xpKeywords);
      } else {
        keywords = xpKeywords.join(', ');
      }
    } else if (typeof xpKeywords === 'string') {
      keywords = xpKeywords;
    }

    author = exifData.XPAuthor || exifData.Artist || exifData.creator || '';
    if (Array.isArray(author)) author = ucs2ToString(author);

    copyright = exifData.Copyright || exifData.rights || '';

    if (exifData.DateTimeOriginal) {
      try {
        dateTime = new Date(exifData.DateTimeOriginal).toISOString().slice(0, 19).replace('T', ' ');
      } catch (e) {
        dateTime = String(exifData.DateTimeOriginal);
      }
    } else if (exifData.CreateDate) {
      try {
        dateTime = new Date(exifData.CreateDate).toISOString().slice(0, 19).replace('T', ' ');
      } catch (e) {
        dateTime = String(exifData.CreateDate);
      }
    }
  }

  return {
    id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    previewUrl,
    width: dimensions.width,
    height: dimensions.height,
    hasGeotag: latitude !== null && longitude !== null,
    latitude,
    longitude,
    altitude: altitude !== null ? Math.round(altitude) : null,
    title,
    description,
    keywords,
    author,
    copyright,
    dateTime: dateTime || new Date().toISOString().slice(0, 19).replace('T', ' '),
    isProcessed: false,
    processedBlob: null,
    processedUrl: null,
  };
}

/**
 * Encodes GPS coordinates into piexif format
 */
function degToExifRational(decimal) {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = parseFloat(((minutesNotTruncated - minutes) * 60).toFixed(4));

  return [
    [degrees, 1],
    [minutes, 1],
    [Math.round(seconds * 10000), 10000]
  ];
}

/**
 * Converts any File / Blob to a JPEG Data URL via Canvas if needed
 */
async function fileToJpegDataUrl(file) {
  if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Convert PNG / WebP to high quality JPEG data URL
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      // Fill white background for transparent images
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.98);
      resolve(dataUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image into canvas'));
    };
    img.src = url;
  });
}

/**
 * Writes EXIF metadata (GPS, XP tags, IPTC/EXIF fields) to the image
 */
export async function writeExifToImage(imageItem, customData = {}) {
  const lat = customData.latitude !== undefined ? customData.latitude : imageItem.latitude;
  const lng = customData.longitude !== undefined ? customData.longitude : imageItem.longitude;
  const alt = customData.altitude !== undefined ? customData.altitude : imageItem.altitude;
  const title = customData.title !== undefined ? customData.title : imageItem.title;
  const description = customData.description !== undefined ? customData.description : imageItem.description;
  const keywords = customData.keywords !== undefined ? customData.keywords : imageItem.keywords;
  const author = customData.author !== undefined ? customData.author : imageItem.author;
  const copyright = customData.copyright !== undefined ? customData.copyright : imageItem.copyright;
  const dateTime = customData.dateTime || imageItem.dateTime || new Date().toISOString().slice(0, 19).replace('T', ' ');

  const jpegDataUrl = await fileToJpegDataUrl(imageItem.file);

  // Load existing EXIF or create blank structure
  let exifObj;
  try {
    exifObj = piexif.load(jpegDataUrl);
  } catch (e) {
    exifObj = {
      "0th": {},
      "Exif": {},
      "GPS": {},
      "Interop": {},
      "1st": {},
      "thumbnail": null
    };
  }

  if (!exifObj["0th"]) exifObj["0th"] = {};
  if (!exifObj["Exif"]) exifObj["Exif"] = {};
  if (!exifObj["GPS"]) exifObj["GPS"] = {};

  // 1. Write GPS Tags
  if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
    const latRef = lat >= 0 ? 'N' : 'S';
    const lngRef = lng >= 0 ? 'E' : 'W';

    exifObj["GPS"][piexif.GPSIFD.GPSLatitudeRef] = latRef;
    exifObj["GPS"][piexif.GPSIFD.GPSLatitude] = degToExifRational(lat);

    exifObj["GPS"][piexif.GPSIFD.GPSLongitudeRef] = lngRef;
    exifObj["GPS"][piexif.GPSIFD.GPSLongitude] = degToExifRational(lng);

    if (alt !== null && !isNaN(alt)) {
      exifObj["GPS"][piexif.GPSIFD.GPSAltitudeRef] = alt >= 0 ? 0 : 1;
      exifObj["GPS"][piexif.GPSIFD.GPSAltitude] = [Math.round(Math.abs(alt) * 100), 100];
    }

    // GPS Map Datum standard
    exifObj["GPS"][piexif.GPSIFD.GPSMapDatum] = "WGS-84";
    exifObj["GPS"][piexif.GPSIFD.GPSVersionID] = [2, 2, 0, 0];
  }

  // 2. Write 0th IFD and Windows XP tags
  exifObj["0th"][piexif.ImageIFD.Software] = "GeoTagging Images Tool";

  if (description) {
    exifObj["0th"][piexif.ImageIFD.ImageDescription] = description;
    exifObj["0th"][piexif.ImageIFD.XPComment] = stringToUCS2(description);
  }

  if (title) {
    exifObj["0th"][piexif.ImageIFD.XPTitle] = stringToUCS2(title);
    exifObj["0th"][piexif.ImageIFD.XPSubject] = stringToUCS2(title);
  }

  if (keywords) {
    exifObj["0th"][piexif.ImageIFD.XPKeywords] = stringToUCS2(keywords);
  }

  if (author) {
    exifObj["0th"][piexif.ImageIFD.Artist] = author;
    exifObj["0th"][piexif.ImageIFD.XPAuthor] = stringToUCS2(author);
  }

  if (copyright) {
    exifObj["0th"][piexif.ImageIFD.Copyright] = copyright;
  }

  // Format date: "YYYY:MM:DD HH:MM:SS"
  let formattedDate = dateTime.replace(/[-]/g, ':').replace('T', ' ');
  if (formattedDate.length === 10) formattedDate += ' 12:00:00';
  exifObj["0th"][piexif.ImageIFD.DateTime] = formattedDate;
  exifObj["Exif"][piexif.ExifIFD.DateTimeOriginal] = formattedDate;
  exifObj["Exif"][piexif.ExifIFD.DateTimeDigitized] = formattedDate;

  // Dump and insert EXIF
  const exifBytes = piexif.dump(exifObj);
  const newJpegDataUrl = piexif.insert(exifBytes, jpegDataUrl);

  // Convert new data URL to Blob
  const byteString = atob(newJpegDataUrl.split(',')[1]);
  const mimeString = newJpegDataUrl.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const finalBlob = new Blob([ab], { type: mimeString });
  const finalUrl = URL.createObjectURL(finalBlob);

  const baseName = imageItem.name.replace(/\.[^/.]+$/, "");
  const extension = ".jpg";
  const outputFileName = `${baseName}_geotagged${extension}`;

  return {
    blob: finalBlob,
    url: finalUrl,
    fileName: outputFileName,
    latitude: lat,
    longitude: lng,
    altitude: alt,
    title,
    description,
    keywords,
    author,
    copyright,
    dateTime
  };
}
