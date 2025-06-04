/**
 * Determines a folder name based on an ID, categorized by intervals of 1000.
 * Migrated from helper.php -> folder()
 */
export function getFolder(id: number): string {
  if (id < 1000) return "0000";
  if (id >= 1000 && id < 2000) return "1000";
  if (id >= 2000 && id < 3000) return "2000";
  if (id >= 3000 && id < 4000) return "3000";
  if (id >= 4000 && id < 5000) return "4000";
  if (id >= 5000 && id < 6000) return "5000";
  if (id >= 6000 && id < 7000) return "6000";
  if (id >= 7000 && id < 8000) return "7000";
  if (id >= 8000 && id < 9000) return "8000";
  if (id >= 9000 && id < 10000) return "9000";
  if (id >= 10000 && id < 11000) return "10000";
  if (id >= 11000 && id < 12000) return "11000";
  if (id >= 12000 && id < 13000) return "12000";
  if (id >= 13000 && id < 14000) return "13000";
  if (id >= 14000 && id < 15000) return "14000";
  if (id >= 15000 && id < 16000) return "15000";
  if (id >= 16000 && id < 17000) return "16000";
  // PHP function didn't have a default case for >= 17000, returning empty string based on typical PHP behavior for unhandled cases
  return "";
}

/**
 * Cleans a string by removing spaces and special characters.
 * Migrated from helper.php -> string_clean()
 */
export function cleanString(input: string): string {
  let cleanedString = input.replace(/\s/g, ""); // Replace all spaces with empty string
  cleanedString = cleanedString.replace(/[^a-zA-Z0-9\-]/g, ""); // Remove special chars except hyphens
  return cleanedString;
}

import type { H3Event } from "h3";
import sharp from "sharp";
import fs from "fs/promises"; // Import fs for file operations

/**
 * Attempts to get the real client IP address from the request.
 * Migrated from helper.php -> getRealIp()
 */
export function getRealClientIp(event: H3Event): string | undefined {
  // Check for IP addresses forwarded by proxies
  const forwardedFor = event.req.headers["x-forwarded-for"];
  if (forwardedFor) {
    // x-forwarded-for can be a comma-separated list of IPs
    if (Array.isArray(forwardedFor)) {
      return forwardedFor[0]; // Take the first one (client IP)
    } else {
      return forwardedFor.split(",")[0].trim();
    }
  }

  // If not behind a proxy, get the direct connection IP
  return event.req.socket.remoteAddress;
}

/**
 * Formats a long date string (YYYY-MM-DD HH:MM:SS) to a short date (RomanMonth/Day).
 * Migrated from helper.php -> short_date()
 */
export function formatShortDate(longDate: string): string {
  // Handle empty or invalid date strings
  if (!longDate || longDate === "0000-00-00 00:00:00") {
    return "---"; // Matching PHP's behavior for "0000-00-00 00:00:00"
  }

  const date = new Date(longDate);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return longDate; // Return original string if date is invalid
  }

  const month = date.getMonth() + 1; // getMonth() is 0-indexed
  const day = date.getDate();

  let romanMonth = "";
  switch (month) {
    case 1:
      romanMonth = "I";
      break;
    case 2:
      romanMonth = "II";
      break;
    case 3:
      romanMonth = "III";
      break;
    case 4:
      romanMonth = "IV";
      break;
    case 5:
      romanMonth = "V";
      break;
    case 6:
      romanMonth = "VI";
      break;
    case 7:
      romanMonth = "VII";
      break;
    case 8:
      romanMonth = "VIII";
      break;
    case 9:
      romanMonth = "IX";
      break;
    case 10:
      romanMonth = "X";
      break;
    case 11:
      romanMonth = "XI";
      break;
    case 12:
      romanMonth = "XII";
      break;
    default:
      romanMonth = month.toString(); // Should not happen for valid dates
  }

  return `${romanMonth}/${day}`;
}

