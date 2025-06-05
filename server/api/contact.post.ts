import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.name) {
    event.res.statusCode = 400;
    return { success: false, message: "Нэр оруулна уу." };
  }

  // Demo: өгөгдлийг хадгалахгүй, имэйл илгээхгүй
  return {
    success: true,
    message: "Таны илгээсэн мэдээлэл амжилттай хүлээн авлаа (demo).",
  };
});
