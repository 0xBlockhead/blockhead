<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
		title = 'IBC denom traces',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'IbcDenomTraces-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.IbcDenomTrace>
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
	import IbcDenomTraceView from '$/views/IbcDenomTraceView.svelte'
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
					displayDenom: true,
					baseDenom: true,
					traceKey: true,
					denomHash: true,
					sourceChannel: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(ibcDenomTraces)}
			{@const uniqueIbcDenomTraces = [...new Map(ibcDenomTraces.values.map((ibcDenomTrace) => [ibcDenomTrace[EntityMetaKey.SelectorKey], ibcDenomTrace])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.IbcDenomTrace}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={ibcDenomTraces.totalCount}
				getKey={(ibcDenomTrace) => ibcDenomTrace[EntityMetaKey.SelectorKey]}
				items={uniqueIbcDenomTraces}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No IBC denom traces yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: ibcDenomTrace }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.IbcDenomTrace> })}
					{@const ibcDenomTraceFields = { ...ibcDenomTrace[EntityMetaKey.Selector], ...ibcDenomTrace }}
					<IbcDenomTraceView
						selection={select(EntityType.IbcDenomTrace, ibcDenomTrace[EntityMetaKey.Selector])}
						prefetched={ibcDenomTraceFields}
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
		entityType={EntityType.IbcDenomTrace}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
