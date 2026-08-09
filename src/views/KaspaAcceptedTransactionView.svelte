<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.KaspaAcceptedTransaction>, 'prefetched'> = $props()

	const acceptingBlock = $derived(selection.entitySelector.$acceptingBlock)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.KaspaNode_Grpc,
			Source.KaspaNode_Wrpc,
		],
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import KaspaBlockView from '$/views/KaspaBlockView.svelte'
	import KaspaTransactionView from '$/views/KaspaTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.KaspaAcceptedTransaction}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/block/[blockHash=stringSegment]/(kaspaBlock)/accepted-transaction/[transactionId=stringSegment]',
				{
					network: (
						'caip2' in acceptingBlock.$network.$network ?
							caip2StringFromValue(acceptingBlock.$network.$network.caip2)
						:
							acceptingBlock.$network.$network.slug
					),
					blockHash: acceptingBlock.blockHash,
					transactionId: selection.entitySelector.$transaction.transactionId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>accepting block</dt>
				<dd>
					<KaspaBlockView
						selection={select(EntityType.KaspaBlock, selection.entitySelector.$acceptingBlock)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction</dt>
				<dd>
					<KaspaTransactionView
						selection={select(EntityType.KaspaTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							acceptedIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const acceptedIndex = entity.acceptedIndex}
					{#if acceptedIndex != null}
						<div>
							<dt>accepted index</dt>
							<dd>
								<NumberValue
									value={acceptedIndex}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>accepting block hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									acceptingBlockHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.acceptingBlockHash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>transaction ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									transactionId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.transactionId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
