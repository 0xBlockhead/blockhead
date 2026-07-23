<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { UrlString } from '$/schema/UrlString.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.AiArtifact>
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
	const aiArtifact = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			artifactType: true,
			mediaType: true,
			size: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			artifactType: true,
			mediaType: true,
			size: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.artifactType) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.providerArtifactId) ?? ''), String((pendingEntity.ociDigest) ?? ''), String((pendingEntity.ipfsCid) ?? ''), String((pendingEntity.arweaveId) ?? ''), String((pendingEntity.gitObject) ?? ''), String((pendingEntity.digest) ?? '')].filter(Boolean).join(' ') || 'AI artifact')
	const viewDomId = $derived('ai-artifact-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'artifactType') && Object.hasOwn(prefetched, 'mediaType') && Object.hasOwn(prefetched, 'providerArtifactId') && Object.hasOwn(prefetched, 'ociDigest') && Object.hasOwn(prefetched, 'ipfsCid') && Object.hasOwn(prefetched, 'arweaveId') && Object.hasOwn(prefetched, 'gitObject') && Object.hasOwn(prefetched, 'digest') && Object.hasOwn(prefetched, 'size')}
			{[String((pendingEntity.artifactType) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={aiArtifact}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.artifactType) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'artifactType') && Object.hasOwn(prefetched, 'mediaType') && Object.hasOwn(prefetched, 'providerArtifactId') && Object.hasOwn(prefetched, 'ociDigest') && Object.hasOwn(prefetched, 'ipfsCid') && Object.hasOwn(prefetched, 'arweaveId') && Object.hasOwn(prefetched, 'gitObject') && Object.hasOwn(prefetched, 'digest') && Object.hasOwn(prefetched, 'size')}
			{[String((pendingEntity.mediaType) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.artifactType) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={aiArtifact}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.mediaType) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.artifactType) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'artifactType') && Object.hasOwn(prefetched, 'mediaType') && Object.hasOwn(prefetched, 'providerArtifactId') && Object.hasOwn(prefetched, 'ociDigest') && Object.hasOwn(prefetched, 'ipfsCid') && Object.hasOwn(prefetched, 'arweaveId') && Object.hasOwn(prefetched, 'gitObject') && Object.hasOwn(prefetched, 'digest') && Object.hasOwn(prefetched, 'size')}
			{@const size0 = pendingEntity.size}
			{#if size0 !== undefined && size0 !== null}
				<span data-text="muted">
					<NumberValue
						value={size0}
					/>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={aiArtifact}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const size0 = resolvedEntity.size}
					{#if size0 !== undefined && size0 !== null}
						<span data-text="muted">
							<NumberValue
								value={size0}
							/>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$provider}
			>
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
						sources: selection.sources,
						fields: {
							providerArtifactId: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							digestAlgorithm: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							digest: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							ociDigest: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							ipfsCid: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							arweaveId: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							gitObject: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							uri: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							mediaType: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							artifactType: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							size: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const size = resolvedEntity.size}
					{#if size !== undefined && size !== null}
						<div>
							<dt>size</dt>
							<dd>
								<NumberValue
									value={size}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const aiArtifactAiDocumentsViewDocumentsResource = selection.$$documents}
		<ResourceBoundary
			resource={aiArtifactAiDocumentsViewDocumentsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<AiDocumentsView
					selection={aiArtifactAiDocumentsViewDocumentsResource}
					countResource={aiArtifactAiDocumentsViewDocumentsResource.count}
					title='documents'
					id='AiDocumentsView-documents'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const aiArtifactAiArtifactAttestationsViewAttestationsResource = selection.$$attestations}
		<ResourceBoundary
			resource={aiArtifactAiArtifactAttestationsViewAttestationsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<AiArtifactAttestationsView
					selection={aiArtifactAiArtifactAttestationsViewAttestationsResource}
					countResource={aiArtifactAiArtifactAttestationsViewAttestationsResource.count}
					title='attestations'
					id='AiArtifactAttestationsView-attestations'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
