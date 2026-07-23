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
		title = 'Zero g consensus networks',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ZeroGConsensusNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ZeroGConsensusNetwork>
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
	entityType={EntityType.ZeroGConsensusNetwork}
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
				consensusNetworkId: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(zeroGConsensusNetworks) => [...new Map(zeroGConsensusNetworks.values.map((zeroGConsensusNetwork) => [zeroGConsensusNetwork[EntityMetaKey.SelectorKey], zeroGConsensusNetwork])).values()]}
	getKey={(zeroGConsensusNetwork) => zeroGConsensusNetwork[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Zero g consensus networks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: zeroGConsensusNetwork })}
		{@const zeroGConsensusNetworkFields = { ...zeroGConsensusNetwork[EntityMetaKey.Selector], ...zeroGConsensusNetwork }}
		<EntityView
			entityType={EntityType.ZeroGConsensusNetwork}
			entitySelector={zeroGConsensusNetwork[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((zeroGConsensusNetworkFields.consensusNetworkId) ?? '')].filter(Boolean).join(' ') || 'zero g consensus network'}
			{/snippet}

			{#snippet Value()}
				{[[String((zeroGConsensusNetworkFields.$network.name) ?? '')].filter(Boolean).join(' ') || [zeroGConsensusNetworkFields.$network.caip2 == null ? '' : String(`${(zeroGConsensusNetworkFields.$network.caip2).namespace}:${(zeroGConsensusNetworkFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
