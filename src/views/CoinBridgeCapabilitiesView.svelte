<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Coin bridge capabilities',
		typeAnnotationParagraphs = ['A supported bridge path between two EVM coin instances through a specific bridge tool.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CoinBridgeCapabilities-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CoinBridgeCapability>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CoinBridgeCapability}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				toolKey: true,
				railId: true,
				$fromInstance: true,
				$toInstance: true,
			},
		})
	}
	{countResource}
	getResourceItems={(coinBridgeCapabilities) => [...new Map(coinBridgeCapabilities.values.map((coinBridgeCapability) => [coinBridgeCapability[EntityMetaKey.SelectorKey], coinBridgeCapability])).values()]}
	getKey={(coinBridgeCapability) => coinBridgeCapability[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Coin bridge capabilities yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: coinBridgeCapability })}
		{@const coinBridgeCapabilityFields = { ...coinBridgeCapability[EntityMetaKey.Selector], ...coinBridgeCapability }}
		<EntityView
			entityType={EntityType.CoinBridgeCapability}
			entitySelector={coinBridgeCapability[EntityMetaKey.Selector]}
			href={
				(
					coinBridgeCapability[EntityMetaKey.Selector] != null && 'toolKey' in coinBridgeCapability[EntityMetaKey.Selector]
					&& coinBridgeCapability[EntityMetaKey.Selector].toolKey != null
					&& coinBridgeCapability[EntityMetaKey.Selector] != null && '$fromInstance' in coinBridgeCapability[EntityMetaKey.Selector]
					&& coinBridgeCapability[EntityMetaKey.Selector].$fromInstance != null && '$network' in coinBridgeCapability[EntityMetaKey.Selector].$fromInstance
					&& coinBridgeCapability[EntityMetaKey.Selector].$fromInstance.$network != null && 'caip2' in coinBridgeCapability[EntityMetaKey.Selector].$fromInstance.$network
					&& coinBridgeCapability[EntityMetaKey.Selector].$fromInstance.$network.caip2 != null && 'reference' in coinBridgeCapability[EntityMetaKey.Selector].$fromInstance.$network.caip2
					&& coinBridgeCapability[EntityMetaKey.Selector].$fromInstance.$network.caip2.reference != null
					&& (coinBridgeCapability[EntityMetaKey.Selector] != null && '$fromInstance' in coinBridgeCapability[EntityMetaKey.Selector] && coinBridgeCapability[EntityMetaKey.Selector].$fromInstance != null && 'type' in coinBridgeCapability[EntityMetaKey.Selector].$fromInstance && coinBridgeCapability[EntityMetaKey.Selector].$fromInstance.type != null && (coinBridgeCapability[EntityMetaKey.Selector].$fromInstance.type === 'NativeCurrency' ? true : coinBridgeCapability[EntityMetaKey.Selector].$fromInstance.type === 'Erc20Token' ? coinBridgeCapability[EntityMetaKey.Selector] != null && '$fromInstance' in coinBridgeCapability[EntityMetaKey.Selector] && coinBridgeCapability[EntityMetaKey.Selector].$fromInstance != null && '$contract' in coinBridgeCapability[EntityMetaKey.Selector].$fromInstance && coinBridgeCapability[EntityMetaKey.Selector].$fromInstance.$contract != null && 'address' in coinBridgeCapability[EntityMetaKey.Selector].$fromInstance.$contract && coinBridgeCapability[EntityMetaKey.Selector].$fromInstance.$contract.address != null : true))
					&& coinBridgeCapability[EntityMetaKey.Selector] != null && '$toInstance' in coinBridgeCapability[EntityMetaKey.Selector]
					&& coinBridgeCapability[EntityMetaKey.Selector].$toInstance != null && '$network' in coinBridgeCapability[EntityMetaKey.Selector].$toInstance
					&& coinBridgeCapability[EntityMetaKey.Selector].$toInstance.$network != null && 'caip2' in coinBridgeCapability[EntityMetaKey.Selector].$toInstance.$network
					&& coinBridgeCapability[EntityMetaKey.Selector].$toInstance.$network.caip2 != null && 'reference' in coinBridgeCapability[EntityMetaKey.Selector].$toInstance.$network.caip2
					&& coinBridgeCapability[EntityMetaKey.Selector].$toInstance.$network.caip2.reference != null
					&& (coinBridgeCapability[EntityMetaKey.Selector] != null && '$toInstance' in coinBridgeCapability[EntityMetaKey.Selector] && coinBridgeCapability[EntityMetaKey.Selector].$toInstance != null && 'type' in coinBridgeCapability[EntityMetaKey.Selector].$toInstance && coinBridgeCapability[EntityMetaKey.Selector].$toInstance.type != null && (coinBridgeCapability[EntityMetaKey.Selector].$toInstance.type === 'NativeCurrency' ? true : coinBridgeCapability[EntityMetaKey.Selector].$toInstance.type === 'Erc20Token' ? coinBridgeCapability[EntityMetaKey.Selector] != null && '$toInstance' in coinBridgeCapability[EntityMetaKey.Selector] && coinBridgeCapability[EntityMetaKey.Selector].$toInstance != null && '$contract' in coinBridgeCapability[EntityMetaKey.Selector].$toInstance && coinBridgeCapability[EntityMetaKey.Selector].$toInstance.$contract != null && 'address' in coinBridgeCapability[EntityMetaKey.Selector].$toInstance.$contract && coinBridgeCapability[EntityMetaKey.Selector].$toInstance.$contract.address != null : true)) ?
						resolve('/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toChainId=eip155ChainId]/[toCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toolKey=stringSegment]', {
					toolKey: String(coinBridgeCapability[EntityMetaKey.Selector].toolKey ?? ''),
					fromChainId: String(coinBridgeCapability[EntityMetaKey.Selector].$fromInstance.$network.caip2.reference ?? ''),
					fromCoinInstanceSlug: String((coinBridgeCapability[EntityMetaKey.Selector].$fromInstance.type === 'NativeCurrency' ? 'native' : coinBridgeCapability[EntityMetaKey.Selector].$fromInstance.type === 'Erc20Token' ? coinBridgeCapability[EntityMetaKey.Selector].$fromInstance.$contract.address : '')),
					toChainId: String(coinBridgeCapability[EntityMetaKey.Selector].$toInstance.$network.caip2.reference ?? ''),
					toCoinInstanceSlug: String((coinBridgeCapability[EntityMetaKey.Selector].$toInstance.type === 'NativeCurrency' ? 'native' : coinBridgeCapability[EntityMetaKey.Selector].$toInstance.type === 'Erc20Token' ? coinBridgeCapability[EntityMetaKey.Selector].$toInstance.$contract.address : '')),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((coinBridgeCapabilityFields.toolKey) ?? '')].filter(Boolean).join(' ') || 'Coin bridge capability'}
			{/snippet}

			{#snippet Value()}
				{[String((coinBridgeCapabilityFields.toolKey) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((coinBridgeCapabilityFields.railId) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
