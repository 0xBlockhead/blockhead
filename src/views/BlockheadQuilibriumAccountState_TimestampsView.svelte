<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		title = 'Blockhead Quilibrium account state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadQuilibriumAccountState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadQuilibriumAccountState_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				balance: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadQuilibriumAccountStateTimestamp })}
		{@const blockheadQuilibriumAccountStateTimestampSelector = blockheadQuilibriumAccountStateTimestamp[EntityMetaKey.Selector]}
		{@const accountState = blockheadQuilibriumAccountStateTimestampSelector.$accountState}
		<EntityView
			entityType={EntityType.BlockheadQuilibriumAccountState_Timestamp}
			entitySelector={blockheadQuilibriumAccountStateTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/~/quilibrium/connection/[connectionId=stringSegment]/account-state/[accountAddress=stringSegment]/(blockheadQuilibriumAccountState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							accountState.$network.caip2 !== undefined ?
								caip2StringFromValue(accountState.$network.caip2)
							:
								accountState.$network.slug
						),
						connectionId: accountState.connectionId,
						accountAddress: accountState.accountAddress,
						timestampMs: String(blockheadQuilibriumAccountStateTimestampSelector.timestampMs),
						source: blockheadQuilibriumAccountStateTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadQuilibriumAccountStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadQuilibriumAccountStateTimestamp.balance ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadQuilibriumAccountStateTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
