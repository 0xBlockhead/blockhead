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
		title = 'Denoms',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CosmosDenoms-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CosmosDenom>
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
	entityType={EntityType.CosmosDenom}
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
				symbol: true,
				display: true,
				denom: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(cosmosDenoms) => [...new Map(cosmosDenoms.values.map((cosmosDenom) => [cosmosDenom[EntityMetaKey.SelectorKey], cosmosDenom])).values()]}
	getKey={(cosmosDenom) => cosmosDenom[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cosmos denoms yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cosmosDenom })}
		{@const cosmosDenomFields = { ...cosmosDenom[EntityMetaKey.Selector], ...cosmosDenom }}
		<EntityView
			entityType={EntityType.CosmosDenom}
			entitySelector={cosmosDenom[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((cosmosDenomFields.symbol) ?? ''), String((cosmosDenomFields.display) ?? ''), String((cosmosDenomFields.denom) ?? '')].filter(Boolean).join(' ') || 'Cosmos denom'}
			{/snippet}

			{#snippet Value()}
				{[String((cosmosDenomFields.denom) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((cosmosDenomFields.$network.name) ?? '')].filter(Boolean).join(' ') || [cosmosDenomFields.$network.caip2 == null ? '' : String(`${(cosmosDenomFields.$network.caip2).namespace}:${(cosmosDenomFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
