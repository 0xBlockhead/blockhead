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
		title = 'Logos blockchain networks',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LogosBlockchainNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.LogosBlockchainNetwork>
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
	entityType={EntityType.LogosBlockchainNetwork}
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
	getResourceItems={(logosBlockchainNetworks) => [...new Map(logosBlockchainNetworks.values.map((logosBlockchainNetwork) => [logosBlockchainNetwork[EntityMetaKey.SelectorKey], logosBlockchainNetwork])).values()]}
	getKey={(logosBlockchainNetwork) => logosBlockchainNetwork[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Logos blockchain networks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: logosBlockchainNetwork })}
		{@const logosBlockchainNetworkFields = { ...logosBlockchainNetwork[EntityMetaKey.Selector], ...logosBlockchainNetwork }}
		<EntityView
			entityType={EntityType.LogosBlockchainNetwork}
			entitySelector={logosBlockchainNetwork[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((logosBlockchainNetworkFields.$network.name) ?? '')].filter(Boolean).join(' ') || [logosBlockchainNetworkFields.$network.caip2 == null ? '' : String(`${(logosBlockchainNetworkFields.$network.caip2).namespace}:${(logosBlockchainNetworkFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ') || 'Logos blockchain network'}
			{/snippet}

			{#snippet Value()}
				{[[String((logosBlockchainNetworkFields.$network.name) ?? '')].filter(Boolean).join(' ') || [logosBlockchainNetworkFields.$network.caip2 == null ? '' : String(`${(logosBlockchainNetworkFields.$network.caip2).namespace}:${(logosBlockchainNetworkFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
