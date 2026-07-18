<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
		sources: selection.sources,
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
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.attestationKind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={aiArtifactAttestation}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.attestationKind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<AiArtifactView
						selection={select(EntityType.AiArtifact, selection.entitySelector.$artifact)}
						layout={EntityLayout.Value}
						open={false}
					/>
		{:else}
			<ResourceBoundary resource={aiArtifactAttestation}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<AiArtifactView
						selection={select(EntityType.AiArtifact, selection.entitySelector.$artifact)}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const logEntryId0 = pendingEntity.logEntryId}
			{#if logEntryId0 !== undefined && logEntryId0 !== null}
				<span data-text="muted">
					{String((logEntryId0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={aiArtifactAttestation}>
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
		{/if}
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
								sources: selection.sources,
								fields: {
									attestationKind: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							logEntryId: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							signatureHashAlgorithm: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							signatureHash: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							certificateIdentity: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							certificateIssuer: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							logIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const logIndex = resolvedEntity.logIndex}
					{#if logIndex !== undefined && logIndex !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							integratedTime: true,
						},
					})
				}
			>
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
