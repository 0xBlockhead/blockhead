<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.HederaSchedule_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import HederaScheduleView from '$/views/HederaScheduleView.svelte'
	import HederaTransactionView from '$/views/HederaTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaSchedule_Timestamp}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>schedule</dt>
				<dd>
					<HederaScheduleView
						selection={select(EntityType.HederaSchedule, selection.entitySelector.$schedule)}
						layout={EntityLayout.Value}
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
							executedTimestamp: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const executedTimestamp = entity.executedTimestamp}
					{#if executedTimestamp != null}
						<div>
							<dt>executed timestamp</dt>
							<dd>
								{executedTimestamp}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							deleted: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deleted = entity.deleted}
					{#if deleted != null}
						<div>
							<dt>deleted</dt>
							<dd>
								{deleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							expirationTime: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expirationTime = entity.expirationTime}
					{#if expirationTime != null}
						<div>
							<dt>expiration time</dt>
							<dd>
								{expirationTime}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							waitForExpiry: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const waitForExpiry = entity.waitForExpiry}
					{#if waitForExpiry != null}
						<div>
							<dt>wait for expiry</dt>
							<dd>
								{waitForExpiry ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							signatureCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const signatureCount = entity.signatureCount}
					{#if signatureCount != null}
						<div>
							<dt>signature count</dt>
							<dd>
								{signatureCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$executionTransaction}
			>
				{#snippet children(hederaTransaction)}
					{#if hederaTransaction != null}
						<div>
							<dt>execution transaction</dt>
							<dd>
								<HederaTransactionView
									selection={select(EntityType.HederaTransaction, hederaTransaction[EntityMetaKey.Selector])}
									prefetched={hederaTransaction}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
