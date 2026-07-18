<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Starknet storage entries',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'StarknetStorageEntries-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.StarknetStorageEntry>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import StarknetStorageEntryView from '$/views/StarknetStorageEntryView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetStorageEntry}
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
				storageKey: true,
				$contract: true,
			},
		})
	}
	getResourceItems={(starknetStorageEntries) => [...new Map(starknetStorageEntries.values.map((starknetStorageEntry) => [starknetStorageEntry[EntityMetaKey.SelectorKey], starknetStorageEntry])).values()]}
	getKey={(starknetStorageEntry) => starknetStorageEntry[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Starknet storage entries yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: starknetStorageEntry })}
		{@const starknetStorageEntryFields = { ...starknetStorageEntry[EntityMetaKey.Selector], ...starknetStorageEntry }}
		{@const selection = select(EntityType.StarknetStorageEntry, starknetStorageEntry[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<StarknetStorageEntryView
			selection={selection}
			prefetched={starknetStorageEntryFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
