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
		title = 'Lens',
		typeAnnotationParagraphs = ['Lens is a social graph protocol. This hub shows bounded account and post windows from the declared Lens GraphQL source.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LensNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.LensNetwork>
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
	import LensNetworkView from '$/views/LensNetworkView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LensNetwork}
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
	getResourceItems={(lensNetworks) => [...new Map(lensNetworks.values.map((lensNetwork) => [lensNetwork[EntityMetaKey.SelectorKey], lensNetwork])).values()]}
	getKey={(lensNetwork) => lensNetwork[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Lens yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: lensNetwork })}
		{@const lensNetworkFields = { ...lensNetwork[EntityMetaKey.Selector], ...lensNetwork }}
		{@const selection = select(EntityType.LensNetwork, lensNetwork[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const lensNetworkHrefFields = { ...lensNetwork, ...lensNetwork[EntityMetaKey.Selector] }}
		<LensNetworkView
			selection={selection}
			prefetched={lensNetworkFields}
			href={(lensNetwork[EntityMetaKey.Selector].scope === 'LensNetwork' ? resolve('/lens') : undefined)}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
