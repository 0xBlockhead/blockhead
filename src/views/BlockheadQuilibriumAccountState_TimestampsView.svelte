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
		title = 'Blockhead Quilibrium account state observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadQuilibriumAccountState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadQuilibriumAccountState_Timestamp>
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
	import BlockheadQuilibriumAccountState_TimestampView from '$/views/BlockheadQuilibriumAccountState_TimestampView.svelte'
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
					balance: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadQuilibriumAccountState_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadQuilibriumAccountStateTimestamps)}
			{@const uniqueBlockheadQuilibriumAccountStateTimestamps = [...new Map(blockheadQuilibriumAccountStateTimestamps.values.map((blockheadQuilibriumAccountStateTimestamp) => [blockheadQuilibriumAccountStateTimestamp[EntityMetaKey.SelectorKey], blockheadQuilibriumAccountStateTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadQuilibriumAccountState_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadQuilibriumAccountStateTimestamps.totalCount}
				getKey={(blockheadQuilibriumAccountStateTimestamp) => blockheadQuilibriumAccountStateTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadQuilibriumAccountStateTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead quilibrium account state observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadQuilibriumAccountStateTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadQuilibriumAccountState_Timestamp> })}
					{@const blockheadQuilibriumAccountStateTimestampFields = { ...blockheadQuilibriumAccountStateTimestamp[EntityMetaKey.Selector], ...blockheadQuilibriumAccountStateTimestamp }}
					<BlockheadQuilibriumAccountState_TimestampView
						selection={select(EntityType.BlockheadQuilibriumAccountState_Timestamp, blockheadQuilibriumAccountStateTimestamp[EntityMetaKey.Selector])}
						prefetched={blockheadQuilibriumAccountStateTimestampFields}
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
		entityType={EntityType.BlockheadQuilibriumAccountState_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
