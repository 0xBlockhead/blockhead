<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		typeAnnotationParagraphs = ['A supported bridge path between two EVM coin instances through a specific bridge tool.'],
		open = $bindable(true),
		id = 'CoinBridgeCapabilities-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CoinBridgeCapability> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CoinBridgeCapability}
	{id}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				toolKey: true,
				railId: true,
			},
		})
	}
>
	{#snippet Item({ item: coinBridgeCapability })}
		{@const coinBridgeCapabilitySelector = coinBridgeCapability[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CoinBridgeCapability}
			entitySelector={coinBridgeCapabilitySelector}
			href={
				(
					'caip2' in coinBridgeCapabilitySelector.$fromInstance.$network
					&& (coinBridgeCapabilitySelector.$fromInstance.type === 'NativeCurrency' ? true : '$contract' in coinBridgeCapabilitySelector.$fromInstance)
					&& 'caip2' in coinBridgeCapabilitySelector.$toInstance.$network
					&& (coinBridgeCapabilitySelector.$toInstance.type === 'NativeCurrency' ? true : '$contract' in coinBridgeCapabilitySelector.$toInstance) ?
						resolve(
							'/(assets)/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toChainId=eip155ChainId]/[toCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toolKey=stringSegment]',
							{
								fromChainId: String(coinBridgeCapabilitySelector.$fromInstance.$network.caip2.reference),
								fromCoinInstanceSlug: String((coinBridgeCapabilitySelector.$fromInstance.type === 'NativeCurrency' ? 'native' : coinBridgeCapabilitySelector.$fromInstance.$contract.address)),
								toChainId: String(coinBridgeCapabilitySelector.$toInstance.$network.caip2.reference),
								toCoinInstanceSlug: String((coinBridgeCapabilitySelector.$toInstance.type === 'NativeCurrency' ? 'native' : coinBridgeCapabilitySelector.$toInstance.$contract.address)),
								toolKey: String(coinBridgeCapabilitySelector.toolKey),
							}
						)
					:
						undefined
				)
			}
		>
			{#snippet Title()}
				{coinBridgeCapabilitySelector.toolKey || 'Coin bridge capability'}
			{/snippet}

			{#snippet Value()}
				{coinBridgeCapabilitySelector.toolKey}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{coinBridgeCapability.railId}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
