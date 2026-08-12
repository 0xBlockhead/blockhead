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
		title = 'Deposits',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BeaconDeposit> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconDeposit}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					indexInSlot: true,
					pubkey: true,
					amountGwei: true,
					slot: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: beaconDeposit })}
		{@const beaconDepositSelector = beaconDeposit[EntityMetaKey.Selector]}
		{@const network = beaconDepositSelector.$network}
		<EntityView
			entityType={EntityType.BeaconDeposit}
			entitySelector={beaconDepositSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/deposit/[index=nonNegativeInteger]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						slot: String(beaconDepositSelector.slot),
						index: String(beaconDepositSelector.indexInSlot),
					}
				)
			}
		>
			{#snippet Title()}
				{`Deposit #${beaconDepositSelector.indexInSlot}`}
			{/snippet}

			{#snippet Value()}
				{beaconDeposit.amountGwei + ' gwei'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{'Slot ' + beaconDepositSelector.slot}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
