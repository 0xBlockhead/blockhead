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
		title = 'Celestia blobs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CelestiaBlobs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CelestiaBlob>
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
	entityType={EntityType.CelestiaBlob}
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
				commitment: true,
				height: true,
				$namespace: {
					fields: {
						label: true,
						namespaceVersion: true,
					},
				},
			},
		})
	}
	{countResource}
	getResourceItems={(celestiaBlobs) => [...new Map(celestiaBlobs.values.map((celestiaBlob) => [celestiaBlob[EntityMetaKey.SelectorKey], celestiaBlob])).values()]}
	getKey={(celestiaBlob) => celestiaBlob[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Celestia blobs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: celestiaBlob })}
		{@const celestiaBlobFields = { ...celestiaBlob[EntityMetaKey.Selector], ...celestiaBlob }}
		<EntityView
			entityType={EntityType.CelestiaBlob}
			entitySelector={celestiaBlob[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((celestiaBlobFields.commitment) ?? '')].filter(Boolean).join(' ') || 'celestia blob'}
			{/snippet}

			{#snippet Value()}
				{[String((celestiaBlobFields.height) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((celestiaBlobFields.$namespace.label) ?? '')].filter(Boolean).join(' ') || [String((celestiaBlobFields.$namespace.namespaceId) ?? '')].filter(Boolean).join(' ') || 'celestia namespace'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