/**
 * Adds a GMT offset (in hours) to a given timestamp string.
 * Migrated from helper.php -> gmt()
 */
export function addGmtOffsetToTimestamp(
  gmtOffset: number,
  timestamp: string
): string {
  // Handle the "0000-00-00 00:00:00" case
  if (timestamp === "0000-00-00 00:00:00") {
    return "---";
  }

  const date = new Date(timestamp);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return timestamp; // Return original string if date is invalid
  }

  // Add the GMT offset in hours
  date.setHours(date.getHours() + gmtOffset);

  // Format the date back to "YYYY-MM-DD HH:MM:SS"
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Returns a Mongolian nationality name based on input (string or number).
 * Migrated from helper.php -> nationality()
 */
export function getNationalityName(input: string | number): string | undefined {
  switch (input) {
    case "altai-urianhai":
    case 1:
      return "Алтайн Урианхай";
    case "barga":
    case 2:
      return "Барга";
    case "baoan":
    case 3:
      return "Баоань";
    case "bayd":
    case 4:
      return "Баяд";
    case "buriad":
    case 5:
      return "Буриад";
    case "darhad":
    case 6:
      return "Дархад";
    case "dariganga":
    case 7:
      return "Дарьганга";
    case "deed":
    case 8:
      return "Дээд Монголчууд";
    case "durvud":
    case 9:
      return "Дөрвөд";
    case "zahchin":
    case 10:
      return "Захчин";
    case "kazak":
    case 11:
      return "Казах Хасаг";
    case "mongor":
    case 12:
      return "Монгор Ту";
    case "myngad":
    case 13:
      return "Мянгад";
    case "uuld":
    case 14:
      return "Өөлд";
    case "oirad":
    case 15:
      return "Синьцзяны Ойрадууд";
    case "torguud":
    case 16:
      return "Торгууд";
    case "tuva":
    case 17:
      return "Тува Урианхай";
    case "uzemchin":
    case 18:
      return "Үзэмчин";
    case "halh":
    case 19:
    case 24: // Duplicate case in PHP
      return "Халх";
    case "hamniga":
    case 20:
      return "Хамниган";
    case "hotogoid":
    case 21:
      return "Хотогойд";
    case "hoton":
    case 22:
      return "Хотон";
    case "huvsgul-urianhai":
    case 23:
      return "Хөвсгөлийн Урианхай Ар Ширхтэн Урианхай";
    case "tsahar":
    case 25:
      return "Цахар";
    default:
      return undefined; // Or return "" to match PHP's likely behavior
  }
}

/**
 * Maps a numerical input to a progress bar value (0-100) in steps of 5.
 * Migrated from helper.php -> progress()
 */
export function getProgressBarValue(input: number): number {
  if (input < 5) return 0;
  if (input >= 5 && input < 10) return 5;
  if (input >= 10 && input < 15) return 10;
  if (input >= 15 && input < 20) return 15;
  if (input >= 20 && input < 25) return 20;
  if (input >= 25 && input < 30) return 25;
  if (input >= 30 && input < 35) return 30;
  if (input >= 35 && input < 40) return 35;
  if (input >= 40 && input < 45) return 40;
  if (input >= 45 && input < 50) return 45;
  if (input >= 50 && input < 55) return 50;
  if (input >= 55 && input < 60) return 55;
  if (input >= 60 && input < 65) return 60;
  if (input >= 65 && input < 70) return 65;
  if (input >= 70 && input < 75) return 70;
  if (input >= 75 && input < 80) return 75;
  if (input >= 80 && input < 85) return 80;
  if (input >= 85 && input < 90) return 85;
  if (input >= 90 && input < 95) return 90;
  if (input >= 95 && input < 100) return 95;
  if (input >= 100) return 100;

  return 0; // Default case, though the PHP logic covers all >= 0
}

/**
 * Generates a tracking URL based on the tracking number format.
 * Migrated from helper.php -> track()
 */
