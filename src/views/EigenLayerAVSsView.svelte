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
		id = 'EigenLayerAVSs-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EigenLayerAvs> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EigenLayerAvs}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				avsAddress: true,
				name: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: eigenLayerAvs })}
		{@const eigenLayerAvsSelector = eigenLayerAvs[EntityMetaKey.Selector]}
		{@const network = eigenLayerAvsSelector.$network}
		<EntityView
			entityType={EntityType.EigenLayerAvs}
			entitySelector={eigenLayerAvsSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer/(eigenLayerProtocol)/avs/[avsAddress=evmAddress]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						avsAddress: eigenLayerAvsSelector.avsAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{eigenLayerAvsSelector.avsAddress || 'eigen layer avs'}
			{/snippet}

			{#snippet Value()}
				{eigenLayerAvs.name ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eigenLayerAvs.$network.name || (eigenLayerAvs.$network.caip2 == null ? '' : `${eigenLayerAvs.$network.caip2.namespace}:${eigenLayerAvs.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
