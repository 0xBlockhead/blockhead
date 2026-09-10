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
			fields: {
				indexInBlock: true,
				pubkey: true,
				amountGwei: true,
				$block: {
					fields: {
						version: true,
						$slot: {
							fields: {
								$epoch: true,
							},
						},
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: beaconDeposit })}
		{@const beaconDepositSelector = beaconDeposit[EntityMetaKey.Selector]}
		{@const block = beaconDepositSelector.$block}
		<EntityView
			entityType={EntityType.BeaconDeposit}
			entitySelector={beaconDepositSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/deposit/[indexInBlock=nonNegativeInteger]',
					{
						network: (
							'caip2' in block.$network ?
								caip2StringFromValue(block.$network.caip2)
							:
								block.$network.slug
						),
						root: block.root,
						indexInBlock: String(beaconDepositSelector.indexInBlock),
					}
				)
			}
		>
			{#snippet Title()}
				{`Deposit #${beaconDepositSelector.indexInBlock}`}
			{/snippet}

			{#snippet Value()}
				{beaconDeposit.amountGwei + ' gwei'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{beaconDepositSelector.$block.root || 'beacon block'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
