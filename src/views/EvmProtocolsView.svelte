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
		title = 'EVM protocols',
		typeAnnotationParagraphs = ['Catalog surface for EVM signature, topic, and error registries.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmProtocols-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmProtocol>
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
	import EvmProtocolView from '$/views/EvmProtocolView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmProtocol}
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
				registryName: true,
				scope: true,
			},
		})
	}
	getResourceItems={(evmProtocols) => [...new Map(evmProtocols.values.map((evmProtocol) => [evmProtocol[EntityMetaKey.SelectorKey], evmProtocol])).values()]}
	getKey={(evmProtocol) => evmProtocol[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM protocols yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmProtocol })}
		{@const evmProtocolFields = { ...evmProtocol[EntityMetaKey.Selector], ...evmProtocol }}
		{@const selection = select(EntityType.EvmProtocol, evmProtocol[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const evmProtocolHrefFields = { ...evmProtocol, ...evmProtocol[EntityMetaKey.Selector] }}
		<EvmProtocolView
			selection={selection}
			prefetched={evmProtocolFields}
			href={(evmProtocol[EntityMetaKey.Selector].scope === 'EvmProtocol' ? resolve('/evm') : undefined)}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
