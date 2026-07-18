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
		title = 'IPFS protocols',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'IpfsProtocols-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.IpfsProtocol>
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
	import IpfsProtocolView from '$/views/IpfsProtocolView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IpfsProtocol}
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
	getResourceItems={(ipfsProtocols) => [...new Map(ipfsProtocols.values.map((ipfsProtocol) => [ipfsProtocol[EntityMetaKey.SelectorKey], ipfsProtocol])).values()]}
	getKey={(ipfsProtocol) => ipfsProtocol[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No IPFS protocols yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: ipfsProtocol })}
		{@const ipfsProtocolFields = { ...ipfsProtocol[EntityMetaKey.Selector], ...ipfsProtocol }}
		{@const selection = select(EntityType.IpfsProtocol, ipfsProtocol[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const ipfsProtocolHrefFields = { ...ipfsProtocol, ...ipfsProtocol[EntityMetaKey.Selector] }}
		<IpfsProtocolView
			selection={selection}
			prefetched={ipfsProtocolFields}
			href={(ipfsProtocol[EntityMetaKey.Selector].scope === 'IpfsProtocol' ? resolve('/ipfs') : undefined)}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
