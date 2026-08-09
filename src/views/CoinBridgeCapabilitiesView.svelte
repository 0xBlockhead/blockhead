<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
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
	resource={
		selection({
			...{
				fields: {
					toolKey: true,
					railId: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: coinBridgeCapability })}
		{@const coinBridgeCapabilitySelector = coinBridgeCapability[EntityMetaKey.Selector]}
		{@const fromInstance = coinBridgeCapabilitySelector.$fromInstance}
		{@const toInstance = coinBridgeCapabilitySelector.$toInstance}
		<EntityView
			entityType={EntityType.CoinBridgeCapability}
			entitySelector={coinBridgeCapabilitySelector}
			href={
				'caip2' in fromInstance.$network
				&& (fromInstance.type === 'NativeCurrency' || '$contract' in fromInstance)
				&& 'caip2' in toInstance.$network
				&& (toInstance.type === 'NativeCurrency' || '$contract' in toInstance) ?
					resolve(
						'/(assets)/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toChainId=eip155ChainId]/[toCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toolKey=stringSegment]',
						{
							fromChainId: fromInstance.$network.caip2.reference,
							fromCoinInstanceSlug: fromInstance.type === 'NativeCurrency' ? 'native' : fromInstance.$contract.address,
							toChainId: toInstance.$network.caip2.reference,
							toCoinInstanceSlug: toInstance.type === 'NativeCurrency' ? 'native' : toInstance.$contract.address,
							toolKey: coinBridgeCapabilitySelector.toolKey,
						}
					)
				:
					undefined
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
