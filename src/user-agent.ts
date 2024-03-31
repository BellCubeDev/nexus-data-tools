import meta from '../package.json';

const applicationUA = `NexusDataTools/${meta.version}`;
export default applicationUA;

export const applicationUAReqInit = {
    headers: { 'User-Agent': applicationUA, }
} as const satisfies RequestInit;
