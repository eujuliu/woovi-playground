import type { GetServerSideProps } from "next";

import { Chat } from "@/components/Chat";
import { Input } from "@/components/ui/Input";
import { FormDialog, type FormDialogField } from "@/components/FormDialog";
import { HomePageDataTable } from "@/components/HomePageDataTable";

import type { IAccount } from "@/graphql/fragments/Account";
import type { ITransaction } from "@/graphql/fragments/Transaction";

import { AccountAdd } from "@/graphql/mutations/AccountAddMutation";
import { TransactionAdd } from "@/graphql/mutations/TransactionAddMutation";

import { getPreloadedQuery } from "@/relay/network";

import type { AccountAddMutation } from "@/__generated__/AccountAddMutation.graphql";
import type { TransactionAddMutation } from "@/__generated__/TransactionAddMutation.graphql";

import AccountsQuery, {
  type AccountsQuery as AccountsQueryType,
} from "@/__generated__/AccountsQuery.graphql";

import MessagesQuery, {
  type MessagesQuery as MessageQueryType,
} from "@/__generated__/MessagesQuery.graphql";

import TransactionsQuery, {
  type TransactionsQuery as TransactionsQueryType,
} from "@/__generated__/TransactionsQuery.graphql";

import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useMutation, type PreloadedQuery } from "react-relay";
import { z } from "zod";

type IndexProps = {
  queryRefs: {
    Accounts: PreloadedQuery<AccountsQueryType>;
    Transactions: PreloadedQuery<TransactionsQueryType>;
    Messages: PreloadedQuery<MessageQueryType>;
  };
};

const createAccountFields: FormDialogField[] = [
  {
    id: "name",
    label: "Name",
    description: "This is the name of your account",
    defaultValue: "",
    Control: (field) => (
      <Input
        placeholder="Type the account name"
        onChange={field.onChange}
        value={field.value}
      />
    ),
    schema: z
      .string()
      .min(5)
      .regex(/^[a-zA-Z0-9_]+(?: [a-zA-Z0-9_]+)*$/g, {
        message: "Accounts only can have alphanumerics",
      }),
  },
];

const newTransferFields: FormDialogField[] = [
  {
    id: "from",
    label: "From",
    description: "This is the account that will send the amount",
    defaultValue: "",
    Control: (field) => (
      <Input
        placeholder="Type the account ID"
        onChange={field.onChange}
        value={field.value}
      />
    ),
    schema: z
      .string()
      .nonempty()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i, {
        message: "This is not a valid account ID",
      }),
  },
  {
    id: "to",
    label: "To",
    description: "This is the account that will receive the amount",
    defaultValue: "",
    Control: (field) => (
      <Input
        placeholder="Type the account ID"
        onChange={field.onChange}
        value={field.value}
      />
    ),
    schema: z
      .string()
      .nonempty()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i, {
        message: "This is not a valid account ID",
      }),
  },
  {
    id: "amount",
    label: "Amount",
    description: "This is the amount that will be sent",
    defaultValue: "",
    Control: (field) => {
      const [displayValue, setDisplayValue] = useState("");

      const formatCurrency = (value: string) => {
        const rawValue = value.replace(/\D/g, "");
        const numValue = rawValue ? Number.parseInt(rawValue) / 100 : 0;

        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(numValue);
      };

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\d]/g, "");

        setDisplayValue(formatCurrency(value));

        const numericValue = value ? Number.parseInt(value).toString() : "";
        field.onChange(numericValue);
      };

      return (
        <Input
          placeholder="$5.00"
          type="text"
          className="w-[50%]"
          onChange={handleChange}
          value={displayValue || formatCurrency(field.value)}
        />
      );
    },
    schema: z.preprocess((val) => Number(val), z.number().positive()),
  },
];

const Index = ({ queryRefs }: IndexProps) => {
  const [accountAdd, loadingAccount] =
    useMutation<AccountAddMutation>(AccountAdd);
  const [transactionAdd, loadingTransaction] =
    useMutation<TransactionAddMutation>(TransactionAdd);

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col gap-2 p-4 max-w-[1200px] w-full">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="text-4xl font-medium">Dashboard</div>
          <div className="flex gap-2">
            <FormDialog
              trigger="Create Account"
              title="Create your new account"
              description="This will create a new account for you, Click in save when you're done"
              onSubmit={(
                values: Omit<IAccount, "id" | "createdAt" | "balance">,
                form: UseFormReturn,
                setOpen: (value: boolean) => void,
              ) => {
                accountAdd({
                  variables: {
                    input: {
                      ...values,
                    },
                  },
                  onCompleted() {
                    setOpen(false);
                    form.reset();
                  },
                  onError() {},
                });
              }}
              fields={createAccountFields}
            />
            <FormDialog
              trigger="New Transfer"
              title="Make a transfer"
              description="This action can't be undone, Click in save when you're done"
              onSubmit={(
                values: Omit<ITransaction, "id" | "createdAt">,
                form: UseFormReturn,
                setOpen: (value: boolean) => void,
              ) => {
                transactionAdd({
                  variables: {
                    input: {
                      ...values,
                      type: "TRANSFER",
                    },
                  },
                  onCompleted() {
                    setOpen(false);
                    form.reset();
                  },
                  onError() {},
                });
              }}
              fields={newTransferFields}
            />
          </div>
        </div>
        <HomePageDataTable queryRefs={queryRefs} />
        {/* <Chat queryRef={queryRefs.Messages} /> */}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      preloadedQueries: {
        Accounts: await getPreloadedQuery(AccountsQuery, {
          first: 20,
          after: null,
        }),
        Transactions: await getPreloadedQuery(TransactionsQuery, {
          first: 20,
          after: null,
        }),
        Messages: await getPreloadedQuery(MessagesQuery, {
          first: 10,
          after: null,
        }),
      },
    },
  };
};

export default Index;
