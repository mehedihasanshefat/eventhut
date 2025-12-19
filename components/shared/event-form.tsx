"use client";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema } from "@/lib/validator";
import { eventDefaultValues } from "@/constants";
import { Input } from "@/components/ui/input";
import Dropdown from "./dropdown";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { IEvent } from "@/lib/database/models/event.model";
import FileUploader from "./file-uploader";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { useUploadThing } from "@/lib/uploadthing";
// import type { ReactDatePickerCustomHeaderProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { createEvent } from "@/lib/actions/event.actions";
// TODO:
// Create dropdown and file-uploader
// Date Picker
// Event default values
// Image upload with useUploadThing
// Event actions ( create and update )

type EventFormProps = {
  userId: string;
  type: "Create" | "Update";
  event?: IEvent;
  eventId?: string;
};

function EventForm({ userId, type, event, eventId }: EventFormProps) {
  console.log("Form", userId);
  const [files, setFiles] = useState<File[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const { startUpload } = useUploadThing("imageUploader");
  const router = useRouter();
  const initialValues =
    event && type === "Update"
      ? {
          ...event,
          startDateTime: new Date(event.startDateTime),
          endDateTime: new Date(event.endDateTime),
        }
      : eventDefaultValues;
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialValues,
  });
  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    const eventData = values;
    let uploadedImageUrl = values.imageUrl;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);
      if (!uploadedImages) {
        return;
      }
      uploadedImageUrl = uploadedImages[0].url;
    }
    if (type === "Create") {
      try {
        const newEvent = await createEvent({
          event: { ...values, imageUrl: uploadedImageUrl },
          userId,
          path: "/profile",
        });
        if (newEvent) {
          form.reset();
          router.push(`/events/${newEvent._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="flex flex-col gap-5 md:flex-row">
          {/* Title */}
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="w-full">
                <Input
                  placeholder="Event title"
                  {...field}
                  className="input-field"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="categoryId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Dropdown
                  onChangeHandler={field.onChange}
                  value={field.value}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          {/* Description */}
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="h-72 w-full">
                <Textarea
                  placeholder="Description"
                  {...field}
                  className="textarea rounded-2xl"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="imageUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="w-full" data-invalid={fieldState.invalid}>
                <FileUploader
                  onFieldChange={field.onChange}
                  imageUrl={field.value}
                  setFiles={setFiles}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <Controller
            name="location"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="w-full">
                <div className="flex-center bg-grey-50 h-[54px] w-full overflow-hidden rounded-full px-4 py-2">
                  <Image
                    src="/assets/icons/location-grey.svg"
                    alt="calendar"
                    width={24}
                    height={24}
                  />
                  <Input
                    placeholder="Event location or Online"
                    {...field}
                    className="input-field"
                    aria-invalid={fieldState.invalid}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <Controller
            name="startDateTime"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="w-full">
                <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-(--cus-color-grey-50) px-4 py-2">
                  <Image
                    src="/assets/icons/calendar.svg"
                    alt="calendar"
                    width={24}
                    height={24}
                    className="filter-grey"
                  />
                  <p className="text-grey-600 ml-3 whitespace-nowrap">
                    Start Date:
                  </p>
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => {
                      if (date) field.onChange(date);
                    }}
                    showTimeSelect
                    timeInputLabel="Time"
                    dateFormat="MM/dd/yyyy h:mm aa"
                    wrapperClassName="datePicker"
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="endDateTime"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="w-full">
                <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-(--cus-color-grey-50) px-4 py-2">
                  <Image
                    src="/assets/icons/calendar.svg"
                    alt="calendar"
                    width={24}
                    height={24}
                    className="filter-grey"
                  />
                  <p className="ml-3 whitespace-nowrap text-(--cus-color-grey-600)">
                    End Date:
                  </p>
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => {
                      if (date) field.onChange(date);
                    }}
                    showTimeSelect
                    timeInputLabel="Time"
                    dateFormat="MM/dd/yyyy h:mm aa"
                    wrapperClassName="datePicker"
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="w-full">
                <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-(--cus-color-grey-50) px-4 py-2">
                  <Image
                    src="/assets/icons/dollar.svg"
                    alt="dollar"
                    width={24}
                    height={24}
                    className="filter-grey"
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    // FIXME:
                    className="p-regular-16 bg-grey-50 border-0 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Controller
                    name="isFree"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <div className="flex items-center">
                          <label
                            htmlFor="isFree"
                            className="pr-3 leading-none whitespace-nowrap peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Free ticket
                          </label>
                          <Checkbox
                            onCheckedChange={field.onChange}
                            checked={field.value}
                            id="isFree"
                            className="border-primary-500 mr-2 h-5 w-5 border-2"
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="url"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="w-full">
                <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-(--cus-color-grey-50) px-4 py-2">
                  <Image
                    src="/assets/icons/link.svg"
                    alt="link"
                    width={24}
                    height={24}
                  />
                  <Input
                    placeholder="URL"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className="input-field"
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? "Submitting..." : `${type} Event `}
        </Button>
      </FieldGroup>
    </form>
  );
}

export default EventForm;
