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
		title = 'Blockhead Algorand participation keys',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAlgorandParticipationKeys-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadAlgorandParticipationKey>
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
	entityType={EntityType.BlockheadAlgorandParticipationKey}
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
				participationId: true,
				nodeId: true,
				firstValidRound: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadAlgorandParticipationKeys) => [...new Map(blockheadAlgorandParticipationKeys.values.map((blockheadAlgorandParticipationKey) => [blockheadAlgorandParticipationKey[EntityMetaKey.SelectorKey], blockheadAlgorandParticipationKey])).values()]}
	getKey={(blockheadAlgorandParticipationKey) => blockheadAlgorandParticipationKey[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead algorand participation keys yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadAlgorandParticipationKey })}
		{@const blockheadAlgorandParticipationKeyFields = { ...blockheadAlgorandParticipationKey[EntityMetaKey.Selector], ...blockheadAlgorandParticipationKey }}
		<EntityView
			entityType={EntityType.BlockheadAlgorandParticipationKey}
			entitySelector={blockheadAlgorandParticipationKey[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadAlgorandParticipationKeyFields.participationId) ?? '')].filter(Boolean).join(' ') || 'blockhead algorand participation key'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadAlgorandParticipationKeyFields.nodeId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadAlgorandParticipationKeyFields.firstValidRound) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
