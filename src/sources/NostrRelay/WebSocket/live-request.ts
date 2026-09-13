import { type } from 'arktype'

const filter = type({
	'ids?': 'string[]',
	'authors?': 'string[]',
	'kinds?': 'number.integer[]',
	'limit?': 'number.integer >= 0',
	'search?': 'string',
	'since?': 'number.integer >= 0',
	'until?': 'number.integer >= 0',
	'[string]': 'string[] | number[] | string | number | undefined',
}).narrow((value) => Object.keys(value).every((key) => (
	['ids', 'authors', 'kinds', 'limit', 'search', 'since', 'until'].includes(key)
	|| (/^#[a-zA-Z]$/.test(key) && Array.isArray(value[key]) && value[key].every((item) => typeof item === 'string'))
)))

export const NostrReadRequest = type({
	bindingId: 'string',
	targetKey: 'string',
	subscriptionId: '0 < string <= 64',
	filters: filter.array().atLeastLength(1),
}).onUndeclaredKey('reject')
