<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AiArtifact> = $props()

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
	const titleFallback = $derived((prefetched.artifactType ?? '') || [(prefetched.providerArtifactId ?? ''), (prefetched.ociDigest ?? ''), (prefetched.ipfsCid ?? ''), (prefetched.arweaveId ?? ''), (prefetched.gitObject ?? ''), (prefetched.digest ?? '')].filter(Boolean).join(' ') || 'AI artifact')


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
	href={
		href === undefined ?
			(
				'providerArtifactId' in selection.entitySelector
				&& '$provider' in selection.entitySelector
				&& 'providerId' in selection.entitySelector.$provider ?
					resolve(
						'/(ai)/ai/provider/id/[providerId=stringSegment]/(aiModelProvider)/artifact/[providerArtifactId=stringSegment]',
						{
							providerId: selection.entitySelector.$provider.providerId,
							providerArtifactId: selection.entitySelector.providerArtifactId,
						}
					)
				:
					'digestAlgorithm' in selection.entitySelector
					&& 'digest' in selection.entitySelector ?
						resolve(
							'/(ai)/ai/artifact/digest/[digestAlgorithm=stringSegment]/[digest=zeroExHex]',
							{
								digestAlgorithm: selection.entitySelector.digestAlgorithm,
								digest: selection.entitySelector.digest,
							}
						)
					:
						'ociDigest' in selection.entitySelector ?
							resolve(
								'/(ai)/ai/artifact/oci/[ociDigest=stringSegment]',
								{
									ociDigest: selection.entitySelector.ociDigest,
								}
							)
						:
							'ipfsCid' in selection.entitySelector ?
								resolve(
									'/(ai)/ai/artifact/ipfs/[ipfsCid=stringSegment]',
									{
										ipfsCid: selection.entitySelector.ipfsCid,
									}
								)
							:
								'arweaveId' in selection.entitySelector ?
									resolve(
										'/(ai)/ai/artifact/arweave/[arweaveId=stringSegment]',
										{
											arweaveId: selection.entitySelector.arweaveId,
										}
									)
								:
									'gitObject' in selection.entitySelector ?
										resolve(
											'/(ai)/ai/artifact/git/[gitObject=stringSegment]',
											{
												gitObject: selection.entitySelector.gitObject,
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
				{@const size = entity.size}
				{#if size != null}
					<span data-text="muted">
						<NumberValue
							value={size}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$provider}
			>
				{#snippet children(aiModelProvider)}
					{#if aiModelProvider != null}
						{@const aiModelProviderInitial = untrack(() => aiModelProvider)}
						<div>
							<dt>provider</dt>
							<dd>
								<AiModelProviderView
									selection={select(EntityType.AiModelProvider, (aiModelProvider ?? aiModelProviderInitial)[EntityMetaKey.Selector])}
									prefetched={aiModelProvider ?? aiModelProviderInitial}
									layout={EntityLayout.Value}
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
								{digestAlgorithm}
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
								<TruncatedValue value={digest} />
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
									href={uri}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={uri} />
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

	{#snippet Details()}
		{@const documentsResource = selection.$$documents}
		<ResourceBoundary
			resource={documentsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AiDocumentsView
						selection={documentsResource}
						countResource={documentsResource.count}
						title='documents'
						id='documents'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const attestationsResource = selection.$$attestations}
		<ResourceBoundary
			resource={attestationsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AiArtifactAttestationsView
						selection={attestationsResource}
						countResource={attestationsResource.count}
						title='attestations'
						id='attestations'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
