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
		title = 'ENS',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalEnsNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType._GlobalEnsNetwork>
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
	import GlobalEnsNetworkView from '$/views/_GlobalEnsNetworkView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalEnsNetwork}
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
				scope: true,
			},
		})
	}
	getResourceItems={(globalEnsNetworks) => [...new Map(globalEnsNetworks.values.map((globalEnsNetwork) => [globalEnsNetwork[EntityMetaKey.SelectorKey], globalEnsNetwork])).values()]}
	getKey={(globalEnsNetwork) => globalEnsNetwork[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ENS yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: globalEnsNetwork })}
		{@const globalEnsNetworkFields = { ...globalEnsNetwork[EntityMetaKey.Selector], ...globalEnsNetwork }}
		{@const selection = select(EntityType._GlobalEnsNetwork, globalEnsNetwork[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const globalEnsNetworkHrefFields = { ...globalEnsNetwork, ...globalEnsNetwork[EntityMetaKey.Selector] }}
		<GlobalEnsNetworkView
			selection={selection}
			prefetched={globalEnsNetworkFields}
			href={(globalEnsNetwork[EntityMetaKey.Selector].scope === '_GlobalEnsNetwork' ? resolve('/ens') : undefined)}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
