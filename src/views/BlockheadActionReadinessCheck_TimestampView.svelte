<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadActionReadinessCheck_Timestamp> = $props()

	const readinessCheck = $derived(selection.entitySelector.$readinessCheck)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadActionReadinessCheckTimestamp = $derived(viewSelection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived((prefetched.status ?? '') || 'blockhead action readiness check timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadActionReadinessCheckView from '$/views/BlockheadActionReadinessCheckView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadActionReadinessCheck_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/session/[sessionId=stringSegment]/(blockheadSession)/action/[actionId=stringSegment]/(blockheadSessionAction)/readiness-check/[checkId=stringSegment]/(blockheadActionReadinessCheck)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					sessionId: readinessCheck.sessionId,
					actionId: readinessCheck.actionId,
					checkId: readinessCheck.checkId,
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
	{#snippet Title()}
		<ResourceBoundary resource={blockheadActionReadinessCheckTimestamp}>
			{#snippet children(entity)}
				{entity.status || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>readiness check</dt>
				<dd>
					<BlockheadActionReadinessCheckView
						selection={select(EntityType.BlockheadActionReadinessCheck, selection.entitySelector.$readinessCheck)}
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

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadActionReadinessCheckTimestamp}
					>
						{#snippet children(entity)}
							{entity.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							observedAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observedAmount = entity.observedAmount}
					{#if observedAmount != null}
						<div>
							<dt>observed amount</dt>
							<dd>
								<NumberValue
									value={observedAmount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							requiredAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const requiredAmount = entity.requiredAmount}
					{#if requiredAmount != null}
						<div>
							<dt>required amount</dt>
							<dd>
								<NumberValue
									value={requiredAmount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							deficitAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deficitAmount = entity.deficitAmount}
					{#if deficitAmount != null}
						<div>
							<dt>deficit amount</dt>
							<dd>
								<NumberValue
									value={deficitAmount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							observedCapabilityStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observedCapabilityStatus = entity.observedCapabilityStatus}
					{#if observedCapabilityStatus != null}
						<div>
							<dt>observed capability status</dt>
							<dd>
								{observedCapabilityStatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sourcePayloadHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourcePayloadHash = entity.sourcePayloadHash}
					{#if sourcePayloadHash != null}
						<div>
							<dt>source payload hash</dt>
							<dd>
								<TruncatedValue value={sourcePayloadHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
