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
		title = 'Global Swarm accesses',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Global Swarm accesses...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalSwarmAccesses-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType._GlobalSwarmAccess>
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
	import GlobalSwarmAccessView from '$/views/_GlobalSwarmAccessView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={selection}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType._GlobalSwarmAccess}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(globalSwarmAccesses)}
			{@const uniqueGlobalSwarmAccesses = [...new Map(globalSwarmAccesses.values.map((globalSwarmAccess) => [globalSwarmAccess[EntityMetaKey.SelectorKey], globalSwarmAccess])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType._GlobalSwarmAccess}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={globalSwarmAccesses.values.length === uniqueGlobalSwarmAccesses.length && globalSwarmAccesses.totalCount != null && globalSwarmAccesses.totalCount >= uniqueGlobalSwarmAccesses.length ? globalSwarmAccesses.totalCount : uniqueGlobalSwarmAccesses.length}
				getKey={(globalSwarmAccess) => globalSwarmAccess[EntityMetaKey.SelectorKey]}
				items={uniqueGlobalSwarmAccesses}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No global Swarm accesses yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: globalSwarmAccess }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType._GlobalSwarmAccess> })}
					<GlobalSwarmAccessView
						href={resolve('/(explore)/(swarm)/swarm/access')}
						selection={select(EntityType._GlobalSwarmAccess, globalSwarmAccess.entitySelector)}
						prefetched={globalSwarmAccess}
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
		entityType={EntityType._GlobalSwarmAccess}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
