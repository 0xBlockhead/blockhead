<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.RssNetwork>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.RssNetwork}
			entitySelector={rssNetwork[EntityMetaKey.Selector]}
			href={
				(
					rssNetwork[EntityMetaKey.Selector].scope === 'RssNetwork' ?
						resolve('/rss')
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((rssNetworkFields.protocolName) ?? '')].filter(Boolean).join(' ') || 'RSS / Atom'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
