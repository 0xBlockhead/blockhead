import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { A2aAgentCardSelector } from '$/schema/A2aAgentCard.ts'
import { A2aAgentCard_SnapshotSelector } from '$/schema/A2aAgentCard_Snapshot.ts'
import { A2aAgentInterfaceSelector } from '$/schema/A2aAgentInterface.ts'
import { A2aAgentServiceSelector } from '$/schema/A2aAgentService.ts'
import { A2aAgentSkillSelector } from '$/schema/A2aAgentSkill.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { JsonObject, JsonValue } from '$/typescript/JsonValue.ts'
import {
	isJsonArray,
	isJsonObject,
	isJsonString,
} from '$/typescript/JsonValue.ts'

const textEncoder = new TextEncoder()

const canonicalJson = (
	value: JsonValue
): string => (
	isJsonArray(value) ?
		`[${value.map(canonicalJson).join(',')}]`
	: isJsonObject(value) ?
		`{${Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, child]) => `${JSON.stringify(key)}:${canonicalJson(child)}`).join(',')}}`
	:
		JSON.stringify(value)
)

const sha256Hex = async (
	value: string
) => (
	`0x${[...new Uint8Array(await crypto.subtle.digest('SHA-256', textEncoder.encode(value)))]
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('')}`
)

const jsonString = (
	value: JsonValue | undefined
) => (
	value != null && isJsonString(value) && value !== '' ?
		value
	:
		undefined
)

const jsonObject = (
	value: JsonValue | undefined
) => (
	value != null && isJsonObject(value) ?
		value
	:
		undefined
)

const jsonArray = (
	value: JsonValue | undefined
) => (
	value != null && isJsonArray(value) ?
		value
	:
		undefined
)

const snapshotFieldsFromCard = (
	card: JsonObject
) => ({
	name: jsonString(card.name),
	description: jsonString(card.description),
	version: jsonString(card.version),
	protocolVersion: jsonString(card.protocolVersion),
	providerName: jsonString(jsonObject(card.provider)?.organization),
	providerUrl: jsonString(jsonObject(card.provider)?.url),
	preferredTransport: jsonString(card.preferredTransport),
	defaultInputModes: jsonArray(card.defaultInputModes),
	defaultOutputModes: jsonArray(card.defaultOutputModes),
	capabilities: jsonObject(card.capabilities),
	extensions: jsonArray(card.extensions),
	securitySchemes: jsonObject(card.securitySchemes),
	security: jsonArray(card.security),
	signatures: jsonArray(card.signatures),
})

const cardSnapshotFromUrl = async (
	agentCardUrl: string
) => {
	const { fetchAgentCard } = await import('$/sources/A2a/Http/queries.ts')
	const card = await fetchAgentCard({ origin: agentCardUrl })
	if (!isJsonObject(card))
		throw new Error(`A2aWellKnown_Http: agent card is not a JSON object for ${agentCardUrl}`)

	const contentHash = await sha256Hex(canonicalJson(card))
	const snapshotSelector = {
		$card: { agentCardUrl },
		contentHashAlgorithm: 'sha256',
		contentHash,
	}

	return {
		[EntityMetaKey.Selector]: snapshotSelector,
		...snapshotFieldsFromCard(card),
		fetchedAt: Date.now(),
		snapshotKind: 'well-known-agent-card',
		$$interfaces: [
			...(jsonString(card.url) == null ?
				[]
			:
				[{
					[EntityMetaKey.Selector]: {
						$cardSnapshot: snapshotSelector,
						protocolBinding: jsonString(card.preferredTransport) ?? 'jsonrpc',
						url: jsonString(card.url),
					},
				}]),
			...Object.entries(jsonObject(card.additionalInterfaces) ?? {}).flatMap(([protocolBinding, interfaceValue]) => {
				const interfaceUrl = jsonString(jsonObject(interfaceValue)?.url)
				return interfaceUrl == null ?
					[]
				:
					[{
						[EntityMetaKey.Selector]: {
							$cardSnapshot: snapshotSelector,
							protocolBinding,
							url: interfaceUrl,
						},
					}]
			}),
		],
		$$skills: (jsonArray(card.skills) ?? []).flatMap((skill) => {
			const skillObject = jsonObject(skill)
			const skillId = jsonString(skillObject?.id)
			return skillObject == null || skillId == null ?
				[]
			:
				[{
					[EntityMetaKey.Selector]: {
						$cardSnapshot: snapshotSelector,
						skillId,
					},
					name: jsonString(skillObject.name),
					description: jsonString(skillObject.description),
					tags: jsonArray(skillObject.tags),
					examples: jsonArray(skillObject.examples),
					inputModes: jsonArray(skillObject.inputModes),
					outputModes: jsonArray(skillObject.outputModes),
				}]
		}),
	}
}

