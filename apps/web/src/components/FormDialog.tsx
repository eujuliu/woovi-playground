import {
  type ControllerRenderProps,
  useForm,
  type UseFormReturn,
} from "react-hook-form";
import { z, type ZodTypeDef } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { type ReactNode, useState } from "react";
import { Button } from "./ui/Button";
import { LoaderCircle } from "lucide-react";

export type FormDialogField = {
  id: string;
  label: string;
  description?: string;
  schema: ZodTypeDef;
  defaultValue: unknown;
  Control: (
    field: ControllerRenderProps<Record<string, unknown>, string>,
    form?: UseFormReturn,
  ) => ReactNode;
};

type FormDialogProps = {
  trigger: string;
  title: string;
  description: string;
  fields: FormDialogField[];
  loading: boolean;
  onSubmit: (
    values: Record<string, unknown>,
    form: UseFormReturn,
    setOpen: (value: boolean) => void,
  ) => void;
  onOpenChange?: (open: boolean) => void;
};

export const FormDialog = ({
  trigger,
  title,
  description,
  fields,
  onSubmit,
  onOpenChange,
  loading,
}: FormDialogProps) => {
  const [open, setOpen] = useState(false);
  const { schema, defaultValues } = fields.reduce(
    (acc, field) => {
      acc.schema[field.id] = field.schema;
      acc.defaultValues[field.id] = field.defaultValue;
      return acc;
    },
    { schema: {}, defaultValues: {} },
  );

  const formSchema = z.object({
    ...schema,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (onOpenChange) onOpenChange(value);
        setOpen(value);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="bg-[#133a6f] hover:bg-[#113463] text-neutral-50 hover:text-neutral-50 transition duration-400 text-sm cursor-pointer !p-2 !py-1 h-[32px]"
        >
          {trigger}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              onSubmit(data, form, setOpen),
            )}
            className="flex flex-col space-y-8"
          >
            {fields.map(({ id, label, description, Control }) => (
              <FormField
                key={id}
                control={form.control}
                name={id as string}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>{Control(field, form)}</FormControl>
                    <FormDescription className="text-xs">
                      {description}
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            ))}

            <Button type="submit" className="cursor-pointer">
              {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
