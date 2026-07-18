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
		title = 'Near contract storage entries',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NearContractStorageEntries-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.NearContractStorageEntry>
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
	import NearContractStorageEntryView from '$/views/NearContractStorageEntryView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearContractStorageEntry}
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
				keyBase64: true,
				valueHash: true,
				blockHeight: true,
			},
		})
	}
	getResourceItems={(nearContractStorageEntries) => [...new Map(nearContractStorageEntries.values.map((nearContractStorageEntry) => [nearContractStorageEntry[EntityMetaKey.SelectorKey], nearContractStorageEntry])).values()]}
	getKey={(nearContractStorageEntry) => nearContractStorageEntry[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Near contract storage entries yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: nearContractStorageEntry })}
		{@const nearContractStorageEntryFields = { ...nearContractStorageEntry[EntityMetaKey.Selector], ...nearContractStorageEntry }}
		{@const selection = select(EntityType.NearContractStorageEntry, nearContractStorageEntry[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<NearContractStorageEntryView
			selection={selection}
			prefetched={nearContractStorageEntryFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
