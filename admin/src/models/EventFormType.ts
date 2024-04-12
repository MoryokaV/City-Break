import { Event } from "./EventModel";
import { FormType } from "./FormType";

export type EventFormType = { notify: boolean } & FormType<Event>;