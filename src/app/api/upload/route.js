import { NextResponse } from "next/server";
import constants from "@/services/constants";

export async function POST(request) {
  try {
    const formData = await request.formData();
    console.log('formData', formData)
    const userStr = formData.get("user");

    if (!userStr) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = JSON.parse(userStr);
    const file = formData.get("file");
    const caption = formData.get("caption");
    const topColor = formData.get("topColor");
    const bottomColor = formData.get("bottomColor");
    const textColor = formData.get("textColor");
    const captionType = formData.get("captionType");
    const selectedBadge = formData.get("selectedBadge");
    const visibleTo = formData.get("visibleTo");

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const uploadFormData = new FormData();
    if (file.type.includes("image")) {
      uploadFormData.append("images", file);
    } else if (file.type.includes("video")) {
      uploadFormData.append("videos", file);
    }

    uploadFormData.append("caption", caption);
    uploadFormData.append("userId", user.localId);
    uploadFormData.append("idToken", user.idToken);
    uploadFormData.append("topColor", topColor);
    uploadFormData.append("bottomColor", bottomColor);
    uploadFormData.append("textColor", textColor);
    uploadFormData.append("captionType", captionType);
    uploadFormData.append("selectedBadge", selectedBadge);
    uploadFormData.append("visibleTo", visibleTo);

    const response = await fetch(constants.apiRoutes.UPLOAD_MEDIA_URL, {
      method: "POST",
      body: uploadFormData,
    });

    const result = await response.json();

    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
