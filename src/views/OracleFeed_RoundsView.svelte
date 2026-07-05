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
		title = 'Oracle feed rounds',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'OracleFeed_Rounds-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.OracleFeed_Round>
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
	import OracleFeed_RoundView from '$/views/OracleFeed_RoundView.svelte'
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
					roundId: true,
					answer: true,
					updatedAtMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(oracleFeedRounds)}
			{@const uniqueOracleFeedRounds = [...new Map(oracleFeedRounds.values.map((oracleFeedRound) => [oracleFeedRound[EntityMetaKey.SelectorKey], oracleFeedRound])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.OracleFeed_Round}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={oracleFeedRounds.totalCount}
				getKey={(oracleFeedRound) => oracleFeedRound[EntityMetaKey.SelectorKey]}
				items={uniqueOracleFeedRounds}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Oracle feed rounds yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: oracleFeedRound }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.OracleFeed_Round> })}
					{@const oracleFeedRoundFields = { ...oracleFeedRound[EntityMetaKey.Selector], ...oracleFeedRound }}
					<OracleFeed_RoundView
						selection={select(EntityType.OracleFeed_Round, oracleFeedRound[EntityMetaKey.Selector])}
						prefetched={oracleFeedRoundFields}
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
		entityType={EntityType.OracleFeed_Round}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
