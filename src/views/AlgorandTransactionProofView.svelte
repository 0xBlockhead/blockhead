<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AlgorandTransactionProof> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AlgorandTransactionView from '$/views/AlgorandTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandTransactionProof}
	entitySelector={selection.entitySelector}
	title={title ?? 'algorand transaction proof'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		algorand transaction proof
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<AlgorandTransactionView
						selection={select(EntityType.AlgorandTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>round</dt>
				<dd>
					{selection.entitySelector.round}
				</dd>
			</div>

			<div>
				<dt>hash type</dt>
				<dd>
					{selection.entitySelector.hashType}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							proofBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const proofBytes = entity.proofBytes}
					{#if proofBytes != null}
						<div>
							<dt>proof bytes</dt>
							<dd>
								{proofBytes}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stibHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stibHash = entity.stibHash}
					{#if stibHash != null}
						<div>
							<dt>stib hash</dt>
							<dd>
								<TruncatedValue value={stibHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							treeDepth: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const treeDepth = entity.treeDepth}
					{#if treeDepth != null}
						<div>
							<dt>tree depth</dt>
							<dd>
								{treeDepth}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
