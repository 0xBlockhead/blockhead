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
	}: EntityListViewProps<EntityType.EvmNetworkAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmNetworkAccount_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$account: true,
				transactionCount: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: evmNetworkAccountTimestamp })}
		{@const evmNetworkAccountTimestampSelector = evmNetworkAccountTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmNetworkAccount_Timestamp}
			entitySelector={evmNetworkAccountTimestampSelector}
		>
			{#snippet Title()}
				{String(evmNetworkAccountTimestampSelector.$account.$actor.address) || 'EVM account'}
			{/snippet}

			{#snippet Value()}
				{String(evmNetworkAccountTimestamp.transactionCount ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(evmNetworkAccountTimestampSelector.timestampMs)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
