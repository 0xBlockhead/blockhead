<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.BlockheadAgentConnection> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAgentConnection}
	bind:open
	resource={
		selection({
			fields: {
				connectionId: true,
				connectionKind: true,
				enabled: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadAgentConnection })}
		{@const blockheadAgentConnectionSelector = blockheadAgentConnection[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadAgentConnection}
			entitySelector={blockheadAgentConnectionSelector}
		>
			{#snippet Title()}
				{blockheadAgentConnectionSelector.connectionId || 'blockhead agent connection'}
			{/snippet}

			{#snippet Value()}
				{blockheadAgentConnection.connectionKind ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadAgentConnection.enabled ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
