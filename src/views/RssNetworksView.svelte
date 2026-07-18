<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'RSS / Atom',
		typeAnnotationParagraphs = ['RSS and Atom syndication feeds publish ordered item streams keyed by feed URL.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RssNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.RssNetwork>
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
	import RssNetworkView from '$/views/RssNetworkView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RssNetwork}
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
				protocolName: true,
				scope: true,
			},
		})
	}
	getResourceItems={(rssNetworks) => [...new Map(rssNetworks.values.map((rssNetwork) => [rssNetwork[EntityMetaKey.SelectorKey], rssNetwork])).values()]}
	getKey={(rssNetwork) => rssNetwork[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No RSS / Atom yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: rssNetwork })}
		{@const rssNetworkFields = { ...rssNetwork[EntityMetaKey.Selector], ...rssNetwork }}
		{@const selection = select(EntityType.RssNetwork, rssNetwork[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const rssNetworkHrefFields = { ...rssNetwork, ...rssNetwork[EntityMetaKey.Selector] }}
		<RssNetworkView
			selection={selection}
			prefetched={rssNetworkFields}
			href={(rssNetwork[EntityMetaKey.Selector].scope === 'RssNetwork' ? resolve('/rss') : undefined)}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
