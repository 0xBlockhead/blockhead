<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		selection,
		title = 'Token transfers',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Token transfers...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmTokenTransfers-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmTokenTransfer>
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
	import NumberValue from '$/components/NumberValue.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#snippet ModelTypeAnnotationTooltip()}
	<p>
		ERC-20, ERC-721, and ERC-1155 movements indexed from receipt logs on this transaction.
	</p>
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					indexInLog: true,
					standard: true,
					amount: true,
					tokenSymbol: true,
					tokenId: true,
				},
				limit: 64,
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmTokenTransfer}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
			/>
		{/snippet}

		{#snippet children(evmTokenTransfers)}
			{@const uniqueEvmTokenTransfers = [...new Map(evmTokenTransfers.values.map((evmTokenTransfer) => [evmTokenTransfer[EntityMetaKey.SelectorKey], evmTokenTransfer])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmTokenTransfer}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				totalCount={evmTokenTransfers.values.length === uniqueEvmTokenTransfers.length && evmTokenTransfers.totalCount != null && evmTokenTransfers.totalCount >= uniqueEvmTokenTransfers.length ? evmTokenTransfers.totalCount : uniqueEvmTokenTransfers.length}
				getKey={(evmTokenTransfer) => evmTokenTransfer[EntityMetaKey.SelectorKey]}
				items={uniqueEvmTokenTransfers}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No token transfers yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmTokenTransfer }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmTokenTransfer> })}
					<EntityView
						entityType={EntityType.EvmTokenTransfer}
						entitySelector={evmTokenTransfer.entitySelector}
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]/token-transfer/[indexInTransaction=nonNegativeInteger]/[indexInLog=nonNegativeInteger]', {
								caip2: `${String(({ ...evmTokenTransfer.entitySelector, ...evmTokenTransfer }).$log.$transaction.$network.caip2.namespace)}:${String(({ ...evmTokenTransfer.entitySelector, ...evmTokenTransfer }).$log.$transaction.$network.caip2.reference)}`,
								transactionId: String(({ ...evmTokenTransfer.entitySelector, ...evmTokenTransfer }).$log.$transaction.txHash),
								indexInTransaction: String(({ ...evmTokenTransfer.entitySelector, ...evmTokenTransfer }).$log.indexInTransaction),
								indexInLog: String(({ ...evmTokenTransfer.entitySelector, ...evmTokenTransfer }).indexInLog),
							})
						}
						layout={EntityLayout.Summary}
						open={false}
					>
						{#snippet Title()}
							{@const indexInLog0 = ({ ...evmTokenTransfer.entitySelector, ...evmTokenTransfer }).indexInLog}
							Transfer #
							<span>Transfer #</span>
							{String((indexInLog0) ?? '')}
							{@const standard1 = ({ ...evmTokenTransfer.entitySelector, ...evmTokenTransfer }).standard}
							{String((standard1) ?? '')}
							{@const amount2 = ({ ...evmTokenTransfer.entitySelector, ...evmTokenTransfer }).amount}
							<NumberValue value={Number(amount2)} />
						{/snippet}

						{#snippet HeadingAfter()}
							{@const tokenSymbolAfter0 = ({ ...evmTokenTransfer.entitySelector, ...evmTokenTransfer }).tokenSymbol}
							{#if tokenSymbolAfter0 != null}
								<span data-text="muted">
									{String((tokenSymbolAfter0) ?? '')}
								</span>
							{/if}
							{@const tokenIdAfter1 = ({ ...evmTokenTransfer.entitySelector, ...evmTokenTransfer }).tokenId}
							{#if tokenIdAfter1 != null}
								<span data-text="muted">
									<NumberValue value={Number(tokenIdAfter1)} />
								</span>
							{/if}
						{/snippet}
					</EntityView>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.EvmTokenTransfer}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	/>
{/if}
