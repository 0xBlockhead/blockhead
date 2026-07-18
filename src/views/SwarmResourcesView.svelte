<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Swarm resources',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SwarmResources-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.SwarmResource>
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
	import SwarmResourceView from '$/views/SwarmResourceView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SwarmResource}
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
				canonicalUri: true,
				contentType: true,
				displayType: true,
				contentPath: true,
				reference: true,
			},
		})
	}
	getResourceItems={(swarmResources) => [...new Map(swarmResources.values.map((swarmResource) => [swarmResource[EntityMetaKey.SelectorKey], swarmResource])).values()]}
	getKey={(swarmResource) => swarmResource[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Swarm resources yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: swarmResource })}
		{@const swarmResourceFields = { ...swarmResource[EntityMetaKey.Selector], ...swarmResource }}
		{@const selection = select(EntityType.SwarmResource, swarmResource[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const swarmResourceHrefFields = { ...swarmResource, ...swarmResource[EntityMetaKey.Selector] }}
		<SwarmResourceView
			selection={selection}
			prefetched={swarmResourceFields}
			href={
				(swarmResource[EntityMetaKey.Selector].contentPath === '' && swarmResourceHrefFields.reference !== undefined ? resolve('/swarm/[reference=stringSegment]', {
					reference: String(swarmResourceHrefFields.reference ?? ''),
				}) : swarmResource[EntityMetaKey.Selector].contentPath !== '' && swarmResourceHrefFields.reference !== undefined && swarmResourceHrefFields.contentPath !== undefined ? resolve('/swarm/[reference=stringSegment]/path/[...contentPath=stringSegment]', {
					reference: String(swarmResourceHrefFields.reference ?? ''),
					contentPath: String(swarmResourceHrefFields.contentPath ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
