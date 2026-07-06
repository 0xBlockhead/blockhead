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
		title = 'Starknet storage entry observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'StarknetStorageEntry_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.StarknetStorageEntry_Timestamp>
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
	import StarknetStorageEntry_TimestampView from '$/views/StarknetStorageEntry_TimestampView.svelte'
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
					$entry: true,
					blockNumber: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.StarknetStorageEntry_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(starknetStorageEntryTimestamps)}
			{@const uniqueStarknetStorageEntryTimestamps = [...new Map(starknetStorageEntryTimestamps.values.map((starknetStorageEntryTimestamp) => [starknetStorageEntryTimestamp[EntityMetaKey.SelectorKey], starknetStorageEntryTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.StarknetStorageEntry_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={starknetStorageEntryTimestamps.totalCount}
				getKey={(starknetStorageEntryTimestamp) => starknetStorageEntryTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueStarknetStorageEntryTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Starknet storage entry observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: starknetStorageEntryTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.StarknetStorageEntry_Timestamp> })}
					{@const starknetStorageEntryTimestampFields = { ...starknetStorageEntryTimestamp[EntityMetaKey.Selector], ...starknetStorageEntryTimestamp }}
					<StarknetStorageEntry_TimestampView
						selection={select(EntityType.StarknetStorageEntry_Timestamp, starknetStorageEntryTimestamp[EntityMetaKey.Selector])}
						prefetched={starknetStorageEntryTimestampFields}
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
		entityType={EntityType.StarknetStorageEntry_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
