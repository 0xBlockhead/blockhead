<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EasAttestation_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EasAttestation_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const easAttestationTimestamp = $derived(selection({
		sources: [
			Source.Blockscout_Rest,
			Source.EasContracts_Evm,
			Source.EasScan_Graphql,
			Source.Etherscan_Rest,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			valid: true,
			revoked: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'EAS attestation timestamp')
	const viewDomId = $derived('eas-attestation-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EasAttestationView from '$/views/EasAttestationView.svelte'
</script>


<EntityView
	entityType={EntityType.EasAttestation_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={easAttestationTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={easAttestationTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.valid) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'EAS attestation timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.valid) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={easAttestationTimestamp}>
			{#snippet Pending()}
				{@const revoked0 = prefetched.revoked}
				{#if revoked0 !== undefined && revoked0 !== null}
					<span data-text="muted">
						{revoked0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const revoked0 = resolvedEntity.revoked}
				{#if revoked0 !== undefined && revoked0 !== null}
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							valid: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const valid = prefetched.valid}
					{#if valid !== undefined && valid !== null}
						<div>
							<dt>Valid</dt>
							<dd>
								{valid ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valid = resolvedEntity.valid}
					{#if valid !== undefined && valid !== null}
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
				resource={
					selection({
						fields: {
							revoked: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const revoked = prefetched.revoked}
					{#if revoked !== undefined && revoked !== null}
						<div>
							<dt>Revoked</dt>
							<dd>
								{revoked ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const revoked = resolvedEntity.revoked}
					{#if revoked !== undefined && revoked !== null}
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
					selection({
						fields: {
							expired: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const expired = prefetched.expired}
					{#if expired !== undefined && expired !== null}
						<div>
							<dt>Expired</dt>
							<dd>
								{expired ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expired = resolvedEntity.expired}
					{#if expired !== undefined && expired !== null}
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
					selection({
						fields: {
							revocationTime: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const revocationTime = prefetched.revocationTime}
					{#if revocationTime !== undefined && revocationTime !== null}
						<div>
							<dt>Revocation time</dt>
							<dd>
								<Timestamp timestamp={Number(revocationTime)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const revocationTime = resolvedEntity.revocationTime}
					{#if revocationTime !== undefined && revocationTime !== null}
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
					selection({
						fields: {
							blockNumber: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockNumber = prefetched.blockNumber}
					{#if blockNumber !== undefined && blockNumber !== null}
						<div>
							<dt>Block number</dt>
							<dd>
								<NumberValue value={Number(blockNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockNumber = resolvedEntity.blockNumber}
					{#if blockNumber !== undefined && blockNumber !== null}
						<div>
							<dt>Block number</dt>
							<dd>
								<NumberValue value={Number(blockNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionHash = prefetched.transactionHash}
					{#if transactionHash !== undefined && transactionHash !== null}
						<div>
							<dt>Transaction hash</dt>
							<dd>
								<TruncatedValue value={String((transactionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionHash = resolvedEntity.transactionHash}
					{#if transactionHash !== undefined && transactionHash !== null}
						<div>
							<dt>Transaction hash</dt>
							<dd>
								<TruncatedValue value={String((transactionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							logIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const logIndex = prefetched.logIndex}
					{#if logIndex !== undefined && logIndex !== null}
						<div>
							<dt>Log index</dt>
							<dd>
								<NumberValue value={Number(logIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const logIndex = resolvedEntity.logIndex}
					{#if logIndex !== undefined && logIndex !== null}
						<div>
							<dt>Log index</dt>
							<dd>
								<NumberValue value={Number(logIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							revokedTransactionHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const revokedTransactionHash = prefetched.revokedTransactionHash}
					{#if revokedTransactionHash !== undefined && revokedTransactionHash !== null}
						<div>
							<dt>Revoked transaction hash</dt>
							<dd>
								<TruncatedValue value={String((revokedTransactionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const revokedTransactionHash = resolvedEntity.revokedTransactionHash}
					{#if revokedTransactionHash !== undefined && revokedTransactionHash !== null}
						<div>
							<dt>Revoked transaction hash</dt>
							<dd>
								<TruncatedValue value={String((revokedTransactionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							revokedLogIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const revokedLogIndex = prefetched.revokedLogIndex}
					{#if revokedLogIndex !== undefined && revokedLogIndex !== null}
						<div>
							<dt>Revoked log index</dt>
							<dd>
								<NumberValue value={Number(revokedLogIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const revokedLogIndex = resolvedEntity.revokedLogIndex}
					{#if revokedLogIndex !== undefined && revokedLogIndex !== null}
						<div>
							<dt>Revoked log index</dt>
							<dd>
								<NumberValue value={Number(revokedLogIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
