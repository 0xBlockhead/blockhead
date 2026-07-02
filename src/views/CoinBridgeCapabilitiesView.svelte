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
		placeholderText = 'Loading Coin bridge capabilities...',
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
			selection.sources == null ? selection({
				fields: {
					toolKey: true,
					railId: true,
				},
			}) : selection
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
				totalCount={coinBridgeCapabilities.values.length === uniqueCoinBridgeCapabilities.length && coinBridgeCapabilities.totalCount != null && coinBridgeCapabilities.totalCount >= uniqueCoinBridgeCapabilities.length ? coinBridgeCapabilities.totalCount : uniqueCoinBridgeCapabilities.length}
				getKey={(coinBridgeCapability) => coinBridgeCapability[EntityMetaKey.SelectorKey]}
				items={uniqueCoinBridgeCapabilities}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No coin bridge capabilities yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: coinBridgeCapability }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CoinBridgeCapability> })}
					<CoinBridgeCapabilityView
						href={
							resolve('/(assets)/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug]/[toChainId=eip155ChainId]/[toCoinInstanceSlug]/[toolKey]', {
								fromChainId: String(({ ...coinBridgeCapability.entitySelector, ...coinBridgeCapability }).$fromInstance.$network.chainId),
								fromCoinInstanceSlug: String(({ ...coinBridgeCapability.entitySelector, ...coinBridgeCapability }).$fromInstance.slug),
								toChainId: String(({ ...coinBridgeCapability.entitySelector, ...coinBridgeCapability }).$toInstance.$network.chainId),
								toCoinInstanceSlug: String(({ ...coinBridgeCapability.entitySelector, ...coinBridgeCapability }).$toInstance.slug),
								toolKey: String(({ ...coinBridgeCapability.entitySelector, ...coinBridgeCapability }).toolKey),
							})
						}
						selection={select(EntityType.CoinBridgeCapability, coinBridgeCapability.entitySelector)}
						prefetched={coinBridgeCapability}
						layout={EntityLayout.Summary}
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
