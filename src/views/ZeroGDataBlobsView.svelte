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
		title = 'Zero g data blobs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ZeroGDataBlobs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ZeroGDataBlob>
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
	entityType={EntityType.ZeroGDataBlob}
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
				dataRoot: true,
				$network: true,
				sizeBytes: true,
			},
		})
	}
	{countResource}
	getResourceItems={(zeroGDataBlobs) => [...new Map(zeroGDataBlobs.values.map((zeroGDataBlob) => [zeroGDataBlob[EntityMetaKey.SelectorKey], zeroGDataBlob])).values()]}
	getKey={(zeroGDataBlob) => zeroGDataBlob[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Zero g data blobs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: zeroGDataBlob })}
		{@const zeroGDataBlobFields = { ...zeroGDataBlob[EntityMetaKey.Selector], ...zeroGDataBlob }}
		<EntityView
			entityType={EntityType.ZeroGDataBlob}
			entitySelector={zeroGDataBlob[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((zeroGDataBlobFields.dataRoot) ?? '')].filter(Boolean).join(' ') || 'zero g data blob'}
			{/snippet}

			{#snippet Value()}
				{[[String((zeroGDataBlobFields.$network.name) ?? '')].filter(Boolean).join(' ') || [zeroGDataBlobFields.$network.caip2 == null ? '' : String(`${(zeroGDataBlobFields.$network.caip2).namespace}:${(zeroGDataBlobFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((zeroGDataBlobFields.sizeBytes) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
