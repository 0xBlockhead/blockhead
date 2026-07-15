<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Transactions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadBridgeTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadBridgeTransaction>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadBridgeTransactionView from '$/views/BlockheadBridgeTransactionView.svelte'
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
					createdAt: true,
					$sourceTx: true,
					$account: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadBridgeTransaction}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadBridgeTransactions)}
			{@const uniqueBlockheadBridgeTransactions = [...new Map(blockheadBridgeTransactions.values.map((blockheadBridgeTransaction) => [blockheadBridgeTransaction[EntityMetaKey.SelectorKey], blockheadBridgeTransaction])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadBridgeTransaction}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadBridgeTransactions.totalCount}
				getKey={(blockheadBridgeTransaction) => blockheadBridgeTransaction[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadBridgeTransactions}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Bridge transactions yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadBridgeTransaction })}
					{@const blockheadBridgeTransactionFields = { ...blockheadBridgeTransaction[EntityMetaKey.Selector], ...blockheadBridgeTransaction }}
					{@const selection = select(EntityType.BlockheadBridgeTransaction, blockheadBridgeTransaction[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const blockheadBridgeTransactionHrefFields = { ...blockheadBridgeTransaction, ...blockheadBridgeTransaction[EntityMetaKey.Selector] }}
					<BlockheadBridgeTransactionView
						selection={selection}
						prefetched={blockheadBridgeTransactionFields}
						href={
							(blockheadBridgeTransactionHrefFields.createdAt !== undefined && blockheadBridgeTransactionHrefFields.$account !== undefined && blockheadBridgeTransactionHrefFields.$account.address !== undefined && blockheadBridgeTransactionHrefFields.$sourceTx !== undefined && blockheadBridgeTransactionHrefFields.$sourceTx.$network !== undefined && blockheadBridgeTransactionHrefFields.$sourceTx.$network.caip2 !== undefined && blockheadBridgeTransactionHrefFields.$sourceTx.$network.caip2.reference !== undefined && blockheadBridgeTransactionHrefFields.$sourceTx.txHash !== undefined ? resolve('/~/accounts/transaction/[chainId=eip155ChainId]/[address=evmAddress]/[sourceTxHash=stringSegment]/[createdAt=nonNegativeInteger]', {
								createdAt: String(blockheadBridgeTransactionHrefFields.createdAt ?? ''),
								address: String(blockheadBridgeTransactionHrefFields.$account.address ?? ''),
								chainId: String(blockheadBridgeTransactionHrefFields.$sourceTx.$network.caip2.reference ?? ''),
								sourceTxHash: String(blockheadBridgeTransactionHrefFields.$sourceTx.txHash ?? ''),
							}) : undefined)
						}
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
		entityType={EntityType.BlockheadBridgeTransaction}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
