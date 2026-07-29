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
	}: EntityListViewProps<EntityType.ArweaveNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ArweaveNetwork_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				latestHeight: true,
				source: true,
				reachable: true,
			},
		})
	}
>
	{#snippet Item({ item: arweaveNetworkTimestamp })}
		{@const arweaveNetworkTimestampSelector = arweaveNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ArweaveNetwork_Timestamp}
			entitySelector={arweaveNetworkTimestampSelector}
		>
			{#snippet Title()}
				{arweaveNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{arweaveNetworkTimestamp.latestHeight ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[arweaveNetworkTimestampSelector.source, String(arweaveNetworkTimestamp.reachable ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
