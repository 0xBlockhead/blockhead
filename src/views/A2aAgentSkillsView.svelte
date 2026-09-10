<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.A2aAgentSkill> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.A2aAgentSkill}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				$cardSnapshot: {
					fields: {
						name: true,
						version: true,
						protocolVersion: true,
					},
				},
				skillId: true,
			},
		})
	}
>
	{#snippet Item({ item: a2aAgentSkill })}
		{@const a2aAgentSkillSelector = a2aAgentSkill[EntityMetaKey.Selector]}
		{@const cardSnapshot = a2aAgentSkillSelector.$cardSnapshot}
		<EntityView
			entityType={EntityType.A2aAgentSkill}
			entitySelector={a2aAgentSkillSelector}
			href={
				resolve(
					'/(agents)/agents/a2a/card/[agentCardUrl=absoluteUrl]/(a2aAgentCard)/snapshot/[contentHashAlgorithm=stringSegment]/[contentHash=zeroExHex]/(a2aAgentCardSnapshot)/skill/[skillId=stringSegment]',
					{
						agentCardUrl: encodeURIComponent(cardSnapshot.$card.agentCardUrl),
						contentHashAlgorithm: cardSnapshot.contentHashAlgorithm,
						contentHash: cardSnapshot.contentHash,
						skillId: a2aAgentSkillSelector.skillId,
					}
				)
			}
		>
			{#snippet Title()}
				{(a2aAgentSkill.name ?? '') || a2aAgentSkillSelector.skillId || 'A2A agent skill'}
			{/snippet}

			{#snippet Value()}
				{(a2aAgentSkill.$cardSnapshot.name ?? '') || a2aAgentSkillSelector.$cardSnapshot.contentHash || 'A2A agent card snapshot'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
