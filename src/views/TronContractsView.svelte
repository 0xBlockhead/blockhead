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
	}: EntityListViewProps<EntityType.TronContract> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronContract}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				$account: true,
				address: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: tronContract })}
		{@const tronContractSelector = tronContract[EntityMetaKey.Selector]}
		{@const network = tronContractSelector.$network}
		<EntityView
			entityType={EntityType.TronContract}
			entitySelector={tronContractSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/contract/[address=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						address: tronContractSelector.address,
					}
				)
			}
		>
			{#snippet Title()}
				{(tronContract.name ?? '') || tronContractSelector.address || 'tron contract'}
			{/snippet}

			{#snippet Value()}
				{tronContract.$account == null ? '' : tronContract.$account.address || 'tron account'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{tronContract.$network.name || (tronContract.$network.caip2 == null ? '' : `${tronContract.$network.caip2.namespace}:${tronContract.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
