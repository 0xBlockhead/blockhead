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
	}: EntitySelectionViewProps<EntityType.TonContractGetMethod_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TonContractGetMethodView from '$/views/TonContractGetMethodView.svelte'
</script>


<EntityView
	entityType={EntityType.TonContractGetMethod_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'TON contract get method timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		TON contract get method timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>method</dt>
				<dd>
					<TonContractGetMethodView
						selection={select(EntityType.TonContractGetMethod, selection.entitySelector.$method)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							methodId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const methodId = entity.methodId}
					{#if methodId != null}
						<div>
							<dt>method ID</dt>
							<dd>
								{methodId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							exitCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const exitCode = entity.exitCode}
					{#if exitCode != null}
						<div>
							<dt>exit code</dt>
							<dd>
								{exitCode}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasUsed = entity.gasUsed}
					{#if gasUsed != null}
						<div>
							<dt>gas used</dt>
							<dd>
								{gasUsed}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							resultHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resultHash = entity.resultHash}
					{#if resultHash != null}
						<div>
							<dt>result hash</dt>
							<dd>
								<TruncatedValue value={resultHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockSeqno: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockSeqno = entity.blockSeqno}
					{#if blockSeqno != null}
						<div>
							<dt>block seqno</dt>
							<dd>
								{blockSeqno}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastTransactionLt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastTransactionLt = entity.lastTransactionLt}
					{#if lastTransactionLt != null}
						<div>
							<dt>last transaction lt</dt>
							<dd>
								{lastTransactionLt}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
