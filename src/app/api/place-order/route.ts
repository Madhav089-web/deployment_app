import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { design_prompt, generated_json, size, quantity, total_price } = await req.json();

    if (!design_prompt || !generated_json || !size || !quantity || total_price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        user_id: session.user.id,
        design_prompt,
        generated_json: JSON.stringify(generated_json),
        size,
        quantity,
        total_price,
      },
    });

    return NextResponse.json({ message: "Order placed successfully", orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error("Place order error:", error);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}