export function getTrackingUrl(trackNumber: string): string {
  const lowered = trackNumber.toLowerCase();

  if (lowered.startsWith("1z")) {
    return `https://wwwapps.ups.com/WebTracking/processInputRequest?sort_by=status&tracknums_displayed=1&TypeOfInquiryNumber=T&loc=en_US&InquiryNumber1=${trackNumber}&track.x=0&track.y=0`;
  }

  if (lowered.startsWith("tba")) {
    // Note: This URL seems specific to shuurkhai.com, ensure it's accessible/relevant
    return `https://www.shuurkhai.com/login/index.php/welcome/amazon_track/`;
  }

  // USPS tracking patterns
  const uspsPatterns = [
    "9405",
    "9505",
    "9261",
    "9205",
    "9407",
    "9303",
    "9270",
    "9208",
    "9305",
    "9202",
    "9400",
    "420", // This is usually a prefix for longer tracking numbers
    "9361",
    "9374",
    "9500",
    "9274",
    "9410",
  ];
  const startsWithUspsPattern = uspsPatterns.some((pattern) =>
    lowered.startsWith(pattern)
  );

  if (
    (startsWithUspsPattern || lowered.length === 13) &&
    !lowered.startsWith("1z") &&
    !lowered.startsWith("tba")
  ) {
    // The PHP logic for excluding certain patterns when also checking length 13 is complex.
    // This implementation assumes the most common USPS patterns and length 13 point to USPS.
    // Further refinement may be needed if the PHP logic had very specific exclusions.
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackNumber}`;
  }

  // The remaining logic in PHP suggests if none of the above match and it's not empty, it's FedEx.
  if (lowered !== "") {
    return `https://www.fedex.com/apps/fedextrack/?action=track&tracknumbers=${trackNumber}`;
  }

  // PHP's default case returns the Yahoo search URL, which might be a fallback.
  // Let's return an empty string or a default URL if no match is found and input is empty.
  return lowered !== ""
    ? `https://search.yahoo.com/yhs/search;_ylt=A0LEVvVpNPZWOgwAJW8nnIlQ;_ylc=X1MDMTM1MTE5NTY4NwRfcgMyBGZyA3locy1tb3ppbGxhLTAwMQRncHJpZAN0MGFZd0U5cVExT1FRWm1uUlZPQzVBBG5fcnNsdAMwBG5fc3VnZwMxBG9yaWdpbgNzZWFyY2gueWFob28uY29tBHBvcwMwBHBxc3RyAwRwcXN0cmwDBHFzdHJsAzIyBHF1ZXJ5Azk2MTI4MDQ2ODM3Mzg1MjcxNTU0MDQEdF9zdG1wAzE0NTg5Nzc0NTU-?p=${trackNumber}&fr2=sb-top-search&hspart=mozilla&hsimp=yhs-001`
    : "";
}

/**
 * Generates HTML img tags for a list of card names.
 * Migrated from helper.php -> cards_in_image()
 */
export function generateCardImagesHtml(
  cardsString: string,
  size: number = 60
): string {
  let html = "";
  // Ensure size is within the valid range as per PHP logic
  const finalSize = size < 0 || size > 60 ? 60 : size;

  if (cardsString) {
    const cardNames = cardsString.split(",");
    for (const cardName of cardNames) {
      const cleanedCardName = cardName.trim().replace(/\s/g, ""); // Trim whitespace and remove spaces
      if (cleanedCardName) {
        // Assuming images are in the public/img directory
        const imgSrc = `/img/${cleanedCardName}.png`;
        // PHP had a file_exists check commented out, so we'll generate the tag directly.
        html += `<img src="${imgSrc}" width="${finalSize}" style="align:left">`;
      }
    }
  }

  return html;
}

/**
 * Resizes an image using sharp.
 * Migrated from helper.php -> resize_image()
 * Note: This implementation returns a Buffer. Adapt based on how the output image is used (e.g., save to file, send as response).
 */
