export const runtime = "nodejs";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

// 👇 REQUIRED: allow Clerk to validate endpoint
export async function GET() {
  return NextResponse.json({ ok: true });
}

// (optional but recommended)
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const { id } = evt.data;
    const eventType = evt.type;

    if (eventType === "user.created") {
      const {
        id,
        email_addresses,
        image_url,
        first_name,
        last_name,
        username,
      } = evt.data;

      const user = {
        clerkId: id,
        email: email_addresses[0].email_address,
        username: username!,
        firstName: first_name!,
        lastName: last_name!,
        photo: image_url,
      };
      const newUser = await createUser(user);
      if (newUser) {
        const client = await clerkClient();

        await client.users.updateUserMetadata(id, {
          publicMetadata: {
            user_id: newUser._id.toString(),
          },
        });
      }
      return NextResponse.json({
        message: "OK",
        user: newUser,
      });
    }
    // Update user event ////////////////////////////////
    if (eventType === "user.updated") {
      const { id, image_url, first_name, last_name, username } = evt.data;

      const user = {
        firstName: first_name!,
        lastName: last_name!,
        username: username!,
        photo: image_url,
      };

      const updatedUser = await updateUser(id, user);

      return NextResponse.json({ message: "OK", user: updatedUser });
    }
    // Delete user event //////////////////////////////////
    if (eventType === "user.deleted") {
      const { id } = evt.data;

      const deletedUser = await deleteUser(id!);

      return NextResponse.json({ message: "OK", user: deletedUser });
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
