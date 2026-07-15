<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.AiArtifact>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AiArtifact>>
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
	const aiArtifact = $derived(selection({
		sources: [
			Source.HuggingFaceHub_Rest,
			Source.Ipfs_Rest,
			Source.Mlflow_Rest,
		],
		fields: {
			artifactType: true,
			mediaType: true,
			size: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.artifactType) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.providerArtifactId) ?? ''), String((pendingEntity.ociDigest) ?? ''), String((pendingEntity.ipfsCid) ?? ''), String((pendingEntity.arweaveId) ?? ''), String((pendingEntity.gitObject) ?? ''), String((pendingEntity.digest) ?? '')].filter(Boolean).join(' ') || 'AI artifact')
	const viewDomId = $derived('ai-artifact-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AiDocumentsView from '$/views/AiDocumentsView.svelte'
	import AiArtifactAttestationsView from '$/views/AiArtifactAttestationsView.svelte'
	import AiModelProviderView from '$/views/AiModelProviderView.svelte'
</script>


<EntityView
	entityType={EntityType.AiArtifact}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aiArtifact}>
			{#snippet Pending()}
				{[String((pendingEntity.artifactType) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.providerArtifactId) ?? ''), String((pendingEntity.ociDigest) ?? ''), String((pendingEntity.ipfsCid) ?? ''), String((pendingEntity.arweaveId) ?? ''), String((pendingEntity.gitObject) ?? ''), String((pendingEntity.digest) ?? '')].filter(Boolean).join(' ') || 'AI artifact'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.artifactType) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aiArtifact}>
			{#snippet Pending()}
				{[String((pendingEntity.mediaType) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.artifactType) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.providerArtifactId) ?? ''), String((pendingEntity.ociDigest) ?? ''), String((pendingEntity.ipfsCid) ?? ''), String((pendingEntity.arweaveId) ?? ''), String((pendingEntity.gitObject) ?? ''), String((pendingEntity.digest) ?? '')].filter(Boolean).join(' ') || 'AI artifact'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.mediaType) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.artifactType) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiArtifact}>
			{#snippet Pending()}
				{@const size0 = pendingEntity.size}
				{#if size0 !== undefined && size0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(size0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const size0 = resolvedEntity.size}
				{#if size0 !== undefined && size0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(size0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$provider}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(aiModelProvider)}
					{#if aiModelProvider != null && aiModelProvider[EntityMetaKey.Selector] != null}
						<div>
							<dt>provider</dt>
							<dd>
								<AiModelProviderView
									selection={select(EntityType.AiModelProvider, aiModelProvider[EntityMetaKey.Selector])}
									prefetched={aiModelProvider}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							providerArtifactId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerArtifactId = pendingEntity.providerArtifactId}
					{#if providerArtifactId !== undefined && providerArtifactId !== null}
						<div>
							<dt>provider artifact ID</dt>
							<dd>
								{String((providerArtifactId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerArtifactId = resolvedEntity.providerArtifactId}
					{#if providerArtifactId !== undefined && providerArtifactId !== null}
						<div>
							<dt>provider artifact ID</dt>
							<dd>
								{String((providerArtifactId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							digestAlgorithm: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const digestAlgorithm = pendingEntity.digestAlgorithm}
					{#if digestAlgorithm !== undefined && digestAlgorithm !== null}
						<div>
							<dt>digest algorithm</dt>
							<dd>
								<TruncatedValue value={String((digestAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const digestAlgorithm = resolvedEntity.digestAlgorithm}
					{#if digestAlgorithm !== undefined && digestAlgorithm !== null}
						<div>
							<dt>digest algorithm</dt>
							<dd>
								<TruncatedValue value={String((digestAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							digest: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const digest = pendingEntity.digest}
					{#if digest !== undefined && digest !== null}
						<div>
							<dt>digest</dt>
							<dd>
								<TruncatedValue value={String((digest) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const digest = resolvedEntity.digest}
					{#if digest !== undefined && digest !== null}
						<div>
							<dt>digest</dt>
							<dd>
								<TruncatedValue value={String((digest) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ociDigest: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ociDigest = pendingEntity.ociDigest}
					{#if ociDigest !== undefined && ociDigest !== null}
						<div>
							<dt>OCI digest</dt>
							<dd>
								<TruncatedValue value={String((ociDigest) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ociDigest = resolvedEntity.ociDigest}
					{#if ociDigest !== undefined && ociDigest !== null}
						<div>
							<dt>OCI digest</dt>
							<dd>
								<TruncatedValue value={String((ociDigest) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ipfsCid: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ipfsCid = pendingEntity.ipfsCid}
					{#if ipfsCid !== undefined && ipfsCid !== null}
						<div>
							<dt>IPFS CID</dt>
							<dd>
								{String((ipfsCid) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ipfsCid = resolvedEntity.ipfsCid}
					{#if ipfsCid !== undefined && ipfsCid !== null}
						<div>
							<dt>IPFS CID</dt>
							<dd>
								{String((ipfsCid) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							arweaveId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const arweaveId = pendingEntity.arweaveId}
					{#if arweaveId !== undefined && arweaveId !== null}
						<div>
							<dt>Arweave ID</dt>
							<dd>
								{String((arweaveId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const arweaveId = resolvedEntity.arweaveId}
					{#if arweaveId !== undefined && arweaveId !== null}
						<div>
							<dt>Arweave ID</dt>
							<dd>
								{String((arweaveId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gitObject: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gitObject = pendingEntity.gitObject}
					{#if gitObject !== undefined && gitObject !== null}
						<div>
							<dt>Git object</dt>
							<dd>
								{String((gitObject) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gitObject = resolvedEntity.gitObject}
					{#if gitObject !== undefined && gitObject !== null}
						<div>
							<dt>Git object</dt>
							<dd>
								{String((gitObject) ?? '')}
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
							uri: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const uri = pendingEntity.uri}
					{#if uri !== undefined && uri !== null}
						<div>
							<dt>URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(uri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(uri)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const uri = resolvedEntity.uri}
					{#if uri !== undefined && uri !== null}
						<div>
							<dt>URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(uri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(uri)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mediaType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const mediaType = pendingEntity.mediaType}
					{#if mediaType !== undefined && mediaType !== null}
						<div>
							<dt>media type</dt>
							<dd>
								{String((mediaType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mediaType = resolvedEntity.mediaType}
					{#if mediaType !== undefined && mediaType !== null}
						<div>
							<dt>media type</dt>
							<dd>
								{String((mediaType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							artifactType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const artifactType = pendingEntity.artifactType}
					{#if artifactType !== undefined && artifactType !== null}
						<div>
							<dt>artifact type</dt>
							<dd>
								{String((artifactType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const artifactType = resolvedEntity.artifactType}
					{#if artifactType !== undefined && artifactType !== null}
						<div>
							<dt>artifact type</dt>
							<dd>
								{String((artifactType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							size: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const size = pendingEntity.size}
					{#if size !== undefined && size !== null}
						<div>
							<dt>size</dt>
							<dd>
								<NumberValue value={Number(size)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const size = resolvedEntity.size}
					{#if size !== undefined && size !== null}
						<div>
							<dt>size</dt>
							<dd>
								<NumberValue value={Number(size)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AiDocumentsView
				selection={
						selection.$$documents({
							count: true,
						})
					}
				title='documents'
				emptyText='No linked documents.'
				id='AiDocumentsView-documents'
			/>

			<AiArtifactAttestationsView
				selection={
						selection.$$attestations({
							count: true,
						})
					}
				title='attestations'
				emptyText='No AI artifact attestations.'
				id='AiArtifactAttestationsView-attestations'
			/>
		{/if}
	{/snippet}
</EntityView>
