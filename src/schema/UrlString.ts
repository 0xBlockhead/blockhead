import { type } from 'arktype'


/** WHATWG URL string (`https:`, `wss:`, `ipfs:`, `at:`, `bzz:`, `mailto:`, `data:`, …). */
export const UrlString = type('string.url')
