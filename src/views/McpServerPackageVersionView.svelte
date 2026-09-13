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
	}: EntitySelectionViewProps<EntityType.McpServerPackageVersion> = $props()

	const artifact = $derived(selection.entitySelector.$artifact)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.McpPackageRegistry_Rest,
		],
	}))
	const mcpServerPackageVersion = $derived(viewSelection({
		fields: {
			version: true,
			registryStatus: true,
		},
	}))
	const titleFallback = $derived((prefetched.version ?? '') || 'mcp server package version')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import McpServerPackageView from '$/views/McpServerPackageView.svelte'
	import AiArtifactView from '$/views/AiArtifactView.svelte'
</script>


<EntityView
	entityType={EntityType.McpServerPackageVersion}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				artifact !== undefined
				&& artifact.providerArtifactId !== undefined
				&& artifact.$provider !== undefined
				&& artifact.$provider.providerId !== undefined ?
					resolve(
						'/(ai)/ai/provider/id/[providerId=stringSegment]/(aiModelProvider)/artifact/[providerArtifactId=stringSegment]/(aiArtifact)/mcp-package-version',
						{
							providerId: artifact.$provider.providerId,
							providerArtifactId: artifact.providerArtifactId,
						}
					)
				:
					selection.entitySelector.version !== undefined
					&& selection.entitySelector.$package !== undefined
					&& selection.entitySelector.$package.registryServerName !== undefined ?
						resolve(
							'/mcp/package/registry/[registryServerName=stringSegment]/(mcpServerPackage)/version/[version=stringSegment]',
							{
								registryServerName: encodeURIComponent(selection.entitySelector.$package.registryServerName),
								version: selection.entitySelector.version,
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
		<ResourceBoundary resource={mcpServerPackageVersion}>
			{#snippet children(entity)}
				{(entity.version ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$package}
		>
			{#snippet children(mcpServerPackage)}
				{#if mcpServerPackage != null}
					{@const mcpServerPackageInitial = untrack(() => mcpServerPackage)}
					<McpServerPackageView
						selection={select(EntityType.McpServerPackage, (mcpServerPackage ?? mcpServerPackageInitial)[EntityMetaKey.Selector])}
						prefetched={mcpServerPackage ?? mcpServerPackageInitial}
						href={null}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={mcpServerPackageVersion}>
			{#snippet children(entity)}
				{@const registryStatus = entity.registryStatus}
				{#if registryStatus != null}
					<span data-text="muted">
						{registryStatus}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$package}
			>
				{#snippet children(mcpServerPackage)}
					{#if mcpServerPackage != null}
						{@const mcpServerPackageInitial = untrack(() => mcpServerPackage)}
						<div>
							<dt>package</dt>
							<dd>
								<McpServerPackageView
									selection={select(EntityType.McpServerPackage, (mcpServerPackage ?? mcpServerPackageInitial)[EntityMetaKey.Selector])}
									prefetched={mcpServerPackage ?? mcpServerPackageInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={mcpServerPackageVersion}
			>
				{#snippet children(entity)}
					{@const version = entity.version}
					{#if version != null}
						<div>
							<dt>version</dt>
							<dd>
								{version}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$artifact}
			>
				{#snippet children(aiArtifact)}
					{#if aiArtifact != null}
						{@const aiArtifactInitial = untrack(() => aiArtifact)}
						<div>
							<dt>artifact</dt>
							<dd>
								<AiArtifactView
									selection={select(EntityType.AiArtifact, (aiArtifact ?? aiArtifactInitial)[EntityMetaKey.Selector])}
									prefetched={aiArtifact ?? aiArtifactInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={mcpServerPackageVersion}
			>
				{#snippet children(entity)}
					{@const registryStatus = entity.registryStatus}
					{#if registryStatus != null}
						<div>
							<dt>registry status</dt>
							<dd>
								{registryStatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							isLatest: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isLatest = entity.isLatest}
					{#if isLatest != null}
						<div>
							<dt>is latest</dt>
							<dd>
								{isLatest ? 'Yes' : 'No'}
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
							releaseDate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const releaseDate = entity.releaseDate}
					{#if releaseDate != null}
						<div>
							<dt>release date</dt>
							<dd>
								<Timestamp timestamp={releaseDate} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							publishedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const publishedAt = entity.publishedAt}
					{#if publishedAt != null}
						<div>
							<dt>published AT</dt>
							<dd>
								<Timestamp timestamp={publishedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							packageRegistryType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const packageRegistryType = entity.packageRegistryType}
					{#if packageRegistryType != null}
						<div>
							<dt>package registry type</dt>
							<dd>
								{packageRegistryType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							packageRegistryBaseUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const packageRegistryBaseUrl = entity.packageRegistryBaseUrl}
					{#if packageRegistryBaseUrl != null}
						<div>
							<dt>package registry base URL</dt>
							<dd>
								<a
									href={packageRegistryBaseUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={packageRegistryBaseUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							packageIdentifier: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const packageIdentifier = entity.packageIdentifier}
					{#if packageIdentifier != null}
						<div>
							<dt>package identifier</dt>
							<dd>
								{packageIdentifier}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							runtimeHint: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const runtimeHint = entity.runtimeHint}
					{#if runtimeHint != null}
						<div>
							<dt>runtime hint</dt>
							<dd>
								{runtimeHint}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							transportKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transportKind = entity.transportKind}
					{#if transportKind != null}
						<div>
							<dt>transport kind</dt>
							<dd>
								{transportKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
