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
		title = 'Farcaster',
		typeAnnotationParagraphs = ['Farcaster profiles, channels, and casts: FID plus cast-hash identity with hub feeds from declared Farcaster sources.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FarcasterNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.FarcasterNetwork>
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
	import FarcasterNetworkView from '$/views/FarcasterNetworkView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FarcasterNetwork}
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
	getResourceItems={(farcasterNetworks) => [...new Map(farcasterNetworks.values.map((farcasterNetwork) => [farcasterNetwork[EntityMetaKey.SelectorKey], farcasterNetwork])).values()]}
	getKey={(farcasterNetwork) => farcasterNetwork[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Farcaster yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: farcasterNetwork })}
		{@const farcasterNetworkFields = { ...farcasterNetwork[EntityMetaKey.Selector], ...farcasterNetwork }}
		{@const selection = select(EntityType.FarcasterNetwork, farcasterNetwork[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const farcasterNetworkHrefFields = { ...farcasterNetwork, ...farcasterNetwork[EntityMetaKey.Selector] }}
		<FarcasterNetworkView
			selection={selection}
			prefetched={farcasterNetworkFields}
			href={(farcasterNetwork[EntityMetaKey.Selector].scope === 'FarcasterNetwork' ? resolve('/farcaster') : undefined)}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
