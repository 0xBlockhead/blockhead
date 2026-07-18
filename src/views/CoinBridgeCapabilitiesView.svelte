<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.CoinBridgeCapability>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CoinBridgeCapabilityView from '$/views/CoinBridgeCapabilityView.svelte'
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
		{@const selection = select(EntityType.CoinBridgeCapability, coinBridgeCapability[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const coinBridgeCapabilityHrefFields = { ...coinBridgeCapability, ...coinBridgeCapability[EntityMetaKey.Selector] }}
		<CoinBridgeCapabilityView
			selection={selection}
			prefetched={coinBridgeCapabilityFields}
			href={
				(coinBridgeCapabilityHrefFields.toolKey !== undefined && coinBridgeCapabilityHrefFields.$fromInstance !== undefined && coinBridgeCapabilityHrefFields.$fromInstance.$network !== undefined && coinBridgeCapabilityHrefFields.$fromInstance.$network.caip2 !== undefined && coinBridgeCapabilityHrefFields.$fromInstance.$network.caip2.reference !== undefined && (coinBridgeCapabilityHrefFields.$fromInstance !== undefined && coinBridgeCapabilityHrefFields.$fromInstance.type !== undefined && (coinBridgeCapabilityHrefFields.$fromInstance.type === 'NativeCurrency' ? true : coinBridgeCapabilityHrefFields.$fromInstance !== undefined && coinBridgeCapabilityHrefFields.$fromInstance.$contract !== undefined && coinBridgeCapabilityHrefFields.$fromInstance.$contract.address !== undefined)) && coinBridgeCapabilityHrefFields.$toInstance !== undefined && coinBridgeCapabilityHrefFields.$toInstance.$network !== undefined && coinBridgeCapabilityHrefFields.$toInstance.$network.caip2 !== undefined && coinBridgeCapabilityHrefFields.$toInstance.$network.caip2.reference !== undefined && (coinBridgeCapabilityHrefFields.$toInstance !== undefined && coinBridgeCapabilityHrefFields.$toInstance.type !== undefined && (coinBridgeCapabilityHrefFields.$toInstance.type === 'NativeCurrency' ? true : coinBridgeCapabilityHrefFields.$toInstance !== undefined && coinBridgeCapabilityHrefFields.$toInstance.$contract !== undefined && coinBridgeCapabilityHrefFields.$toInstance.$contract.address !== undefined)) ? resolve('/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toChainId=eip155ChainId]/[toCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toolKey=stringSegment]', {
					toolKey: String(coinBridgeCapabilityHrefFields.toolKey ?? ''),
					fromChainId: String(coinBridgeCapabilityHrefFields.$fromInstance.$network.caip2.reference ?? ''),
					fromCoinInstanceSlug: String((coinBridgeCapabilityHrefFields.$fromInstance.type === 'NativeCurrency' ? 'native' : coinBridgeCapabilityHrefFields.$fromInstance.$contract.address)),
					toChainId: String(coinBridgeCapabilityHrefFields.$toInstance.$network.caip2.reference ?? ''),
					toCoinInstanceSlug: String((coinBridgeCapabilityHrefFields.$toInstance.type === 'NativeCurrency' ? 'native' : coinBridgeCapabilityHrefFields.$toInstance.$contract.address)),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
