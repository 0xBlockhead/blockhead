<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Blockhead Algorand participation keys',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAlgorandParticipationKeys-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadAlgorandParticipationKey>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadAlgorandParticipationKeyView from '$/views/BlockheadAlgorandParticipationKeyView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					participationId: true,
					nodeId: true,
					firstValidRound: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadAlgorandParticipationKey}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadAlgorandParticipationKeys)}
			{@const uniqueBlockheadAlgorandParticipationKeys = [...new Map(blockheadAlgorandParticipationKeys.values.map((blockheadAlgorandParticipationKey) => [blockheadAlgorandParticipationKey[EntityMetaKey.SelectorKey], blockheadAlgorandParticipationKey])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadAlgorandParticipationKey}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadAlgorandParticipationKeys.totalCount}
				getKey={(blockheadAlgorandParticipationKey) => blockheadAlgorandParticipationKey[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadAlgorandParticipationKeys}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead algorand participation keys yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadAlgorandParticipationKey }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadAlgorandParticipationKey> })}
					{@const blockheadAlgorandParticipationKeyFields = { ...blockheadAlgorandParticipationKey[EntityMetaKey.Selector], ...blockheadAlgorandParticipationKey }}
					<BlockheadAlgorandParticipationKeyView
						selection={select(EntityType.BlockheadAlgorandParticipationKey, blockheadAlgorandParticipationKey[EntityMetaKey.Selector])}
						prefetched={blockheadAlgorandParticipationKeyFields}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.BlockheadAlgorandParticipationKey}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
