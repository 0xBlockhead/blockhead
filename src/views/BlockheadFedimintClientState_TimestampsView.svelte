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
		title = 'Blockhead Fedimint client state observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadFedimintClientState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadFedimintClientState_Timestamp>
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
	import BlockheadFedimintClientState_TimestampView from '$/views/BlockheadFedimintClientState_TimestampView.svelte'
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
					balanceMsat: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(blockheadFedimintClientStateTimestamps)}
			{@const uniqueBlockheadFedimintClientStateTimestamps = [...new Map(blockheadFedimintClientStateTimestamps.values.map((blockheadFedimintClientStateTimestamp) => [blockheadFedimintClientStateTimestamp[EntityMetaKey.SelectorKey], blockheadFedimintClientStateTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadFedimintClientState_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadFedimintClientStateTimestamps.totalCount}
				getKey={(blockheadFedimintClientStateTimestamp) => blockheadFedimintClientStateTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadFedimintClientStateTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead Fedimint client state observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadFedimintClientStateTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadFedimintClientState_Timestamp> })}
					{@const blockheadFedimintClientStateTimestampFields = { ...blockheadFedimintClientStateTimestamp[EntityMetaKey.Selector], ...blockheadFedimintClientStateTimestamp }}
					<BlockheadFedimintClientState_TimestampView
						selection={select(EntityType.BlockheadFedimintClientState_Timestamp, blockheadFedimintClientStateTimestamp[EntityMetaKey.Selector])}
						prefetched={blockheadFedimintClientStateTimestampFields}
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
		entityType={EntityType.BlockheadFedimintClientState_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
