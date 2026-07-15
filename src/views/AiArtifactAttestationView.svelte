<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.AiArtifactAttestation>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AiArtifactAttestation>>
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
	const aiArtifactAttestation = $derived(selection({
		sources: [
			Source.A2aWellKnown_Http,
			Source.Eip8004Scan_Rest,
			Source.Ipfs_Rest,
		],
	}))
	const titleFallback = $derived([String((pendingEntity.attestationKind) ?? '')].filter(Boolean).join(' ') || 'AI artifact attestation')
	const viewDomId = $derived('ai-artifact-attestation-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AiArtifactView from '$/views/AiArtifactView.svelte'
</script>


<EntityView
	entityType={EntityType.AiArtifactAttestation}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aiArtifactAttestation}>
			{#snippet Pending()}
				{[String((pendingEntity.attestationKind) ?? '')].filter(Boolean).join(' ') || title || 'AI artifact attestation'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.attestationKind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aiArtifactAttestation}>
			{#snippet Pending()}
				<AiArtifactView
					selection={select(EntityType.AiArtifact, selection.entitySelector.$artifact)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<AiArtifactView
					selection={select(EntityType.AiArtifact, selection.entitySelector.$artifact)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiArtifactAttestation}>
			{#snippet Pending()}
				{@const logEntryId0 = pendingEntity.logEntryId}
				{#if logEntryId0 !== undefined && logEntryId0 !== null}
					<span data-text="muted">
						{String((logEntryId0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const logEntryId0 = resolvedEntity.logEntryId}
				{#if logEntryId0 !== undefined && logEntryId0 !== null}
					<span data-text="muted">
						{String((logEntryId0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>artifact</dt>
				<dd>
					<AiArtifactView
						selection={select(EntityType.AiArtifact, selection.entitySelector.$artifact, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>attestation kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									attestationKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const attestationKind = pendingEntity.attestationKind}
							{#if attestationKind !== undefined && attestationKind !== null}
								{String((attestationKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const attestationKind = resolvedEntity.attestationKind}
							{#if attestationKind !== undefined && attestationKind !== null}
								{String((attestationKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							logEntryId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const logEntryId = pendingEntity.logEntryId}
					{#if logEntryId !== undefined && logEntryId !== null}
						<div>
							<dt>log entry ID</dt>
							<dd>
								{String((logEntryId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const logEntryId = resolvedEntity.logEntryId}
					{#if logEntryId !== undefined && logEntryId !== null}
						<div>
							<dt>log entry ID</dt>
							<dd>
								{String((logEntryId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							signatureHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const signatureHashAlgorithm = pendingEntity.signatureHashAlgorithm}
					{#if signatureHashAlgorithm !== undefined && signatureHashAlgorithm !== null}
						<div>
							<dt>signature hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((signatureHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const signatureHashAlgorithm = resolvedEntity.signatureHashAlgorithm}
					{#if signatureHashAlgorithm !== undefined && signatureHashAlgorithm !== null}
						<div>
							<dt>signature hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((signatureHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							signatureHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const signatureHash = pendingEntity.signatureHash}
					{#if signatureHash !== undefined && signatureHash !== null}
						<div>
							<dt>signature hash</dt>
							<dd>
								<TruncatedValue value={String((signatureHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const signatureHash = resolvedEntity.signatureHash}
					{#if signatureHash !== undefined && signatureHash !== null}
						<div>
							<dt>signature hash</dt>
							<dd>
								<TruncatedValue value={String((signatureHash) ?? '')} />
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
							certificateIdentity: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const certificateIdentity = pendingEntity.certificateIdentity}
					{#if certificateIdentity !== undefined && certificateIdentity !== null}
						<div>
							<dt>certificate identity</dt>
							<dd>
								{String((certificateIdentity) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const certificateIdentity = resolvedEntity.certificateIdentity}
					{#if certificateIdentity !== undefined && certificateIdentity !== null}
						<div>
							<dt>certificate identity</dt>
							<dd>
								{String((certificateIdentity) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							certificateIssuer: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const certificateIssuer = pendingEntity.certificateIssuer}
					{#if certificateIssuer !== undefined && certificateIssuer !== null}
						<div>
							<dt>certificate issuer</dt>
							<dd>
								<TruncatedValue value={String((certificateIssuer) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const certificateIssuer = resolvedEntity.certificateIssuer}
					{#if certificateIssuer !== undefined && certificateIssuer !== null}
						<div>
							<dt>certificate issuer</dt>
							<dd>
								<TruncatedValue value={String((certificateIssuer) ?? '')} />
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
					{@const logIndex = pendingEntity.logIndex}
					{#if logIndex !== undefined && logIndex !== null}
						<div>
							<dt>log index</dt>
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
							<dt>log index</dt>
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
							integratedTime: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const integratedTime = pendingEntity.integratedTime}
					{#if integratedTime !== undefined && integratedTime !== null}
						<div>
							<dt>integrated time</dt>
							<dd>
								<Timestamp timestamp={Number(integratedTime)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const integratedTime = resolvedEntity.integratedTime}
					{#if integratedTime !== undefined && integratedTime !== null}
						<div>
							<dt>integrated time</dt>
							<dd>
								<Timestamp timestamp={Number(integratedTime)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
