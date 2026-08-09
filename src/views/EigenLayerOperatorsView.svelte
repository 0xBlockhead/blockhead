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
	}: EntityListViewProps<EntityType.EigenLayerOperator> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EigenLayerOperator}
	bind:open
	resource={
		selection({
			...{
				fields: {
					operatorAddress: true,
					name: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: eigenLayerOperator })}
		{@const eigenLayerOperatorSelector = eigenLayerOperator[EntityMetaKey.Selector]}
		{@const network = eigenLayerOperatorSelector.$network}
		<EntityView
			entityType={EntityType.EigenLayerOperator}
			entitySelector={eigenLayerOperatorSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer/(eigenLayerProtocol)/operator/[operatorAddress=evmAddress]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						operatorAddress: eigenLayerOperatorSelector.operatorAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{eigenLayerOperatorSelector.operatorAddress || 'eigen layer operator'}
			{/snippet}

			{#snippet Value()}
				{eigenLayerOperator.name ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eigenLayerOperator.$network.name || `${eigenLayerOperator.$network.caip2.namespace}:${eigenLayerOperator.$network.caip2.reference}` || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
