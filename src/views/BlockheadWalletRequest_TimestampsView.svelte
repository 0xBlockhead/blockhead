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
	}: EntityListViewProps<EntityType.BlockheadWalletRequest_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadWalletRequest_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				status: true,
				timestampMs: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadWalletRequestTimestamp })}
		{@const blockheadWalletRequestTimestampSelector = blockheadWalletRequestTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadWalletRequest_Timestamp}
			entitySelector={blockheadWalletRequestTimestampSelector}
			href={
				resolve(
					'/~/wallets/requests/[id=stringSegment]/(blockheadWalletRequest)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						id: blockheadWalletRequestTimestampSelector.$walletRequest.id,
						timestampMs: String(blockheadWalletRequestTimestampSelector.timestampMs),
						source: blockheadWalletRequestTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadWalletRequestTimestamp.status || 'blockhead wallet request timestamp'}
			{/snippet}

			{#snippet Value()}
				{blockheadWalletRequestTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadWalletRequestTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
