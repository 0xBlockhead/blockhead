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
		title = 'Zero g da quorums',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ZeroGDaQuorums-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ZeroGDaQuorum>
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
	entityType={EntityType.ZeroGDaQuorum}
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
				quorumId: true,
				$network: true,
				$consensusNetwork: true,
			},
		})
	}
	{countResource}
	getResourceItems={(zeroGDaQuorums) => [...new Map(zeroGDaQuorums.values.map((zeroGDaQuorum) => [zeroGDaQuorum[EntityMetaKey.SelectorKey], zeroGDaQuorum])).values()]}
	getKey={(zeroGDaQuorum) => zeroGDaQuorum[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Zero g da quorums yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: zeroGDaQuorum })}
		{@const zeroGDaQuorumFields = { ...zeroGDaQuorum[EntityMetaKey.Selector], ...zeroGDaQuorum }}
		<EntityView
			entityType={EntityType.ZeroGDaQuorum}
			entitySelector={zeroGDaQuorum[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((zeroGDaQuorumFields.quorumId) ?? '')].filter(Boolean).join(' ') || 'zero g da quorum'}
			{/snippet}

			{#snippet Value()}
				{[[String((zeroGDaQuorumFields.$network.name) ?? '')].filter(Boolean).join(' ') || [zeroGDaQuorumFields.$network.caip2 == null ? '' : String(`${(zeroGDaQuorumFields.$network.caip2).namespace}:${(zeroGDaQuorumFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((zeroGDaQuorumFields.$consensusNetwork.consensusNetworkId) ?? '')].filter(Boolean).join(' ') || 'zero g consensus network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
