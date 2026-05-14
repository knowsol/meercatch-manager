import { NextRequest, NextResponse } from "next/server";
import { getKwsBaseUrl } from "@/lib/kwsServer";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json(
      { result: "error", message: "Invalid id" },
      { status: 400 },
    );
  }

  try {
    const base = getKwsBaseUrl();
    const response = await fetch(`${base}/api/kws-urls/${id}`, {
      method: "DELETE",
    });

    const text = await response.text();
    let body: unknown;
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      body = { raw: text };
    }

    return NextResponse.json(body, { status: response.status });
  } catch (error) {
    console.error("KWS URL delete error:", error);
    return NextResponse.json(
      { result: "error", message: "Failed to delete" },
      { status: 500 },
    );
  }
}
