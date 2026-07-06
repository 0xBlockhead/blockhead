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
		title = 'Blockhead Monero transfer states',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadMoneroTransferStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadMoneroTransferState>
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
	import BlockheadMoneroTransferStateView from '$/views/BlockheadMoneroTransferStateView.svelte'
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
					txHash: true,
					direction: true,
					amountAtomicUnits: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadMoneroTransferState}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadMoneroTransferStates)}
			{@const uniqueBlockheadMoneroTransferStates = [...new Map(blockheadMoneroTransferStates.values.map((blockheadMoneroTransferState) => [blockheadMoneroTransferState[EntityMetaKey.SelectorKey], blockheadMoneroTransferState])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadMoneroTransferState}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadMoneroTransferStates.totalCount}
				getKey={(blockheadMoneroTransferState) => blockheadMoneroTransferState[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadMoneroTransferStates}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead monero transfer states yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadMoneroTransferState }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadMoneroTransferState> })}
					{@const blockheadMoneroTransferStateFields = { ...blockheadMoneroTransferState[EntityMetaKey.Selector], ...blockheadMoneroTransferState }}
					<BlockheadMoneroTransferStateView
						selection={select(EntityType.BlockheadMoneroTransferState, blockheadMoneroTransferState[EntityMetaKey.Selector])}
						prefetched={blockheadMoneroTransferStateFields}
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
		entityType={EntityType.BlockheadMoneroTransferState}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
