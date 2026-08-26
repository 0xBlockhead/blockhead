<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.CctpAttestation_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.CircleCctpIris,
		],
	}))
	const cctpAttestationTimestamp = $derived(viewSelection({
		fields: {
			status: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CctpMessageView from '$/views/CctpMessageView.svelte'
</script>


<EntityView
	entityType={EntityType.CctpAttestation_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cctpAttestationTimestamp}>
			{#snippet children(entity)}
				{(entity.status ?? '') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Message</dt>
				<dd>
					<CctpMessageView
						selection={select(EntityType.CctpMessage, selection.entitySelector.$message)}
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
								<TruncatedValue value={forwardTxHash} />
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
								{attestation}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
