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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BridgeRoute>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.BridgeRoute}
			entitySelector={bridgeRoute[EntityMetaKey.Selector]}
			href={
				(
					bridgeRoute[EntityMetaKey.Selector] != null && 'fromChainId' in bridgeRoute[EntityMetaKey.Selector]
					&& bridgeRoute[EntityMetaKey.Selector].fromChainId != null
					&& bridgeRoute[EntityMetaKey.Selector] != null && 'toChainId' in bridgeRoute[EntityMetaKey.Selector]
					&& bridgeRoute[EntityMetaKey.Selector].toChainId != null
					&& bridgeRoute[EntityMetaKey.Selector] != null && 'fromToken' in bridgeRoute[EntityMetaKey.Selector]
					&& bridgeRoute[EntityMetaKey.Selector].fromToken != null
					&& bridgeRoute[EntityMetaKey.Selector] != null && 'toToken' in bridgeRoute[EntityMetaKey.Selector]
					&& bridgeRoute[EntityMetaKey.Selector].toToken != null
					&& bridgeRoute[EntityMetaKey.Selector] != null && 'fromAmount' in bridgeRoute[EntityMetaKey.Selector]
					&& bridgeRoute[EntityMetaKey.Selector].fromAmount != null
					&& bridgeRoute[EntityMetaKey.Selector] != null && 'fromAddress' in bridgeRoute[EntityMetaKey.Selector]
					&& bridgeRoute[EntityMetaKey.Selector].fromAddress != null
					&& bridgeRoute[EntityMetaKey.Selector] != null && 'slippage' in bridgeRoute[EntityMetaKey.Selector]
					&& bridgeRoute[EntityMetaKey.Selector].slippage != null
					&& bridgeRoute[EntityMetaKey.Selector] != null && 'toAddress' in bridgeRoute[EntityMetaKey.Selector]
					&& bridgeRoute[EntityMetaKey.Selector].toAddress != null ?
						resolve('/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]', {
					fromChainId: String(bridgeRoute[EntityMetaKey.Selector].fromChainId ?? ''),
					toChainId: String(bridgeRoute[EntityMetaKey.Selector].toChainId ?? ''),
					fromToken: String(bridgeRoute[EntityMetaKey.Selector].fromToken ?? ''),
					toToken: String(bridgeRoute[EntityMetaKey.Selector].toToken ?? ''),
					fromAmount: String(bridgeRoute[EntityMetaKey.Selector].fromAmount ?? ''),
					fromAddress: String(bridgeRoute[EntityMetaKey.Selector].fromAddress ?? ''),
					slippage: String(bridgeRoute[EntityMetaKey.Selector].slippage ?? ''),
					toAddress: String(bridgeRoute[EntityMetaKey.Selector].toAddress ?? ''),
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
				{[String((bridgeRouteFields.fromChainId) ?? ''), 'to', String((bridgeRouteFields.toChainId) ?? '')].filter(Boolean).join(' ') || 'bridge route'}
			{/snippet}

			{#snippet Value()}
				{['LI.FI quote'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((bridgeRouteFields.estimatedCostUsd) ?? ''), String((bridgeRouteFields.estimatedDurationSeconds) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
