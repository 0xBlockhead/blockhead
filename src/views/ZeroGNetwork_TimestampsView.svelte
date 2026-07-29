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
	}: EntityListViewProps<EntityType.ZeroGNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGNetwork_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$network: {
					fields: {
						name: true,
						environment: true,
					},
				},
				timestampMs: true,
				storageTransactionCount: true,
			},
		})
	}
>
	{#snippet Item({ item: zeroGNetworkTimestamp })}
		{@const zeroGNetworkTimestampSelector = zeroGNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ZeroGNetwork_Timestamp}
			entitySelector={zeroGNetworkTimestampSelector}
		>
			{#snippet Title()}
				{zeroGNetworkTimestamp.$network.name || 'zero g network'}
			{/snippet}

			{#snippet Value()}
				{zeroGNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{zeroGNetworkTimestamp.storageTransactionCount ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
