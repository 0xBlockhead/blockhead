<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.CctpAttestation_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.CircleCctp_IrisApi,
		],
	}))
	const cctpAttestationTimestamp = $derived(viewSelection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.timestampMs ?? '') || 'CCTP attestation timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CctpMessageView from '$/views/CctpMessageView.svelte'
</script>


<EntityView
	entityType={EntityType.CctpAttestation_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cctpAttestationTimestamp}>
			{#snippet children(entity)}
				{(entity.status ?? '') || String(pendingEntity.timestampMs) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{pendingEntity.source}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Message</dt>
				<dd>
					<CctpMessageView
						selection={select(EntityType.CctpMessage, selection.entitySelector.$message)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={cctpAttestationTimestamp}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>Status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							requestId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const requestId = entity.requestId}
					{#if requestId != null}
						<div>
							<dt>Request ID</dt>
							<dd>
								{requestId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							delayReason: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delayReason = entity.delayReason}
					{#if delayReason != null}
						<div>
							<dt>Delay reason</dt>
							<dd>
								{delayReason}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							forwardState: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const forwardState = entity.forwardState}
					{#if forwardState != null}
						<div>
							<dt>Forward state</dt>
							<dd>
								{forwardState}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							forwardTxHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const forwardTxHash = entity.forwardTxHash}
					{#if forwardTxHash != null}
						<div>
							<dt>Forward transaction hash</dt>
							<dd>
								<TruncatedValue value={String(forwardTxHash)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							attestation: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const attestation = entity.attestation}
					{#if attestation != null}
						<div>
							<dt>Attestation</dt>
							<dd>
								{String(attestation)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
