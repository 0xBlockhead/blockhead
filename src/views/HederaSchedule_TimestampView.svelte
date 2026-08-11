<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HederaSchedule_Timestamp>, 'prefetched'> = $props()

	const schedule = $derived(selection.entitySelector.$schedule)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import HederaScheduleView from '$/views/HederaScheduleView.svelte'
	import HederaTransactionView from '$/views/HederaTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaSchedule_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/schedule/[scheduleId=stringSegment]/(hederaSchedule)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in schedule.$network ?
							caip2StringFromValue(schedule.$network.caip2)
						:
							schedule.$network.slug
					),
					scheduleId: schedule.scheduleId,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
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
						{@const hederaTransactionInitial = untrack(() => hederaTransaction)}
						<div>
							<dt>execution transaction</dt>
							<dd>
								<HederaTransactionView
									selection={select(EntityType.HederaTransaction, (hederaTransaction ?? hederaTransactionInitial)[EntityMetaKey.Selector])}
									prefetched={hederaTransaction ?? hederaTransactionInitial}
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