export default {
	source: Source.A2aWellKnown_Http,

	resolvers: [
		defineResolver(Source.A2aWellKnown_Http, {
			entityType: EntityType.A2aAgentInterface,
			resolve: {
				[A2aAgentInterfaceSelector.CardSnapshotProtocolBindingUrl]: {
					resolve: async ({ protocolBinding, url }) => ({
						protocolBinding,
						url,
					}),
				},
			},
		})({
			protocolBinding: (selection) => selection.protocolBinding,
			url: (selection) => selection.url,
		}),

		defineResolver(Source.A2aWellKnown_Http, {
			entityType: EntityType.A2aAgentService,
			resolve: {
				[A2aAgentServiceSelector.CardProtocolBindingEndpointUrl]: {
					resolve: async ({ protocolBinding, endpointUrl }) => ({
						protocolBinding,
						endpointUrl,
					}),
				},
			},
		})({
			protocolBinding: (selection) => selection.protocolBinding,
			endpointUrl: (selection) => selection.endpointUrl,
		}),

		defineResolver(Source.A2aWellKnown_Http, {
			entityType: EntityType.A2aAgentCard,
			resolve: {
				[A2aAgentCardSelector.AgentCardUrl]: {
					resolve: async ({ agentCardUrl }) => ({
						$$snapshots: [
							await cardSnapshotFromUrl(agentCardUrl),
						],
					}),
				},
			},
		})({
				$$snapshots: (snapshot) => snapshot.$$snapshots.map((cardSnapshot) => ({
					[EntityMetaKey.Selector]: cardSnapshot[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: {
						...Object.fromEntries(
							Object.entries(snapshotFieldsFromCard(cardSnapshot)).flatMap(([fieldName, value]) => (
								value == null ?
									[]
								:
									[[entityFieldAddressKey(EntityType.A2aAgentCard_Snapshot, [], fieldName), value]]
							))
						),
						[entityFieldAddressKey(EntityType.A2aAgentCard_Snapshot, [], 'fetchedAt')]: cardSnapshot.fetchedAt,
						[entityFieldAddressKey(EntityType.A2aAgentCard_Snapshot, [], 'snapshotKind')]: cardSnapshot.snapshotKind,
						[entityFieldAddressKey(EntityType.A2aAgentCard_Snapshot, [], '$$interfaces')]: cardSnapshot.$$interfaces.map((agentInterface) => ({
							[EntityMetaKey.Selector]: agentInterface[EntityMetaKey.Selector],
						})),
						[entityFieldAddressKey(EntityType.A2aAgentCard_Snapshot, [], '$$skills')]: cardSnapshot.$$skills.map((skill) => ({
							[EntityMetaKey.Selector]: skill[EntityMetaKey.Selector],
							[EntityMetaKey.Fields]: Object.fromEntries(
								Object.entries(skill).flatMap(([fieldName, value]) => (
									fieldName === EntityMetaKey.Selector || value == null ?
										[]
									:
										[[entityFieldAddressKey(EntityType.A2aAgentSkill, [], fieldName), value]]
								))
							),
						})),
					},
				})),
			}),

		defineResolver(Source.A2aWellKnown_Http, {
			entityType: EntityType.A2aAgentCard_Snapshot,
			resolve: {
				[A2aAgentCard_SnapshotSelector.CardContentHash]: {
					resolve: async ({ $card, source }) => {
						if (source !== Source.A2aWellKnown_Http)
							throw new Error(`A2aWellKnown_Http: unsupported source ${source}`)

						return cardSnapshotFromUrl($card.agentCardUrl)
					},
				},
			},
		})({
				fetchedAt: (snapshot) => snapshot.fetchedAt,
				snapshotKind: (snapshot) => snapshot.snapshotKind,
				name: (snapshot) => snapshot.name,
				description: (snapshot) => snapshot.description,
				version: (snapshot) => snapshot.version,
				protocolVersion: (snapshot) => snapshot.protocolVersion,
				providerName: (snapshot) => snapshot.providerName,
				providerUrl: (snapshot) => snapshot.providerUrl,
				preferredTransport: (snapshot) => snapshot.preferredTransport,
				defaultInputModes: (snapshot) => snapshot.defaultInputModes,
				defaultOutputModes: (snapshot) => snapshot.defaultOutputModes,
				capabilities: (snapshot) => snapshot.capabilities,
				extensions: (snapshot) => snapshot.extensions,
				securitySchemes: (snapshot) => snapshot.securitySchemes,
				security: (snapshot) => snapshot.security,
				signatures: (snapshot) => snapshot.signatures,
				$$interfaces: (snapshot) => snapshot.$$interfaces.map((agentInterface) => ({
					[EntityMetaKey.Selector]: agentInterface[EntityMetaKey.Selector],
				})),
				$$skills: (snapshot) => snapshot.$$skills.map((skill) => ({
					[EntityMetaKey.Selector]: skill[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: Object.fromEntries(
						Object.entries(skill).flatMap(([fieldName, value]) => (
							fieldName === EntityMetaKey.Selector || value == null ?
								[]
							:
								[[entityFieldAddressKey(EntityType.A2aAgentSkill, [], fieldName), value]]
						))
					),
				})),
			}),

		defineResolver(Source.A2aWellKnown_Http, {
			entityType: EntityType.A2aAgentSkill,
			resolve: {
				[A2aAgentSkillSelector.CardSnapshotSkillId]: {
					resolve: async ({
						$cardSnapshot,
						skillId,
					}) => {
						if ($cardSnapshot.contentHashAlgorithm !== 'sha256')
							throw new Error(`A2aWellKnown_Http: unsupported content hash algorithm ${$cardSnapshot.contentHashAlgorithm}`)

						const snapshot = await cardSnapshotFromUrl($cardSnapshot.$card.agentCardUrl)
						if (snapshot[EntityMetaKey.Selector].contentHash !== $cardSnapshot.contentHash)
							throw new Error('A2aWellKnown_Http: agent card content hash changed')

						const skill = snapshot.$$skills.find((candidate) => (
							candidate[EntityMetaKey.Selector].skillId === skillId
						))
						if (skill == null)
							throw new Error(`A2aWellKnown_Http: agent card skill ${skillId} was not found`)

						return skill
					},
				},
			},
		})({
			name: (skill) => skill.name,
			description: (skill) => skill.description,
			tags: (skill) => skill.tags,
			examples: (skill) => skill.examples,
			inputModes: (skill) => skill.inputModes,
			outputModes: (skill) => skill.outputModes,
		}),
	],
}
