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
	}: EntityListViewProps<EntityType.BlockheadAgentProviderCall> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAgentProviderCall}
	bind:open
	resource={
		selection({
			fields: {
				indexInTurn: true,
				status: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadAgentProviderCall })}
		{@const blockheadAgentProviderCallSelector = blockheadAgentProviderCall[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadAgentProviderCall}
			entitySelector={blockheadAgentProviderCallSelector}
		>
			{#snippet Title()}
				{`Call #${blockheadAgentProviderCallSelector.indexInTurn}`}
			{/snippet}

			{#snippet Value()}
				{blockheadAgentProviderCall.status ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
