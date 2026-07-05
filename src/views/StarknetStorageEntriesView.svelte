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
		title = 'Starknet storage entries',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'StarknetStorageEntries-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.StarknetStorageEntry>
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
	import StarknetStorageEntryView from '$/views/StarknetStorageEntryView.svelte'
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
					storageKey: true,
					$contract: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(starknetStorageEntries)}
			{@const uniqueStarknetStorageEntries = [...new Map(starknetStorageEntries.values.map((starknetStorageEntry) => [starknetStorageEntry[EntityMetaKey.SelectorKey], starknetStorageEntry])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.StarknetStorageEntry}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={starknetStorageEntries.totalCount}
				getKey={(starknetStorageEntry) => starknetStorageEntry[EntityMetaKey.SelectorKey]}
				items={uniqueStarknetStorageEntries}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Starknet storage entries yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: starknetStorageEntry }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.StarknetStorageEntry> })}
					{@const starknetStorageEntryFields = { ...starknetStorageEntry[EntityMetaKey.Selector], ...starknetStorageEntry }}
					<StarknetStorageEntryView
						selection={select(EntityType.StarknetStorageEntry, starknetStorageEntry[EntityMetaKey.Selector])}
						prefetched={starknetStorageEntryFields}
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
		entityType={EntityType.StarknetStorageEntry}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
