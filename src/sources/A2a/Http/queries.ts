import { getJson } from '$/lib/http.ts'
import type {
	A2aAgentCard,
	A2aServiceRequest,
	A2aServiceResponse,
} from '$/sources/A2a/Http/types.ts'

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, '')

const originFromUrl = (url: string) => new URL(url).origin

const agentCardUrl = (origin: string) => `${originFromUrl(origin)}/.well-known/agent.json`

const serviceUrl = ({
	origin,
	agentPath,
}: {
	origin: string
	agentPath: string
}) => `${originFromUrl(origin)}/${trimSlashes(agentPath)}`

export const fetchAgentCard = ({
	origin,
	signal,
}: {
	origin: string
	signal?: AbortSignal
}) => (
	getJson<A2aAgentCard>(agentCardUrl(origin), {
		origins: [
			{
				origin: originFromUrl(origin),
				corsEnabled: false,
			},
		],
		init: { signal },
	})
)

export const postServiceRequest = ({
	origin,
	agentPath,
	body,
	signal,
}: {
	origin: string
	agentPath: string
	body: A2aServiceRequest
	signal?: AbortSignal
}) => (
	getJson<A2aServiceResponse>(serviceUrl({
		origin,
		agentPath,
	}), {
		origins: [
			{
				origin: originFromUrl(origin),
				corsEnabled: false,
			},
		],
		init: {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(body),
			signal,
		},
	})
)
