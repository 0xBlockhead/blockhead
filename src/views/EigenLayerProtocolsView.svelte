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
		title = 'Eigen layer protocols',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EigenLayerProtocols-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EigenLayerProtocol>
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
	entityType={EntityType.EigenLayerProtocol}
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
				protocolName: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(eigenLayerProtocols) => [...new Map(eigenLayerProtocols.values.map((eigenLayerProtocol) => [eigenLayerProtocol[EntityMetaKey.SelectorKey], eigenLayerProtocol])).values()]}
	getKey={(eigenLayerProtocol) => eigenLayerProtocol[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Eigen layer protocols yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: eigenLayerProtocol })}
		{@const eigenLayerProtocolFields = { ...eigenLayerProtocol[EntityMetaKey.Selector], ...eigenLayerProtocol }}
		<EntityView
			entityType={EntityType.EigenLayerProtocol}
			entitySelector={eigenLayerProtocol[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((eigenLayerProtocolFields.protocolName) ?? '')].filter(Boolean).join(' ') || 'eigen layer protocol'}
			{/snippet}

			{#snippet Value()}
				{[[String((eigenLayerProtocolFields.$network.name) ?? '')].filter(Boolean).join(' ') || [eigenLayerProtocolFields.$network.caip2 == null ? '' : String(`${(eigenLayerProtocolFields.$network.caip2).namespace}:${(eigenLayerProtocolFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
