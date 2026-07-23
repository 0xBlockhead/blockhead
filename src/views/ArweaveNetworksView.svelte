<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
		title = 'Arweave networks',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ArweaveNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ArweaveNetwork>
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
	entityType={EntityType.ArweaveNetwork}
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
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(arweaveNetworks) => [...new Map(arweaveNetworks.values.map((arweaveNetwork) => [arweaveNetwork[EntityMetaKey.SelectorKey], arweaveNetwork])).values()]}
	getKey={(arweaveNetwork) => arweaveNetwork[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Arweave networks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: arweaveNetwork })}
		{@const arweaveNetworkFields = { ...arweaveNetwork[EntityMetaKey.Selector], ...arweaveNetwork }}
		<EntityView
			entityType={EntityType.ArweaveNetwork}
			entitySelector={arweaveNetwork[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((arweaveNetworkFields.$network.name) ?? '')].filter(Boolean).join(' ') || [arweaveNetworkFields.$network.caip2 == null ? '' : String(`${(arweaveNetworkFields.$network.caip2).namespace}:${(arweaveNetworkFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ') || 'arweave network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
