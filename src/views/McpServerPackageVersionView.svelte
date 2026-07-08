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
	import { UrlString } from '$/schema/UrlString.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.McpServerPackageVersion>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.McpServerPackageVersion>>
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
	const mcpServerPackageVersion = $derived(selection({
		sources: [
			Source.McpPackageRegistry_Rest,
		],
		fields: {
			registryStatus: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.version) ?? '')].filter(Boolean).join(' ') || 'mcp server package version')
	const viewDomId = $derived('mcp-server-package-version-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import McpServerPackageView from '$/views/McpServerPackageView.svelte'
	import AiArtifactView from '$/views/AiArtifactView.svelte'
</script>


<EntityView
	entityType={EntityType.McpServerPackageVersion}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={mcpServerPackageVersion}>
			{#snippet Pending()}
				{[String((prefetched.version) ?? '')].filter(Boolean).join(' ') || title || 'mcp server package version'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.version) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={mcpServerPackageVersion}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection.$package}
				>
					{#snippet children(mcpServerPackage)}
						{#if mcpServerPackage != null && mcpServerPackage[EntityMetaKey.Selector] != null}
							<McpServerPackageView
								selection={select(EntityType.McpServerPackage, mcpServerPackage[EntityMetaKey.Selector])}
								prefetched={mcpServerPackage}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection.$package}
				>
					{#snippet children(mcpServerPackage)}
						{#if mcpServerPackage != null && mcpServerPackage[EntityMetaKey.Selector] != null}
							<McpServerPackageView
								selection={select(EntityType.McpServerPackage, mcpServerPackage[EntityMetaKey.Selector])}
								prefetched={mcpServerPackage}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={mcpServerPackageVersion}>
			{#snippet Pending()}
				{@const registryStatus0 = prefetched.registryStatus}
				{#if registryStatus0 !== undefined && registryStatus0 !== null}
					<span data-text="muted">
						{String((registryStatus0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const registryStatus0 = resolvedEntity.registryStatus}
				{#if registryStatus0 !== undefined && registryStatus0 !== null}
					<span data-text="muted">
						{String((registryStatus0) ?? '')}
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
					{#if mcpServerPackage != null && mcpServerPackage[EntityMetaKey.Selector] != null}
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
				resource={
					selection({
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const version = prefetched.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const version = resolvedEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$artifact}
			>
				{#snippet children(aiArtifact)}
					{#if aiArtifact != null && aiArtifact[EntityMetaKey.Selector] != null}
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
				resource={
					selection({
						fields: {
							registryStatus: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const registryStatus = prefetched.registryStatus}
					{#if registryStatus !== undefined && registryStatus !== null}
						<div>
							<dt>registry status</dt>
							<dd>
								{String((registryStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const registryStatus = resolvedEntity.registryStatus}
					{#if registryStatus !== undefined && registryStatus !== null}
						<div>
							<dt>registry status</dt>
							<dd>
								{String((registryStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isLatest: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isLatest = prefetched.isLatest}
					{#if isLatest !== undefined && isLatest !== null}
						<div>
							<dt>is latest</dt>
							<dd>
								{isLatest ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isLatest = resolvedEntity.isLatest}
					{#if isLatest !== undefined && isLatest !== null}
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
					selection({
						fields: {
							releaseDate: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const releaseDate = prefetched.releaseDate}
					{#if releaseDate !== undefined && releaseDate !== null}
						<div>
							<dt>release date</dt>
							<dd>
								<Timestamp timestamp={Number(releaseDate)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const releaseDate = resolvedEntity.releaseDate}
					{#if releaseDate !== undefined && releaseDate !== null}
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
					selection({
						fields: {
							publishedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const publishedAt = prefetched.publishedAt}
					{#if publishedAt !== undefined && publishedAt !== null}
						<div>
							<dt>published AT</dt>
							<dd>
								<Timestamp timestamp={Number(publishedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const publishedAt = resolvedEntity.publishedAt}
					{#if publishedAt !== undefined && publishedAt !== null}
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
					selection({
						fields: {
							packageRegistryType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const packageRegistryType = prefetched.packageRegistryType}
					{#if packageRegistryType !== undefined && packageRegistryType !== null}
						<div>
							<dt>package registry type</dt>
							<dd>
								{String((packageRegistryType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const packageRegistryType = resolvedEntity.packageRegistryType}
					{#if packageRegistryType !== undefined && packageRegistryType !== null}
						<div>
							<dt>package registry type</dt>
							<dd>
								{String((packageRegistryType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							packageRegistryBaseUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const packageRegistryBaseUrl = prefetched.packageRegistryBaseUrl}
					{#if packageRegistryBaseUrl !== undefined && packageRegistryBaseUrl !== null}
						<div>
							<dt>package registry base URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(packageRegistryBaseUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(packageRegistryBaseUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const packageRegistryBaseUrl = resolvedEntity.packageRegistryBaseUrl}
					{#if packageRegistryBaseUrl !== undefined && packageRegistryBaseUrl !== null}
						<div>
							<dt>package registry base URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(packageRegistryBaseUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(packageRegistryBaseUrl)} />
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
							packageIdentifier: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const packageIdentifier = prefetched.packageIdentifier}
					{#if packageIdentifier !== undefined && packageIdentifier !== null}
						<div>
							<dt>package identifier</dt>
							<dd>
								{String((packageIdentifier) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const packageIdentifier = resolvedEntity.packageIdentifier}
					{#if packageIdentifier !== undefined && packageIdentifier !== null}
						<div>
							<dt>package identifier</dt>
							<dd>
								{String((packageIdentifier) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							runtimeHint: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const runtimeHint = prefetched.runtimeHint}
					{#if runtimeHint !== undefined && runtimeHint !== null}
						<div>
							<dt>runtime hint</dt>
							<dd>
								{String((runtimeHint) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const runtimeHint = resolvedEntity.runtimeHint}
					{#if runtimeHint !== undefined && runtimeHint !== null}
						<div>
							<dt>runtime hint</dt>
							<dd>
								{String((runtimeHint) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transportKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transportKind = prefetched.transportKind}
					{#if transportKind !== undefined && transportKind !== null}
						<div>
							<dt>transport kind</dt>
							<dd>
								{String((transportKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transportKind = resolvedEntity.transportKind}
					{#if transportKind !== undefined && transportKind !== null}
						<div>
							<dt>transport kind</dt>
							<dd>
								{String((transportKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
