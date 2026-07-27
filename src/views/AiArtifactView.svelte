<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AiArtifact> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.HuggingFaceHub_Rest,
			Source.Ipfs_Rest,
			Source.Mlflow_Rest,
		],
	}))
	const aiArtifact = $derived(viewSelection({
		fields: {
			providerArtifactId: true,
			artifactType: true,
			mediaType: true,
			ociDigest: true,
			ipfsCid: true,
			arweaveId: true,
			gitObject: true,
			digest: true,
			size: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.artifactType ?? '') || [(pendingEntity.providerArtifactId ?? ''), (pendingEntity.ociDigest ?? ''), (pendingEntity.ipfsCid ?? ''), (pendingEntity.arweaveId ?? ''), (pendingEntity.gitObject ?? ''), String(pendingEntity.digest ?? '')].filter(Boolean).join(' ') || 'AI artifact')


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
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aiArtifact}>
			{#snippet children(entity)}
				{(entity.artifactType ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aiArtifact}>
			{#snippet children(entity)}
				{(entity.mediaType ?? '') || (entity.artifactType ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiArtifact}>
			{#snippet children(entity)}
				{@const size0 = entity.size}
				{#if size0 != null}
					<span data-text="muted">
						<NumberValue
							value={size0}
						/>
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
				{#snippet children(aiModelProvider)}
					{#if aiModelProvider != null}
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
				resource={aiArtifact}
			>
				{#snippet children(entity)}
					{@const providerArtifactId = entity.providerArtifactId}
					{#if providerArtifactId != null}
						<div>
							<dt>provider artifact ID</dt>
							<dd>
								{providerArtifactId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							digestAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const digestAlgorithm = entity.digestAlgorithm}
					{#if digestAlgorithm != null}
						<div>
							<dt>digest algorithm</dt>
							<dd>
								<TruncatedValue value={digestAlgorithm} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiArtifact}
			>
				{#snippet children(entity)}
					{@const digest = entity.digest}
					{#if digest != null}
						<div>
							<dt>digest</dt>
							<dd>
								<TruncatedValue value={String(digest)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiArtifact}
			>
				{#snippet children(entity)}
					{@const ociDigest = entity.ociDigest}
					{#if ociDigest != null}
						<div>
							<dt>OCI digest</dt>
							<dd>
								<TruncatedValue value={ociDigest} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiArtifact}
			>
				{#snippet children(entity)}
					{@const ipfsCid = entity.ipfsCid}
					{#if ipfsCid != null}
						<div>
							<dt>IPFS CID</dt>
							<dd>
								{ipfsCid}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiArtifact}
			>
				{#snippet children(entity)}
					{@const arweaveId = entity.arweaveId}
					{#if arweaveId != null}
						<div>
							<dt>Arweave ID</dt>
							<dd>
								{arweaveId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiArtifact}
			>
				{#snippet children(entity)}
					{@const gitObject = entity.gitObject}
					{#if gitObject != null}
						<div>
							<dt>Git object</dt>
							<dd>
								{gitObject}
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
							uri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const uri = entity.uri}
					{#if uri != null}
						<div>
							<dt>URI</dt>
							<dd>
								<a
									href={String(uri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(uri)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiArtifact}
			>
				{#snippet children(entity)}
					{@const mediaType = entity.mediaType}
					{#if mediaType != null}
						<div>
							<dt>media type</dt>
							<dd>
								{mediaType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiArtifact}
			>
				{#snippet children(entity)}
					{@const artifactType = entity.artifactType}
					{#if artifactType != null}
						<div>
							<dt>artifact type</dt>
							<dd>
								{artifactType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiArtifact}
			>
				{#snippet children(entity)}
					{@const size = entity.size}
					{#if size != null}
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
						id='documents'
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
						id='attestations'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
