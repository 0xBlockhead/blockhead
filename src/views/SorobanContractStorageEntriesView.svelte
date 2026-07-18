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
		title = 'Soroban contract storage entries',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SorobanContractStorageEntries-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.SorobanContractStorageEntry>
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
	import SorobanContractStorageEntryView from '$/views/SorobanContractStorageEntryView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SorobanContractStorageEntry}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
		})
	}
	getResourceItems={(sorobanContractStorageEntries) => [...new Map(sorobanContractStorageEntries.values.map((sorobanContractStorageEntry) => [sorobanContractStorageEntry[EntityMetaKey.SelectorKey], sorobanContractStorageEntry])).values()]}
	getKey={(sorobanContractStorageEntry) => sorobanContractStorageEntry[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Soroban contract storage entries yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: sorobanContractStorageEntry })}
		{@const sorobanContractStorageEntryFields = { ...sorobanContractStorageEntry[EntityMetaKey.Selector], ...sorobanContractStorageEntry }}
		{@const selection = select(EntityType.SorobanContractStorageEntry, sorobanContractStorageEntry[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<SorobanContractStorageEntryView
			selection={selection}
			prefetched={sorobanContractStorageEntryFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
