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
		title = 'Eigen layer reward observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EigenLayerReward_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EigenLayerReward_Timestamp>
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
	entityType={EntityType.EigenLayerReward_Timestamp}
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
				$earner: true,
				rewardContextKey: true,
				rewardToken: true,
			},
		})
	}
	{countResource}
	getResourceItems={(eigenLayerRewardTimestamps) => [...new Map(eigenLayerRewardTimestamps.values.map((eigenLayerRewardTimestamp) => [eigenLayerRewardTimestamp[EntityMetaKey.SelectorKey], eigenLayerRewardTimestamp])).values()]}
	getKey={(eigenLayerRewardTimestamp) => eigenLayerRewardTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Eigen layer reward observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: eigenLayerRewardTimestamp })}
		{@const eigenLayerRewardTimestampFields = { ...eigenLayerRewardTimestamp[EntityMetaKey.Selector], ...eigenLayerRewardTimestamp }}
		<EntityView
			entityType={EntityType.EigenLayerReward_Timestamp}
			entitySelector={eigenLayerRewardTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[[String((eigenLayerRewardTimestampFields.$earner.$actor.address) ?? '')].filter(Boolean).join(' ') || 'EVM account'].filter(Boolean).join(' ') || 'EVM network account'].filter(Boolean).join(' ') || 'eigen layer reward timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((eigenLayerRewardTimestampFields.rewardContextKey) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((eigenLayerRewardTimestampFields.rewardToken) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
