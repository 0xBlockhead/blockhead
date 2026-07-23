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
		title = 'EigenLayer AVSs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EigenLayerAVSs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EigenLayerAvs>
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
	entityType={EntityType.EigenLayerAvs}
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
				avsAddress: true,
				name: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(eigenLayerAVSs) => [...new Map(eigenLayerAVSs.values.map((eigenLayerAvs) => [eigenLayerAvs[EntityMetaKey.SelectorKey], eigenLayerAvs])).values()]}
	getKey={(eigenLayerAvs) => eigenLayerAvs[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EigenLayer AVSs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: eigenLayerAvs })}
		{@const eigenLayerAvsFields = { ...eigenLayerAvs[EntityMetaKey.Selector], ...eigenLayerAvs }}
		<EntityView
			entityType={EntityType.EigenLayerAvs}
			entitySelector={eigenLayerAvs[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((eigenLayerAvsFields.avsAddress) ?? '')].filter(Boolean).join(' ') || 'eigen layer avs'}
			{/snippet}

			{#snippet Value()}
				{[String((eigenLayerAvsFields.name) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((eigenLayerAvsFields.$network.name) ?? '')].filter(Boolean).join(' ') || [eigenLayerAvsFields.$network.caip2 == null ? '' : String(`${(eigenLayerAvsFields.$network.caip2).namespace}:${(eigenLayerAvsFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
