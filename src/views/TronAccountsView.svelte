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
	}: EntityListViewProps<EntityType.TronAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronAccount}
	bind:open
	resource={
		selection({
			...{
				fields: {
					address: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: tronAccount })}
		{@const tronAccountSelector = tronAccount[EntityMetaKey.Selector]}
		{@const network = tronAccountSelector.$network}
		<EntityView
			entityType={EntityType.TronAccount}
			entitySelector={tronAccountSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						accountId: tronAccountSelector.address,
					}
				)
			}
		>
			{#snippet Title()}
				{tronAccountSelector.address || 'tron account'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{tronAccount.$network.name || (tronAccount.$network.caip2 == null ? '' : `${tronAccount.$network.caip2.namespace}:${tronAccount.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
