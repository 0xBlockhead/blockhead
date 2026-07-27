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
	}: EntitySelectionViewProps<EntityType.EasAttestation_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Blockscout_Rest,
			Source.EasContracts_Evm,
			Source.EasScan_Graphql,
			Source.Etherscan_Rest,
			Source.Voltaire_JsonRpc,
		],
	}))
	const easAttestationTimestamp = $derived(viewSelection({
		fields: {
			valid: true,
			revoked: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.timestampMs ?? '') || 'EAS attestation timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EasAttestationView from '$/views/EasAttestationView.svelte'
</script>


<EntityView
	entityType={EntityType.EasAttestation_Timestamp}
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
		<ResourceBoundary resource={easAttestationTimestamp}>
			{#snippet children(entity)}
				{String(entity.valid ?? '') || String(pendingEntity.timestampMs) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={easAttestationTimestamp}>
			{#snippet children(entity)}
				{@const revoked0 = entity.revoked}
				{#if revoked0 != null}
					<span data-text="muted">
						{revoked0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Attestation</dt>
				<dd>
					<EasAttestationView
						selection={select(EntityType.EasAttestation, selection.entitySelector.$attestation)}
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
				resource={easAttestationTimestamp}
			>
				{#snippet children(entity)}
					{@const valid = entity.valid}
					{#if valid != null}
						<div>
							<dt>Valid</dt>
							<dd>
								{valid ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={easAttestationTimestamp}
			>
				{#snippet children(entity)}
					{@const revoked = entity.revoked}
					{#if revoked != null}
						<div>
							<dt>Revoked</dt>
							<dd>
								{revoked ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							expired: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expired = entity.expired}
					{#if expired != null}
						<div>
							<dt>Expired</dt>
							<dd>
								{expired ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							revocationTime: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const revocationTime = entity.revocationTime}
					{#if revocationTime != null}
						<div>
							<dt>Revocation time</dt>
							<dd>
								<Timestamp timestamp={Number(revocationTime)} />
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
							blockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockNumber = entity.blockNumber}
					{#if blockNumber != null}
						<div>
							<dt>Block number</dt>
							<dd>
								<NumberValue
									value={blockNumber}
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
							transactionHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionHash = entity.transactionHash}
					{#if transactionHash != null}
						<div>
							<dt>Transaction hash</dt>
							<dd>
								<TruncatedValue value={String(transactionHash)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							logIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const logIndex = entity.logIndex}
					{#if logIndex != null}
						<div>
							<dt>Log index</dt>
							<dd>
								<NumberValue
									value={logIndex}
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
							revokedTransactionHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const revokedTransactionHash = entity.revokedTransactionHash}
					{#if revokedTransactionHash != null}
						<div>
							<dt>Revoked transaction hash</dt>
							<dd>
								<TruncatedValue value={String(revokedTransactionHash)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							revokedLogIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const revokedLogIndex = entity.revokedLogIndex}
					{#if revokedLogIndex != null}
						<div>
							<dt>Revoked log index</dt>
							<dd>
								<NumberValue
									value={revokedLogIndex}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
