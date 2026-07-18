<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.IbcDenomTrace>
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
	import IbcDenomTraceView from '$/views/IbcDenomTraceView.svelte'
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
		{@const selection = select(EntityType.IbcDenomTrace, ibcDenomTrace[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<IbcDenomTraceView
			selection={selection}
			prefetched={ibcDenomTraceFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
