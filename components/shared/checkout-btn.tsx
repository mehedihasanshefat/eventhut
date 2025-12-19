"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { createOrder } from "@/lib/actions/order.actions";
import { IEvent } from "@/lib/database/models/event.model";
import { Button } from "../ui/button";
import Link from "next/link";
import { toast } from "sonner";
import React from "react";

function CheckoutButton({ event }: { event: IEvent }) {
  const { user } = useUser();
  console.log(user);
  // IMPORTANT: this must be your MongoDB User _id
  const userId = user?.publicMetadata.user_id as string;

  const hasEventFinished = new Date(event.endDateTime) < new Date();
  console.log(userId);
  const handleCreateOrder = async () => {
    if (!userId) {
      toast.error("Please sign in first");
      return;
    }

    try {
      await createOrder({
        stripeId: crypto.randomUUID(), // ✅ RANDOM UNIQUE ID
        eventId: event._id.toString(), // ✅ string
        buyerId: userId, // ✅ string
        totalAmount: event.isFree ? "0" : event.price.toString(),
        createdAt: new Date(),
      });

      toast.success("Purchase successful 🎉");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex items-center gap-3">
      {hasEventFinished ? (
        <p className="p-2 text-red-400">
          Sorry, tickets are no longer available.
        </p>
      ) : (
        <>
          <SignedOut>
            <Button asChild className="button rounded-full" size="lg">
              <Link href="/sign-in">Get Tickets</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <Button
              type="button"
              size="lg"
              onClick={handleCreateOrder}
              className="button sm:w-fit"
            >
              {event.isFree ? "Get Ticket" : "Buy Ticket"}
            </Button>
          </SignedIn>
        </>
      )}
    </div>
  );
}

export default CheckoutButton;
