<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AiArtifactAttestation>, 'prefetched'> = $props()

	const artifact = $derived(selection.entitySelector.$artifact)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Eip8004Scan_Rest,
			Source.Ipfs_Rest,
		],
	}))
	const aiArtifactAttestation = $derived(viewSelection({
		fields: {
			logEntryId: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AiArtifactView from '$/views/AiArtifactView.svelte'
</script>


<EntityView
	entityType={EntityType.AiArtifactAttestation}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.attestationKind || 'AI artifact attestation')}
	href={
		href === undefined ?
			(
				selection.entitySelector.signatureHashAlgorithm !== undefined
				&& selection.entitySelector.signatureHash !== undefined
				&& artifact.digestAlgorithm !== undefined
				&& artifact.digest !== undefined ?
					resolve(
						'/(ai)/ai/artifact/digest/[digestAlgorithm=stringSegment]/[digest=zeroExHex]/(aiArtifact)/attestation/[attestationKind=stringSegment]/signature/[signatureHashAlgorithm=stringSegment]/[signatureHash=stringSegment]',
						{
							digestAlgorithm: artifact.digestAlgorithm,
							digest: artifact.digest,
							attestationKind: selection.entitySelector.attestationKind,
							signatureHashAlgorithm: selection.entitySelector.signatureHashAlgorithm,
							signatureHash: selection.entitySelector.signatureHash,
						}
					)
				:
					selection.entitySelector.logEntryId !== undefined
					&& artifact.digestAlgorithm !== undefined
					&& artifact.digest !== undefined ?
						resolve(
							'/(ai)/ai/artifact/digest/[digestAlgorithm=stringSegment]/[digest=zeroExHex]/(aiArtifact)/attestation/[attestationKind=stringSegment]/log/[logEntryId=stringSegment]',
							{
								digestAlgorithm: artifact.digestAlgorithm,
								digest: artifact.digest,
								attestationKind: selection.entitySelector.attestationKind,
								logEntryId: selection.entitySelector.logEntryId,
							}
						)
					:
						undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<AiArtifactView
			selection={select(EntityType.AiArtifact, selection.entitySelector.$artifact)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiArtifactAttestation}>
			{#snippet children(entity)}
				{@const logEntryId = entity.logEntryId}
				{#if logEntryId != null}
					<span data-text="muted">
						{logEntryId}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>artifact</dt>
				<dd>
					<AiArtifactView
						selection={select(EntityType.AiArtifact, selection.entitySelector.$artifact)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>attestation kind</dt>
				<dd>
					{selection.entitySelector.attestationKind}
				</dd>
			</div>

			<ResourceBoundary
				resource={aiArtifactAttestation}
			>
				{#snippet children(entity)}
					{@const logEntryId = entity.logEntryId}
					{#if logEntryId != null}
						<div>
							<dt>log entry ID</dt>
							<dd>
								{logEntryId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							signatureHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const signatureHashAlgorithm = entity.signatureHashAlgorithm}
					{#if signatureHashAlgorithm != null}
						<div>
							<dt>signature hash algorithm</dt>
							<dd>
								{signatureHashAlgorithm}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							signatureHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const signatureHash = entity.signatureHash}
					{#if signatureHash != null}
						<div>
							<dt>signature hash</dt>
							<dd>
								<TruncatedValue value={signatureHash} />
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
							certificateIdentity: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const certificateIdentity = entity.certificateIdentity}
					{#if certificateIdentity != null}
						<div>
							<dt>certificate identity</dt>
							<dd>
								{certificateIdentity}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							certificateIssuer: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const certificateIssuer = entity.certificateIssuer}
					{#if certificateIssuer != null}
						<div>
							<dt>certificate issuer</dt>
							<dd>
								<TruncatedValue value={certificateIssuer} />
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
							<dt>log index</dt>
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
							integratedTime: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const integratedTime = entity.integratedTime}
					{#if integratedTime != null}
						<div>
							<dt>integrated time</dt>
							<dd>
								<Timestamp timestamp={integratedTime} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
