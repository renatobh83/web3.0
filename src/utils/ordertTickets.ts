import { parseISO } from "date-fns";
import { orderBy } from "lodash";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const orderTickets = (tickets: any) => {
  const newTickes = orderBy(
    tickets,
    (obj) => parseISO(obj.lastMessageAt || obj.updatedAt),
    ["asc"]
  );
  return [...newTickes];
};
