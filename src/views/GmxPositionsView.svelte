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
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.GmxPosition> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GmxPosition}
	bind:open
	resource={
		selection({
			fields: {
				indexName: true,
				poolName: true,
				sizeInUsd: true,
				pnl: true,
			},
		})
	}
>
	{#snippet Item({ item: gmxPosition })}
		{@const gmxPositionSelector = gmxPosition[EntityMetaKey.Selector]}
		{@const account = gmxPositionSelector.$account}
		<EntityView
			entityType={EntityType.GmxPosition}
			entitySelector={gmxPositionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/gmx/position/[contractKey=evmTxHash]',
					{
						network: (
							account.$network.caip2 !== undefined ?
								caip2StringFromValue(account.$network.caip2)
							:
								account.$network.slug
						),
						accountId: account.$actor.address,
						contractKey: gmxPositionSelector.contractKey,
					}
				)
			}
		>
			{#snippet Title()}
				{[(gmxPosition.indexName ?? ''), (gmxPosition.poolName ?? '')].filter(Boolean).join(' ') || 'GMX position'}
			{/snippet}

			{#snippet Value()}
				{[gmxPosition.sizeInUsd, (gmxPosition.pnl ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
