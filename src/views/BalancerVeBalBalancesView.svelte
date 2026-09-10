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
	}: EntityListViewProps<EntityType.BalancerVeBalBalance> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BalancerVeBalBalance}
	bind:open
	resource={
		selection({
			fields: {
				balance: true,
				locked: true,
				lockedUsd: true,
				$account: true,
			},
		})
	}
>
	{#snippet Item({ item: balancerVeBalBalance })}
		{@const balancerVeBalBalanceSelector = balancerVeBalBalance[EntityMetaKey.Selector]}
		{@const account = balancerVeBalBalanceSelector.$account}
		<EntityView
			entityType={EntityType.BalancerVeBalBalance}
			entitySelector={balancerVeBalBalanceSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/balancer/vebal',
					{
						network: (
							'caip2' in account.$network ?
								caip2StringFromValue(account.$network.caip2)
							:
								account.$network.slug
						),
						accountId: account.$actor.address,
					}
				)
			}
		>
			{#snippet Title()}
				{balancerVeBalBalance.balance || 'Balancer veBAL balance'}
			{/snippet}

			{#snippet Value()}
				{[balancerVeBalBalance.locked, balancerVeBalBalance.lockedUsd].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{balancerVeBalBalanceSelector.$account.$actor.address || 'EVM account'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
