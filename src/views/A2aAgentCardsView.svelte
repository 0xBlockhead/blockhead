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
	}: EntityListViewProps<EntityType.A2aAgentCard> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.A2aAgentCard}
	bind:open
	resource={
		selection({
			...{
				fields: {
					agentCardUrl: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: a2aAgentCard })}
		{@const a2aAgentCardSelector = a2aAgentCard[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.A2aAgentCard}
			entitySelector={a2aAgentCardSelector}
			href={
				resolve(
					'/(agents)/agents/a2a/card/[agentCardUrl=absoluteUrl]',
					{
						agentCardUrl: encodeURIComponent(a2aAgentCardSelector.agentCardUrl),
					}
				)
			}
		>
			{#snippet Title()}
				{a2aAgentCardSelector.agentCardUrl || 'A2A agent card'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
