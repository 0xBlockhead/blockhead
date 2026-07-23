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
		title = 'Blockhead Algorand pending transactions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAlgorandPendingTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadAlgorandPendingTransaction>
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
	entityType={EntityType.BlockheadAlgorandPendingTransaction}
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
				txId: true,
				transactionType: true,
				observedAtMs: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadAlgorandPendingTransactions) => [...new Map(blockheadAlgorandPendingTransactions.values.map((blockheadAlgorandPendingTransaction) => [blockheadAlgorandPendingTransaction[EntityMetaKey.SelectorKey], blockheadAlgorandPendingTransaction])).values()]}
	getKey={(blockheadAlgorandPendingTransaction) => blockheadAlgorandPendingTransaction[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead algorand pending transactions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadAlgorandPendingTransaction })}
		{@const blockheadAlgorandPendingTransactionFields = { ...blockheadAlgorandPendingTransaction[EntityMetaKey.Selector], ...blockheadAlgorandPendingTransaction }}
		<EntityView
			entityType={EntityType.BlockheadAlgorandPendingTransaction}
			entitySelector={blockheadAlgorandPendingTransaction[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadAlgorandPendingTransactionFields.txId) ?? '')].filter(Boolean).join(' ') || 'blockhead algorand pending transaction'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadAlgorandPendingTransactionFields.transactionType) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadAlgorandPendingTransactionFields.observedAtMs) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
