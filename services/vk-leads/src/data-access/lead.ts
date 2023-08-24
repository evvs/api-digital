import { client } from '../entry-points/server.js';

enum LeadStatus {
    active = 1,
    archive = 2
}

interface LeadDb {
    status: LeadStatus,
    name: string,
}