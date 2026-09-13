<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HederaTopic_Timestamp>, 'prefetched'> = $props()

	const topic = $derived(selection.entitySelector.$topic)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaTopicView from '$/views/HederaTopicView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaTopic_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/topic/[topicId=stringSegment]/(hederaTopic)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						topic.$network.caip2 !== undefined ?
							caip2StringFromValue(topic.$network.caip2)
						:
							topic.$network.slug
					),
					topicId: topic.topicId,
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
				<dt>topic</dt>
				<dd>
					<HederaTopicView
						selection={select(EntityType.HederaTopic, selection.entitySelector.$topic)}
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
							memo: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const memo = entity.memo}
					{#if memo != null}
						<div>
							<dt>memo</dt>
							<dd>
								{memo}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							autoRenewAccountId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const autoRenewAccountId = entity.autoRenewAccountId}
					{#if autoRenewAccountId != null}
						<div>
							<dt>auto renew account ID</dt>
							<dd>
								<TruncatedValue value={autoRenewAccountId} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							autoRenewPeriodSeconds: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const autoRenewPeriodSeconds = entity.autoRenewPeriodSeconds}
					{#if autoRenewPeriodSeconds != null}
						<div>
							<dt>auto renew period seconds</dt>
							<dd>
								{autoRenewPeriodSeconds}
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
							sequenceNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sequenceNumber = entity.sequenceNumber}
					{#if sequenceNumber != null}
						<div>
							<dt>sequence number</dt>
							<dd>
								{sequenceNumber}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							runningHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const runningHash = entity.runningHash}
					{#if runningHash != null}
						<div>
							<dt>running hash</dt>
							<dd>
								<TruncatedValue value={runningHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
