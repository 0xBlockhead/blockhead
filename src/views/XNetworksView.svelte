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
		title = 'X',
		typeAnnotationParagraphs = ['X profiles and posts surfaced through declared public HTTP sources.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'XNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.XNetwork>
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
	import XNetworkView from '$/views/XNetworkView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XNetwork}
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
	getResourceItems={(xNetworks) => [...new Map(xNetworks.values.map((xNetwork) => [xNetwork[EntityMetaKey.SelectorKey], xNetwork])).values()]}
	getKey={(xNetwork) => xNetwork[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No X yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: xNetwork })}
		{@const xNetworkFields = { ...xNetwork[EntityMetaKey.Selector], ...xNetwork }}
		{@const selection = select(EntityType.XNetwork, xNetwork[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const xNetworkHrefFields = { ...xNetwork, ...xNetwork[EntityMetaKey.Selector] }}
		<XNetworkView
			selection={selection}
			prefetched={xNetworkFields}
			href={(xNetwork[EntityMetaKey.Selector].scope === 'XNetwork' ? resolve('/x') : undefined)}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
