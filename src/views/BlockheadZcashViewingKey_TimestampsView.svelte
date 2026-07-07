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
		title = 'Blockhead Zcash viewing key observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadZcashViewingKey_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadZcashViewingKey_Timestamp>
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
	import BlockheadZcashViewingKey_TimestampView from '$/views/BlockheadZcashViewingKey_TimestampView.svelte'
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
					lastScannedHeight: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadZcashViewingKey_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadZcashViewingKeyTimestamps)}
			{@const uniqueBlockheadZcashViewingKeyTimestamps = [...new Map(blockheadZcashViewingKeyTimestamps.values.map((blockheadZcashViewingKeyTimestamp) => [blockheadZcashViewingKeyTimestamp[EntityMetaKey.SelectorKey], blockheadZcashViewingKeyTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadZcashViewingKey_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadZcashViewingKeyTimestamps.totalCount}
				getKey={(blockheadZcashViewingKeyTimestamp) => blockheadZcashViewingKeyTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadZcashViewingKeyTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead zcash viewing key observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadZcashViewingKeyTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadZcashViewingKey_Timestamp> })}
					{@const blockheadZcashViewingKeyTimestampFields = { ...blockheadZcashViewingKeyTimestamp[EntityMetaKey.Selector], ...blockheadZcashViewingKeyTimestamp }}
					<BlockheadZcashViewingKey_TimestampView
						selection={select(EntityType.BlockheadZcashViewingKey_Timestamp, blockheadZcashViewingKeyTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={blockheadZcashViewingKeyTimestampFields}
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
		entityType={EntityType.BlockheadZcashViewingKey_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
