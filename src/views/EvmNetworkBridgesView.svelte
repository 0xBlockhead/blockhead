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
	}: EntityListViewProps<EntityType.EvmNetworkBridge> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmNetworkBridge}
	bind:open
	resource={
		selection({
			fields: {
				url: true,
				relationshipType: true,
			},
		})
	}
>
	{#snippet Item({ item: evmNetworkBridge })}
		{@const evmNetworkBridgeSelector = evmNetworkBridge[EntityMetaKey.Selector]}
		{@const fromNetwork = evmNetworkBridgeSelector.$fromNetwork}
		{@const toNetwork = evmNetworkBridgeSelector.$toNetwork}
		<EntityView
			entityType={EntityType.EvmNetworkBridge}
			entitySelector={evmNetworkBridgeSelector}
			href={
				'caip2' in toNetwork ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/bridges/[toCaip2=networkCaip2]/[url=absoluteUrl]',
						{
							network: (
								'caip2' in fromNetwork ?
									caip2StringFromValue(fromNetwork.caip2)
								:
									fromNetwork.slug
							),
							toCaip2: caip2StringFromValue(toNetwork.caip2),
							url: encodeURIComponent(evmNetworkBridgeSelector.url),
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{evmNetworkBridgeSelector.url || 'EVM network bridge'}
			{/snippet}

			{#snippet Value()}
				{evmNetworkBridgeSelector.url}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmNetworkBridge.relationshipType ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
