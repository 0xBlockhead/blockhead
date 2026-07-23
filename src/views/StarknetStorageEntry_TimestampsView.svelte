<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
		title = 'Starknet storage entry observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'StarknetStorageEntry_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.StarknetStorageEntry_Timestamp>
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
	entityType={EntityType.StarknetStorageEntry_Timestamp}
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
				$entry: true,
				blockNumber: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(starknetStorageEntryTimestamps) => [...new Map(starknetStorageEntryTimestamps.values.map((starknetStorageEntryTimestamp) => [starknetStorageEntryTimestamp[EntityMetaKey.SelectorKey], starknetStorageEntryTimestamp])).values()]}
	getKey={(starknetStorageEntryTimestamp) => starknetStorageEntryTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Starknet storage entry observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: starknetStorageEntryTimestamp })}
		{@const starknetStorageEntryTimestampFields = { ...starknetStorageEntryTimestamp[EntityMetaKey.Selector], ...starknetStorageEntryTimestamp }}
		<EntityView
			entityType={EntityType.StarknetStorageEntry_Timestamp}
			entitySelector={starknetStorageEntryTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((starknetStorageEntryTimestampFields.$entry.storageKey) ?? '')].filter(Boolean).join(' ') || 'starknet storage entry'].filter(Boolean).join(' ') || 'starknet storage entry timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((starknetStorageEntryTimestampFields.blockNumber) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((starknetStorageEntryTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
