<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Filecoin networks',
		typeAnnotationParagraphs = ['Filecoin-specific view over a canonical Network row, including Lotus endpoints, chain head observations, and tipsets.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FilecoinNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.FilecoinNetwork>
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
	entityType={EntityType.FilecoinNetwork}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Lotus_JsonRpc,
			],
			fields: {
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(filecoinNetworks) => [...new Map(filecoinNetworks.values.map((filecoinNetwork) => [filecoinNetwork[EntityMetaKey.SelectorKey], filecoinNetwork])).values()]}
	getKey={(filecoinNetwork) => filecoinNetwork[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Filecoin networks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: filecoinNetwork })}
		{@const filecoinNetworkFields = { ...filecoinNetwork[EntityMetaKey.Selector], ...filecoinNetwork }}
		<EntityView
			entityType={EntityType.FilecoinNetwork}
			entitySelector={filecoinNetwork[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((filecoinNetworkFields.$network.name) ?? '')].filter(Boolean).join(' ') || [filecoinNetworkFields.$network.caip2 == null ? '' : String(`${(filecoinNetworkFields.$network.caip2).namespace}:${(filecoinNetworkFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ') || 'filecoin network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
