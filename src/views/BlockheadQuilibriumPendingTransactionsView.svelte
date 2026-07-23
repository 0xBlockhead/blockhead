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
		title = 'Blockhead Quilibrium pending transactions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadQuilibriumPendingTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadQuilibriumPendingTransaction>
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
	entityType={EntityType.BlockheadQuilibriumPendingTransaction}
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
				transactionAddress: true,
				amount: true,
				deliveryType: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadQuilibriumPendingTransactions) => [...new Map(blockheadQuilibriumPendingTransactions.values.map((blockheadQuilibriumPendingTransaction) => [blockheadQuilibriumPendingTransaction[EntityMetaKey.SelectorKey], blockheadQuilibriumPendingTransaction])).values()]}
	getKey={(blockheadQuilibriumPendingTransaction) => blockheadQuilibriumPendingTransaction[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead quilibrium pending transactions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadQuilibriumPendingTransaction })}
		{@const blockheadQuilibriumPendingTransactionFields = { ...blockheadQuilibriumPendingTransaction[EntityMetaKey.Selector], ...blockheadQuilibriumPendingTransaction }}
		<EntityView
			entityType={EntityType.BlockheadQuilibriumPendingTransaction}
			entitySelector={blockheadQuilibriumPendingTransaction[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadQuilibriumPendingTransactionFields.transactionAddress) ?? '')].filter(Boolean).join(' ') || 'blockhead quilibrium pending transaction'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadQuilibriumPendingTransactionFields.amount) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadQuilibriumPendingTransactionFields.deliveryType) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