export async function resizeImage(
  fileBuffer: Buffer, // Assuming input is a buffer, can be adapted to file path
  w: number,
  h: number,
  crop: boolean = false
): Promise<Buffer> {
  const image = sharp(fileBuffer);
  const metadata = await image.metadata();
  const { width, height } = metadata;

  if (!width || !height) {
    throw new Error("Could not get image dimensions.");
  }

  let newWidth = w;
  let newHeight = h;

  if (crop) {
    // PHP's crop logic seems complex and potentially calculates new source dimensions for cropping.
    // sharp's crop works differently, focusing on the output area.
    // A simple implementation for 'crop' in sharp is to resize with a 'cover' fit.
    // This will maintain aspect ratio and crop to fill the target dimensions.
    // If the PHP logic's crop behavior is different, this might need adjustment.
    return image
      .resize(newWidth, newHeight, { fit: sharp.fit.cover })
      .toBuffer();
  } else {
    // PHP's non-crop logic resizes while maintaining aspect ratio, fitting within w and h.
    // sharp's 'inside' fit achieves this.
    return image
      .resize(newWidth, newHeight, { fit: sharp.fit.inside })
      .toBuffer();
  }
}

/**
 * Reads an image from a source path, resizes, converts to WebP, and saves to a destination path.
 * Migrated from helper.php -> AnyImgSaveCompress2Webp()
 */
export async function convertAndSaveImageToWebp(
  sourceFilePath: string,
  destinationFilePath: string,
  maxWidth: number,
  maxHeight: number
): Promise<void> {
  try {
    const image = sharp(sourceFilePath);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    if (!width || !height) {
      throw new Error("Could not get image dimensions.");
    }

    // Calculate new dimensions while maintaining aspect ratio, fitting within max dimensions.
    // This matches the logic in the PHP function roughly.
    const ratio = width / height;
    let newWidth = maxWidth;
    let newHeight = maxHeight;

    if (newWidth / newHeight > ratio) {
      newWidth = newHeight * ratio;
    } else {
      newHeight = newWidth / ratio;
    }

    await image
      .resize(Math.round(newWidth), Math.round(newHeight), {
        fit: sharp.fit.inside,
      })
      .webp() // Convert to WebP
      .toFile(destinationFilePath); // Save to file

    console.log(
      `Successfully converted and saved ${sourceFilePath} to ${destinationFilePath}`
    );
  } catch (error) {
    console.error(`Error processing image ${sourceFilePath}:`, error);
    throw error; // Re-throw or handle as needed
  }
}

/**
 * Generates an HTML div for Bootstrap alerts.
 * Migrated from helper.php -> alert_div()
 */
export function generateAlertHtml(
  message: string,
  type: string = "danger"
): string {
  // PHP echoes directly, but in a server utility we return the string.
  return `<div class="alert alert-${type}">${message}</div>`;
}

/**
 * Sanitizes an input string by removing specific characters and keywords.
 * Migrated from helper.php -> protect()
 */
export function sanitizeInputString(input: string): string {
  let sanitized = input;
  sanitized = sanitized.replace(/</g, "");
  sanitized = sanitized.replace(/>/g, "");
  sanitized = sanitized.replace(/\*/g, ""); // Escape asterisk
  sanitized = sanitized.replace(/script/gi, ""); // case-insensitive replace for "script"
  sanitized = sanitized.replace(/\s+and\s+/gi, " "); // Replace " and " with a single space, case-insensitive
  sanitized = sanitized.replace(/\s+or\s+/gi, " "); // Replace " or " with a single space, case-insensitive
  sanitized = sanitized.replace(/'/g, "");
  sanitized = sanitized.replace(/"/g, "");
  return sanitized;
}

// TODO: Check for any other non-database helper functions in helper.php if needed.
// All identified non-database helper functions have been migrated.
