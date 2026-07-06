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
		title = 'Blockhead Litecoin MWEB output states',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLitecoinMwebOutputStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadLitecoinMwebOutputState>
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
	import BlockheadLitecoinMwebOutputStateView from '$/views/BlockheadLitecoinMwebOutputStateView.svelte'
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
					commitment: true,
					walletId: true,
					amountLitoshis: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadLitecoinMwebOutputState}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadLitecoinMwebOutputStates)}
			{@const uniqueBlockheadLitecoinMwebOutputStates = [...new Map(blockheadLitecoinMwebOutputStates.values.map((blockheadLitecoinMwebOutputState) => [blockheadLitecoinMwebOutputState[EntityMetaKey.SelectorKey], blockheadLitecoinMwebOutputState])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadLitecoinMwebOutputState}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadLitecoinMwebOutputStates.totalCount}
				getKey={(blockheadLitecoinMwebOutputState) => blockheadLitecoinMwebOutputState[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadLitecoinMwebOutputStates}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead litecoin mweb output states yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadLitecoinMwebOutputState }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadLitecoinMwebOutputState> })}
					{@const blockheadLitecoinMwebOutputStateFields = { ...blockheadLitecoinMwebOutputState[EntityMetaKey.Selector], ...blockheadLitecoinMwebOutputState }}
					<BlockheadLitecoinMwebOutputStateView
						selection={select(EntityType.BlockheadLitecoinMwebOutputState, blockheadLitecoinMwebOutputState[EntityMetaKey.Selector])}
						prefetched={blockheadLitecoinMwebOutputStateFields}
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
		entityType={EntityType.BlockheadLitecoinMwebOutputState}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
