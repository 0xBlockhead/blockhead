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
	}: EntityListViewProps<EntityType.EvmContract> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmContract}
	bind:open
	resource={
		selection({
			fields: {
				precompileName: true,
				address: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: evmContract })}
		{@const evmContractSelector = evmContract[EntityMetaKey.Selector]}
		{@const network = evmContractSelector.$network}
		<EntityView
			entityType={EntityType.EvmContract}
			entitySelector={evmContractSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						address: evmContractSelector.address,
					}
				)
			}
		>
			{#snippet Title()}
				{[(evmContract.precompileName ?? ''), evmContractSelector.address].filter(Boolean).join(' ') || 'EVM contract'}
			{/snippet}

			{#snippet Value()}
				{[(evmContract.precompileName ?? ''), evmContractSelector.address].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmContract.$network.name || (evmContract.$network.caip2 == null ? '' : `${evmContract.$network.caip2.namespace}:${evmContract.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
