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
	}: EntitySelectionViewProps<EntityType.TonTransactionPhase> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TonTransactionView from '$/views/TonTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.TonTransactionPhase}
	entitySelector={selection.entitySelector}
	title={title ?? 'TON transaction phase'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		TON transaction phase
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<TonTransactionView
						selection={select(EntityType.TonTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>phase kind</dt>
				<dd>
					{selection.entitySelector.phaseKind}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							success: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const success = entity.success}
					{#if success != null}
						<div>
							<dt>success</dt>
							<dd>
								{success ? 'Yes' : 'No'}
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
							gasFeesNano: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasFeesNano = entity.gasFeesNano}
					{#if gasFeesNano != null}
						<div>
							<dt>gas fees nano</dt>
							<dd>
								{gasFeesNano}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							storageFeesNano: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const storageFeesNano = entity.storageFeesNano}
					{#if storageFeesNano != null}
						<div>
							<dt>storage fees nano</dt>
							<dd>
								{storageFeesNano}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							actionResultCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const actionResultCode = entity.actionResultCode}
					{#if actionResultCode != null}
						<div>
							<dt>action result code</dt>
							<dd>
								{actionResultCode}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							skippedReason: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const skippedReason = entity.skippedReason}
					{#if skippedReason != null}
						<div>
							<dt>skipped reason</dt>
							<dd>
								{skippedReason}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
