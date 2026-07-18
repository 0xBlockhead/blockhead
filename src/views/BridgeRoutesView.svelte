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
		title = 'Bridge routes',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BridgeRoutes-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BridgeRoute>
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
	import BridgeRouteView from '$/views/BridgeRouteView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BridgeRoute}
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
				fromChainId: true,
				toChainId: true,
				estimatedCostUsd: true,
				estimatedDurationSeconds: true,
				fromToken: true,
				toToken: true,
				fromAmount: true,
				fromAddress: true,
				slippage: true,
				toAddress: true,
			},
		})
	}
	getResourceItems={(bridgeRoutes) => [...new Map(bridgeRoutes.values.map((bridgeRoute) => [bridgeRoute[EntityMetaKey.SelectorKey], bridgeRoute])).values()]}
	getKey={(bridgeRoute) => bridgeRoute[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bridge routes yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bridgeRoute })}
		{@const bridgeRouteFields = { ...bridgeRoute[EntityMetaKey.Selector], ...bridgeRoute }}
		{@const selection = select(EntityType.BridgeRoute, bridgeRoute[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const bridgeRouteHrefFields = { ...bridgeRoute, ...bridgeRoute[EntityMetaKey.Selector] }}
		<BridgeRouteView
			selection={selection}
			prefetched={bridgeRouteFields}
			href={
				(bridgeRouteHrefFields.fromChainId !== undefined && bridgeRouteHrefFields.toChainId !== undefined && bridgeRouteHrefFields.fromToken !== undefined && bridgeRouteHrefFields.toToken !== undefined && bridgeRouteHrefFields.fromAmount !== undefined && bridgeRouteHrefFields.fromAddress !== undefined && bridgeRouteHrefFields.slippage !== undefined && bridgeRouteHrefFields.toAddress !== undefined ? resolve('/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]', {
					fromChainId: String(bridgeRouteHrefFields.fromChainId ?? ''),
					toChainId: String(bridgeRouteHrefFields.toChainId ?? ''),
					fromToken: String(bridgeRouteHrefFields.fromToken ?? ''),
					toToken: String(bridgeRouteHrefFields.toToken ?? ''),
					fromAmount: String(bridgeRouteHrefFields.fromAmount ?? ''),
					fromAddress: String(bridgeRouteHrefFields.fromAddress ?? ''),
					slippage: String(bridgeRouteHrefFields.slippage ?? ''),
					toAddress: String(bridgeRouteHrefFields.toAddress ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
