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
		title = 'Bit torrent trackers',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitTorrentTrackers-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BitTorrentTracker>
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
	import BitTorrentTrackerView from '$/views/BitTorrentTrackerView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitTorrentTracker}
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
				trackerUrl: true,
				trackerKind: true,
			},
		})
	}
	getResourceItems={(bitTorrentTrackers) => [...new Map(bitTorrentTrackers.values.map((bitTorrentTracker) => [bitTorrentTracker[EntityMetaKey.SelectorKey], bitTorrentTracker])).values()]}
	getKey={(bitTorrentTracker) => bitTorrentTracker[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bit torrent trackers yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bitTorrentTracker })}
		{@const bitTorrentTrackerFields = { ...bitTorrentTracker[EntityMetaKey.Selector], ...bitTorrentTracker }}
		{@const selection = select(EntityType.BitTorrentTracker, bitTorrentTracker[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BitTorrentTrackerView
			selection={selection}
			prefetched={bitTorrentTrackerFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
