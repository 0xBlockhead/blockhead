<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.SwarmResource>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.SwarmResource}
			entitySelector={swarmResource[EntityMetaKey.Selector]}
			href={
				(
					swarmResource[EntityMetaKey.Selector] != null && 'reference' in swarmResource[EntityMetaKey.Selector]
					&& swarmResource[EntityMetaKey.Selector].reference != null ?
						swarmResource[EntityMetaKey.Selector].reference != null ?
							resolve('/swarm/[reference=stringSegment]', {
						reference: String(swarmResource[EntityMetaKey.Selector].reference ?? ''),
					})
					:
							swarmResource[EntityMetaKey.Selector].reference != null
							&& swarmResource[EntityMetaKey.Selector] != null && 'contentPath' in swarmResource[EntityMetaKey.Selector]
							&& swarmResource[EntityMetaKey.Selector].contentPath != null ?
								resolve('/swarm/[reference=stringSegment]/path/[...contentPath=stringSegment]', {
							reference: String(swarmResource[EntityMetaKey.Selector].reference ?? ''),
							contentPath: String(swarmResource[EntityMetaKey.Selector].contentPath ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((swarmResourceFields.canonicalUri) ?? '')].filter(Boolean).join(' ') || 'Swarm resource'}
			{/snippet}

			{#snippet Value()}
				{[String((swarmResourceFields.contentType) ?? ''), String((swarmResourceFields.displayType) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
