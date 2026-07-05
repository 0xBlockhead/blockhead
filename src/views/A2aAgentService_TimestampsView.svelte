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
		title = 'A2A agent service observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'A2aAgentService_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.A2aAgentService_Timestamp>
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
	import A2aAgentService_TimestampView from '$/views/A2aAgentService_TimestampView.svelte'
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
					timestampMs: true,
					health: true,
					reachable: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(a2aAgentServiceTimestamps)}
			{@const uniqueA2aAgentServiceTimestamps = [...new Map(a2aAgentServiceTimestamps.values.map((a2aAgentServiceTimestamp) => [a2aAgentServiceTimestamp[EntityMetaKey.SelectorKey], a2aAgentServiceTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.A2aAgentService_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={a2aAgentServiceTimestamps.totalCount}
				getKey={(a2aAgentServiceTimestamp) => a2aAgentServiceTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueA2aAgentServiceTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No A2A agent service observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: a2aAgentServiceTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.A2aAgentService_Timestamp> })}
					{@const a2aAgentServiceTimestampFields = { ...a2aAgentServiceTimestamp[EntityMetaKey.Selector], ...a2aAgentServiceTimestamp }}
					<A2aAgentService_TimestampView
						selection={select(EntityType.A2aAgentService_Timestamp, a2aAgentServiceTimestamp[EntityMetaKey.Selector])}
						prefetched={a2aAgentServiceTimestampFields}
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
		entityType={EntityType.A2aAgentService_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
