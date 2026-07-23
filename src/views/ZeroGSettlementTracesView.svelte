<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
		title = 'Zero g settlement traces',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ZeroGSettlementTraces-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ZeroGSettlementTrace>
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
	entityType={EntityType.ZeroGSettlementTrace}
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
				traceId: true,
				$serviceRequest: true,
				settlementTransactionHash: true,
			},
		})
	}
	{countResource}
	getResourceItems={(zeroGSettlementTraces) => [...new Map(zeroGSettlementTraces.values.map((zeroGSettlementTrace) => [zeroGSettlementTrace[EntityMetaKey.SelectorKey], zeroGSettlementTrace])).values()]}
	getKey={(zeroGSettlementTrace) => zeroGSettlementTrace[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Zero g settlement traces yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: zeroGSettlementTrace })}
		{@const zeroGSettlementTraceFields = { ...zeroGSettlementTrace[EntityMetaKey.Selector], ...zeroGSettlementTrace }}
		<EntityView
			entityType={EntityType.ZeroGSettlementTrace}
			entitySelector={zeroGSettlementTrace[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((zeroGSettlementTraceFields.traceId) ?? '')].filter(Boolean).join(' ') || 'zero g settlement trace'}
			{/snippet}

			{#snippet Value()}
				{[[String((zeroGSettlementTraceFields.$serviceRequest.requestId) ?? '')].filter(Boolean).join(' ') || 'zero g service request'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((zeroGSettlementTraceFields.settlementTransactionHash) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
