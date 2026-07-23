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
		title = 'IBC denom traces',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'IbcDenomTraces-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.IbcDenomTrace>
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
	entityType={EntityType.IbcDenomTrace}
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
				displayDenom: true,
				baseDenom: true,
				traceKey: true,
				denomHash: true,
				sourceChannel: true,
			},
		})
	}
	{countResource}
	getResourceItems={(ibcDenomTraces) => [...new Map(ibcDenomTraces.values.map((ibcDenomTrace) => [ibcDenomTrace[EntityMetaKey.SelectorKey], ibcDenomTrace])).values()]}
	getKey={(ibcDenomTrace) => ibcDenomTrace[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No IBC denom traces yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: ibcDenomTrace })}
		{@const ibcDenomTraceFields = { ...ibcDenomTrace[EntityMetaKey.Selector], ...ibcDenomTrace }}
		<EntityView
			entityType={EntityType.IbcDenomTrace}
			entitySelector={ibcDenomTrace[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((ibcDenomTraceFields.displayDenom) ?? ''), String((ibcDenomTraceFields.baseDenom) ?? ''), String((ibcDenomTraceFields.traceKey) ?? '')].filter(Boolean).join(' ') || 'IBC denom trace'}
			{/snippet}

			{#snippet Value()}
				{[String((ibcDenomTraceFields.denomHash) ?? ''), String((ibcDenomTraceFields.traceKey) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((ibcDenomTraceFields.sourceChannel) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
