import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { A2aAgentCardSelector } from '$/schema/A2aAgentCard.ts'
import { A2aAgentSkillSelector } from '$/schema/A2aAgentSkill.ts'
import { EntityType } from '$/schema/EntityType.ts'

const fetchAgentCard = vi.fn()

vi.mock('$/sources/A2a/Http/queries.ts', () => ({
	fetchAgentCard,
}))

const { default: a2aResolvers } = await import('$/resolvers/A2aWellKnown-Http.ts')

const resolverFor = (entityType: EntityType) => {
	const resolver = a2aResolvers.resolvers.find((candidate) => candidate.entityType === entityType)
	if (resolver == null)
		throw new Error(`A2aWellKnown_Http spec missing ${entityType} resolver`)

	return resolver
}

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const agentCardUrl = 'https://agent.example/.well-known/agent.json'
const card = {
	name: 'Example agent',
	skills: [
		{
			id: 'summarize',
			name: 'Summarize',
			description: 'Summarizes a document.',
			tags: [
				'documents',
			],
			examples: [
				'Summarize this report.',
			],
			inputModes: [
				'text/plain',
			],
			outputModes: [
				'text/plain',
			],
		},
	],
}

describe('A2A well-known agent skill resolution', () => {
	beforeEach(() => {
		fetchAgentCard.mockReset()
		fetchAgentCard.mockResolvedValue(card)
	})

	it('resolves a skill from the exact content-addressed agent card snapshot', async () => {
		const cardResolver = resolverFor(EntityType.A2aAgentCard)
		const cardSnapshot = (
			await cardResolver.resolve[A2aAgentCardSelector.AgentCardUrl].resolve({
				agentCardUrl,
			}, context)
		).$$snapshots[0][EntityMetaKey.Selector]
		const skillResolver = resolverFor(EntityType.A2aAgentSkill)

		await expect(skillResolver.resolve[A2aAgentSkillSelector.CardSnapshotSkillId].resolve({
			$cardSnapshot: cardSnapshot,
			skillId: 'summarize',
		}, context)).resolves.toMatchObject({
			name: 'Summarize',
			description: 'Summarizes a document.',
			tags: [
				'documents',
			],
			examples: [
				'Summarize this report.',
			],
			inputModes: [
				'text/plain',
			],
			outputModes: [
				'text/plain',
			],
		})
	})

	it('rejects a stale snapshot hash instead of resolving from changed card content', async () => {
		const skillResolver = resolverFor(EntityType.A2aAgentSkill)

		await expect(skillResolver.resolve[A2aAgentSkillSelector.CardSnapshotSkillId].resolve({
			$cardSnapshot: {
				$card: {
					agentCardUrl,
				},
				contentHashAlgorithm: 'sha256',
				contentHash: `0x${'00'.repeat(32)}`,
			},
			skillId: 'summarize',
		}, context)).rejects.toThrow('agent card content hash changed')
	})

	it('rejects a skill absent from the content-addressed card', async () => {
		const cardResolver = resolverFor(EntityType.A2aAgentCard)
		const cardSnapshot = (
			await cardResolver.resolve[A2aAgentCardSelector.AgentCardUrl].resolve({
				agentCardUrl,
			}, context)
		).$$snapshots[0][EntityMetaKey.Selector]
		const skillResolver = resolverFor(EntityType.A2aAgentSkill)

		await expect(skillResolver.resolve[A2aAgentSkillSelector.CardSnapshotSkillId].resolve({
			$cardSnapshot: cardSnapshot,
			skillId: 'missing',
		}, context)).rejects.toThrow('agent card skill missing was not found')
	})
})
