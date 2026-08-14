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
			...{
				fields: {
					withdrawalIndex: true,
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
			},
		})
	}
>
	{#snippet Item({ item: beaconWithdrawal })}
		{@const beaconWithdrawalSelector = beaconWithdrawal[EntityMetaKey.Selector]}
		{@const block = beaconWithdrawalSelector.$block}
		<EntityView
			entityType={EntityType.BeaconWithdrawal}
			entitySelector={beaconWithdrawalSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/withdrawal/[withdrawalIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in block.$network ?
								caip2StringFromValue(block.$network.caip2)
							:
								block.$network.slug
						),
						root: block.root,
						withdrawalIndex: String(beaconWithdrawalSelector.withdrawalIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{`Withdrawal #${beaconWithdrawalSelector.withdrawalIndex}`}
			{/snippet}

			{#snippet Value()}
				{beaconWithdrawal.amountGwei != null ? beaconWithdrawal.amountGwei + ' gwei' : ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{beaconWithdrawalSelector.$block.root || 'beacon block'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
