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
		title = 'Blockhead session simulation logs',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadSessionSimulationLogs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadSessionSimulationLog>
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
	import BlockheadSessionSimulationLogView from '$/views/BlockheadSessionSimulationLogView.svelte'
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
					logIndex: true,
					address: true,
					callPath: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadSessionSimulationLog}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadSessionSimulationLogs)}
			{@const uniqueBlockheadSessionSimulationLogs = [...new Map(blockheadSessionSimulationLogs.values.map((blockheadSessionSimulationLog) => [blockheadSessionSimulationLog[EntityMetaKey.SelectorKey], blockheadSessionSimulationLog])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadSessionSimulationLog}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadSessionSimulationLogs.totalCount}
				getKey={(blockheadSessionSimulationLog) => blockheadSessionSimulationLog[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadSessionSimulationLogs}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead session simulation logs yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadSessionSimulationLog }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadSessionSimulationLog> })}
					{@const blockheadSessionSimulationLogFields = { ...blockheadSessionSimulationLog[EntityMetaKey.Selector], ...blockheadSessionSimulationLog }}
					<BlockheadSessionSimulationLogView
						selection={select(EntityType.BlockheadSessionSimulationLog, blockheadSessionSimulationLog[EntityMetaKey.Selector])}
						prefetched={blockheadSessionSimulationLogFields}
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
		entityType={EntityType.BlockheadSessionSimulationLog}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
