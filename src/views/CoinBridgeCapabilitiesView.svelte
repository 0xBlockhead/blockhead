<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Coin bridge capabilities',
		typeAnnotationParagraphs = ['A supported bridge path between two EVM coin instances through a specific bridge tool.'],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CoinBridgeCapabilities-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CoinBridgeCapability>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CoinBridgeCapabilityView from '$/views/CoinBridgeCapabilityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					toolKey: true,
					railId: true,
					$fromInstance: true,
					$toInstance: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CoinBridgeCapability}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(coinBridgeCapabilities)}
			{@const uniqueCoinBridgeCapabilities = [...new Map(coinBridgeCapabilities.values.map((coinBridgeCapability) => [coinBridgeCapability[EntityMetaKey.SelectorKey], coinBridgeCapability])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CoinBridgeCapability}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={coinBridgeCapabilities.totalCount}
				getKey={(coinBridgeCapability) => coinBridgeCapability[EntityMetaKey.SelectorKey]}
				items={uniqueCoinBridgeCapabilities}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Coin bridge capabilities yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: coinBridgeCapability }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CoinBridgeCapability> })}
					{@const coinBridgeCapabilityFields = { ...coinBridgeCapability[EntityMetaKey.Selector], ...coinBridgeCapability }}
					{@const coinBridgeCapabilityHrefFields = { ...coinBridgeCapability, ...coinBridgeCapability[EntityMetaKey.Selector] }}
					<CoinBridgeCapabilityView
						selection={select(EntityType.CoinBridgeCapability, coinBridgeCapability[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={coinBridgeCapabilityFields}
						href={
							(coinBridgeCapabilityHrefFields.$fromInstance !== undefined && coinBridgeCapabilityHrefFields.$fromInstance.$network !== undefined && coinBridgeCapabilityHrefFields.$fromInstance.$network.chainId !== undefined && coinBridgeCapabilityHrefFields.$fromInstance !== undefined && coinBridgeCapabilityHrefFields.$fromInstance.slug !== undefined && coinBridgeCapabilityHrefFields.$toInstance !== undefined && coinBridgeCapabilityHrefFields.$toInstance.$network !== undefined && coinBridgeCapabilityHrefFields.$toInstance.$network.chainId !== undefined && coinBridgeCapabilityHrefFields.$toInstance !== undefined && coinBridgeCapabilityHrefFields.$toInstance.slug !== undefined && coinBridgeCapabilityHrefFields.toolKey !== undefined ? resolve('/(assets)/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug]/[toChainId=eip155ChainId]/[toCoinInstanceSlug]/[toolKey]', {
								fromChainId: String(coinBridgeCapabilityHrefFields.$fromInstance.$network.chainId ?? ''),
								fromCoinInstanceSlug: String(coinBridgeCapabilityHrefFields.$fromInstance.slug ?? ''),
								toChainId: String(coinBridgeCapabilityHrefFields.$toInstance.$network.chainId ?? ''),
								toCoinInstanceSlug: String(coinBridgeCapabilityHrefFields.$toInstance.slug ?? ''),
								toolKey: String(coinBridgeCapabilityHrefFields.toolKey ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.CoinBridgeCapability}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
