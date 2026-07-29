<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.A2aAgentService_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.A2aAgentService_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				health: true,
				reachable: true,
			},
		})
	}
>
	{#snippet Item({ item: a2aAgentServiceTimestamp })}
		{@const a2aAgentServiceTimestampSelector = a2aAgentServiceTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.A2aAgentService_Timestamp}
			entitySelector={a2aAgentServiceTimestampSelector}
		>
			{#snippet Title()}
				{a2aAgentServiceTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{a2aAgentServiceTimestamp.health ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{a2aAgentServiceTimestamp.reachable ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
