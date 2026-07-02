<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
		title = 'Swarm resources',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Swarm resources...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SwarmResources-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.SwarmResource>
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
	import SwarmResourceView from '$/views/SwarmResourceView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					canonicalUri: true,
					contentType: true,
					displayType: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SwarmResource}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(swarmResources)}
			{@const uniqueSwarmResources = [...new Map(swarmResources.values.map((swarmResource) => [swarmResource[EntityMetaKey.SelectorKey], swarmResource])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SwarmResource}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={swarmResources.values.length === uniqueSwarmResources.length && swarmResources.totalCount != null && swarmResources.totalCount >= uniqueSwarmResources.length ? swarmResources.totalCount : uniqueSwarmResources.length}
				getKey={(swarmResource) => swarmResource[EntityMetaKey.SelectorKey]}
				items={uniqueSwarmResources}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Swarm resources yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: swarmResource }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.SwarmResource> })}
					<SwarmResourceView
						href={
							(({ ...swarmResource.entitySelector, ...swarmResource })?.reference != null && ({ ...swarmResource.entitySelector, ...swarmResource })?.contentPath != null ? resolve('/(explore)/(swarm)/swarm/[reference]', {
								reference: String(({ ...swarmResource.entitySelector, ...swarmResource }).reference),
							}) : ({ ...swarmResource.entitySelector, ...swarmResource })?.reference != null && ({ ...swarmResource.entitySelector, ...swarmResource })?.contentPath != null ? resolve('/(explore)/(swarm)/swarm/[reference]/(swarmResource)/path/[...contentPath]', {
								reference: String(({ ...swarmResource.entitySelector, ...swarmResource }).reference),
								contentPath: String(({ ...swarmResource.entitySelector, ...swarmResource }).contentPath),
							}) : undefined)
						}
						selection={select(EntityType.SwarmResource, swarmResource.entitySelector)}
						prefetched={swarmResource}
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
		entityType={EntityType.SwarmResource}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
