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
		title = 'A2A task events',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'A2aTaskEvents-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.A2aTaskEvent>
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
	import A2aTaskEventView from '$/views/A2aTaskEventView.svelte'
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
					sequence: true,
					eventKind: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(a2aTaskEvents)}
			{@const uniqueA2aTaskEvents = [...new Map(a2aTaskEvents.values.map((a2aTaskEvent) => [a2aTaskEvent[EntityMetaKey.SelectorKey], a2aTaskEvent])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.A2aTaskEvent}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={a2aTaskEvents.totalCount}
				getKey={(a2aTaskEvent) => a2aTaskEvent[EntityMetaKey.SelectorKey]}
				items={uniqueA2aTaskEvents}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No A2A task events yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: a2aTaskEvent }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.A2aTaskEvent> })}
					{@const a2aTaskEventFields = { ...a2aTaskEvent[EntityMetaKey.Selector], ...a2aTaskEvent }}
					<A2aTaskEventView
						selection={select(EntityType.A2aTaskEvent, a2aTaskEvent[EntityMetaKey.Selector])}
						prefetched={a2aTaskEventFields}
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
		entityType={EntityType.A2aTaskEvent}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
