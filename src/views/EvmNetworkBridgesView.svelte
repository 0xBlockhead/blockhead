<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { UrlString } from '$/schema/UrlString.ts'


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
		<EntityView
			entityType={EntityType.EvmNetworkBridge}
			entitySelector={evmNetworkBridgeSelector}
			href={
				(
					'caip2' in evmNetworkBridgeSelector.$toNetwork ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/bridges/[toCaip2=networkCaip2]/[url=absoluteUrl]',
							{
								network: (
									'caip2' in evmNetworkBridgeSelector.$fromNetwork ?
										String(caip2StringFromValue(evmNetworkBridgeSelector.$fromNetwork.caip2))
									:
										String(evmNetworkBridgeSelector.$fromNetwork.slug)
								),
								toCaip2: String(caip2StringFromValue(evmNetworkBridgeSelector.$toNetwork.caip2)),
								url: encodeURIComponent(String(evmNetworkBridgeSelector.url)),
							}
						)
					:
						undefined
				)
			}
		>
			{#snippet Title()}
				{String(evmNetworkBridgeSelector.url) || 'EVM network bridge'}
			{/snippet}

			{#snippet Value()}
				{String(evmNetworkBridgeSelector.url)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(evmNetworkBridge.relationshipType ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
