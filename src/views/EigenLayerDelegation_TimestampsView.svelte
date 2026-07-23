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
		title = 'Eigen layer delegation observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EigenLayerDelegation_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EigenLayerDelegation_Timestamp>
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
	entityType={EntityType.EigenLayerDelegation_Timestamp}
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
				$staker: true,
				$operator: true,
				$strategy: true,
			},
		})
	}
	{countResource}
	getResourceItems={(eigenLayerDelegationTimestamps) => [...new Map(eigenLayerDelegationTimestamps.values.map((eigenLayerDelegationTimestamp) => [eigenLayerDelegationTimestamp[EntityMetaKey.SelectorKey], eigenLayerDelegationTimestamp])).values()]}
	getKey={(eigenLayerDelegationTimestamp) => eigenLayerDelegationTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Eigen layer delegation observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: eigenLayerDelegationTimestamp })}
		{@const eigenLayerDelegationTimestampFields = { ...eigenLayerDelegationTimestamp[EntityMetaKey.Selector], ...eigenLayerDelegationTimestamp }}
		<EntityView
			entityType={EntityType.EigenLayerDelegation_Timestamp}
			entitySelector={eigenLayerDelegationTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[[String((eigenLayerDelegationTimestampFields.$staker.$actor.address) ?? '')].filter(Boolean).join(' ') || 'EVM account'].filter(Boolean).join(' ') || 'EVM network account'].filter(Boolean).join(' ') || 'eigen layer delegation timestamp'}
			{/snippet}

			{#snippet Value()}
				{[[String((eigenLayerDelegationTimestampFields.$operator.operatorAddress) ?? '')].filter(Boolean).join(' ') || 'eigen layer operator'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((eigenLayerDelegationTimestampFields.$strategy.strategyAddress) ?? '')].filter(Boolean).join(' ') || 'eigen layer strategy'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
