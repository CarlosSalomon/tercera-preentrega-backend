import { ticketsModel } from "../models/tickets.models.js";


export async function createTicket(ticket){
    return await ticketsModel.create(ticket)
}