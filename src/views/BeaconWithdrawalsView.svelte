<!-- Generated from APP.ts. Do not edit by hand. -->

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
		title = 'Withdrawals',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BeaconWithdrawal> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconWithdrawal}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				indexInSlot: true,
				amountGwei: true,
				slot: true,
			},
		})
	}
>
	{#snippet Item({ item: beaconWithdrawal })}
		{@const beaconWithdrawalSelector = beaconWithdrawal[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BeaconWithdrawal}
			entitySelector={beaconWithdrawalSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/withdrawal/[index=nonNegativeInteger]',
					{
						network: (
							'caip2' in beaconWithdrawalSelector.$network ?
								String(caip2StringFromValue(beaconWithdrawalSelector.$network.caip2))
							:
								String(beaconWithdrawalSelector.$network.slug)
						),
						slot: String(beaconWithdrawalSelector.slot),
						index: String(beaconWithdrawalSelector.indexInSlot),
					}
				)
			}
		>
			{#snippet Title()}
				{(String(beaconWithdrawalSelector.indexInSlot ?? '') ? 'Withdrawal #' + String(beaconWithdrawalSelector.indexInSlot ?? '') : '') || 'beacon withdrawal'}
			{/snippet}

			{#snippet Value()}
				{(String(beaconWithdrawal.amountGwei ?? '') ? String(beaconWithdrawal.amountGwei ?? '') + ' gwei' : '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(String(beaconWithdrawalSelector.slot) ? 'Slot ' + String(beaconWithdrawalSelector.slot) : '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
