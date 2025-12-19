import EventForm from "@/components/shared/event-form";
import { getEventById } from "@/lib/actions/event.actions";
import { auth } from "@clerk/nextjs/server";

const UpdateEventPage = async ({ params }: { params: { id: string } }) => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;
  const { id } = await params;
  const event = await getEventById(id);
  console.log(event);

  return (
    <>
      <section className="cus-bg-dotted-pattern bg-(--cus-color-bg-primary) bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Update Event
        </h3>
      </section>

      <div className="wrapper my-8">
        <EventForm
          userId={userId}
          type="Update"
          event={event}
          eventId={event._id}
        />
      </div>
    </>
  );
};

export default UpdateEventPage;
