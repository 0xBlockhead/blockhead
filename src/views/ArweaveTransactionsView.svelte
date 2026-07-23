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
		title = 'Arweave transactions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ArweaveTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ArweaveTransaction>
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
	entityType={EntityType.ArweaveTransaction}
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
				transactionId: true,
				quantityWinston: true,
				$block: true,
				$resource: true,
			},
		})
	}
	{countResource}
	getResourceItems={(arweaveTransactions) => [...new Map(arweaveTransactions.values.map((arweaveTransaction) => [arweaveTransaction[EntityMetaKey.SelectorKey], arweaveTransaction])).values()]}
	getKey={(arweaveTransaction) => arweaveTransaction[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Arweave transactions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: arweaveTransaction })}
		{@const arweaveTransactionFields = { ...arweaveTransaction[EntityMetaKey.Selector], ...arweaveTransaction }}
		<EntityView
			entityType={EntityType.ArweaveTransaction}
			entitySelector={arweaveTransaction[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((arweaveTransactionFields.transactionId) ?? '')].filter(Boolean).join(' ') || 'arweave transaction'}
			{/snippet}

			{#snippet Value()}
				{[String((arweaveTransactionFields.quantityWinston) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((arweaveTransactionFields.$block.height) ?? '')].filter(Boolean).join(' ') || [String((arweaveTransactionFields.$block.indepHash) ?? '')].filter(Boolean).join(' ') || 'arweave block', [String((arweaveTransactionFields.$resource.canonicalUri) ?? '')].filter(Boolean).join(' ') || [String((arweaveTransactionFields.$resource.transactionId) ?? '')].filter(Boolean).join(' ') || 'arweave resource'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
