<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.KaspaAcceptedTransaction> = $props()

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
