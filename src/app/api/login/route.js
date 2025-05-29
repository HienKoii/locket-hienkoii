import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Gọi API login của Locket
    const response = await fetch(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCQngaaXQIfJaH0aS2l7REgIjD7nL431So`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en",
        "Content-Type": "application/json",
        "User-Agent": "FirebaseAuth.iOS/10.23.1 com.locket.Locket/1.82.0 iPhone/18.0 hw/iPhone12_1",
        "X-Client-Version": "iOS/FirebaseSDK/10.23.1/FirebaseCore-iOS",
        "X-Firebase-GMPID": "1:641029076083:ios:cc8eb46290d69b234fa606",
        "X-Ios-Bundle-Identifier": "com.locket.Locket",
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
        clientType: "CLIENT_TYPE_IOS",
      }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
