<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
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
	}: EntitySelectionViewProps<EntityType.McpServerPackageVersion> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
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
	const titleFallback = $derived((pendingEntity.version ?? '') || 'mcp server package version')


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
					<McpServerPackageView
						selection={select(EntityType.McpServerPackage, mcpServerPackage[EntityMetaKey.Selector])}
						prefetched={mcpServerPackage}
						href=""
						layout={EntityLayout.Value}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={mcpServerPackageVersion}>
			{#snippet children(entity)}
				{@const registryStatus0 = entity.registryStatus}
				{#if registryStatus0 != null}
					<span data-text="muted">
						{registryStatus0}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$package}
			>
				{#snippet children(mcpServerPackage)}
					{#if mcpServerPackage != null}
						<div>
							<dt>package</dt>
							<dd>
								<McpServerPackageView
									selection={select(EntityType.McpServerPackage, mcpServerPackage[EntityMetaKey.Selector])}
									prefetched={mcpServerPackage}
									layout={EntityLayout.Value}
									open={false}
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
						<div>
							<dt>artifact</dt>
							<dd>
								<AiArtifactView
									selection={select(EntityType.AiArtifact, aiArtifact[EntityMetaKey.Selector])}
									prefetched={aiArtifact}
									layout={EntityLayout.Value}
									open={false}
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
								<Timestamp timestamp={Number(releaseDate)} />
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
								<Timestamp timestamp={Number(publishedAt)} />
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
									href={String(packageRegistryBaseUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(packageRegistryBaseUrl)} />
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
