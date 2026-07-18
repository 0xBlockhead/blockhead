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
		title = 'Swarm protocols',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SwarmProtocols-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.SwarmProtocol>
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
	import SwarmProtocolView from '$/views/SwarmProtocolView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SwarmProtocol}
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
				relationshipModel: true,
				scope: true,
			},
		})
	}
	getResourceItems={(swarmProtocols) => [...new Map(swarmProtocols.values.map((swarmProtocol) => [swarmProtocol[EntityMetaKey.SelectorKey], swarmProtocol])).values()]}
	getKey={(swarmProtocol) => swarmProtocol[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Swarm protocols yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: swarmProtocol })}
		{@const swarmProtocolFields = { ...swarmProtocol[EntityMetaKey.Selector], ...swarmProtocol }}
		{@const selection = select(EntityType.SwarmProtocol, swarmProtocol[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const swarmProtocolHrefFields = { ...swarmProtocol, ...swarmProtocol[EntityMetaKey.Selector] }}
		<SwarmProtocolView
			selection={selection}
			prefetched={swarmProtocolFields}
			href={(swarmProtocol[EntityMetaKey.Selector].scope === 'SwarmProtocol' ? resolve('/swarm') : undefined)}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
