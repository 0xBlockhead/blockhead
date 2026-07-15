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
			selection: RegisteredEntityProxyResource<EntityType.GitForgeMirror>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.GitForgeMirror>>
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
	const gitForgeMirror = $derived(selection({}))
	const titleFallback = $derived([String((pendingEntity.owner) ?? ''), String((pendingEntity.repositoryName) ?? '')].filter(Boolean).join(' ') || 'Git forge mirror')
	const viewDomId = $derived('git-forge-mirror-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
</script>


<EntityView
	entityType={EntityType.GitForgeMirror}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={gitForgeMirror}>
			{#snippet Pending()}
				{[String((pendingEntity.owner) ?? ''), String((pendingEntity.repositoryName) ?? '')].filter(Boolean).join(' ') || title || 'Git forge mirror'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.owner) ?? ''), String((resolvedEntity.repositoryName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitForgeMirror}>
			{#snippet Pending()}
				{[String((pendingEntity.forgeHost) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.owner) ?? ''), String((pendingEntity.repositoryName) ?? '')].filter(Boolean).join(' ') || title || 'Git forge mirror'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.forgeHost) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.owner) ?? ''), String((resolvedEntity.repositoryName) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>forge host</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									forgeHost: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const forgeHost = pendingEntity.forgeHost}
							{#if forgeHost !== undefined && forgeHost !== null}
								{String((forgeHost) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const forgeHost = resolvedEntity.forgeHost}
							{#if forgeHost !== undefined && forgeHost !== null}
								{String((forgeHost) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>owner</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									owner: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const owner = pendingEntity.owner}
							{#if owner !== undefined && owner !== null}
								{String((owner) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const owner = resolvedEntity.owner}
							{#if owner !== undefined && owner !== null}
								{String((owner) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>repository name</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									repositoryName: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const repositoryName = pendingEntity.repositoryName}
							{#if repositoryName !== undefined && repositoryName !== null}
								{String((repositoryName) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const repositoryName = resolvedEntity.repositoryName}
							{#if repositoryName !== undefined && repositoryName !== null}
								{String((repositoryName) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$gitRepository}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(gitRepository)}
					{#if gitRepository != null && gitRepository[EntityMetaKey.Selector] != null}
						<div>
							<dt>Git repository</dt>
							<dd>
								<GitRepositoryView
									selection={select(EntityType.GitRepository, gitRepository[EntityMetaKey.Selector])}
									prefetched={gitRepository}
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
							defaultBranch: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const defaultBranch = pendingEntity.defaultBranch}
					{#if defaultBranch !== undefined && defaultBranch !== null}
						<div>
							<dt>default branch</dt>
							<dd>
								{String((defaultBranch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const defaultBranch = resolvedEntity.defaultBranch}
					{#if defaultBranch !== undefined && defaultBranch !== null}
						<div>
							<dt>default branch</dt>
							<dd>
								{String((defaultBranch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							visibility: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const visibility = pendingEntity.visibility}
					{#if visibility !== undefined && visibility !== null}
						<div>
							<dt>visibility</dt>
							<dd>
								{String((visibility) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const visibility = resolvedEntity.visibility}
					{#if visibility !== undefined && visibility !== null}
						<div>
							<dt>visibility</dt>
							<dd>
								{String((visibility) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							htmlUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const htmlUrl = pendingEntity.htmlUrl}
					{#if htmlUrl !== undefined && htmlUrl !== null}
						<div>
							<dt>HTML URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(htmlUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(htmlUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const htmlUrl = resolvedEntity.htmlUrl}
					{#if htmlUrl !== undefined && htmlUrl !== null}
						<div>
							<dt>HTML URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(htmlUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(htmlUrl)} />
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
							providerRepositoryId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerRepositoryId = pendingEntity.providerRepositoryId}
					{#if providerRepositoryId !== undefined && providerRepositoryId !== null}
						<div>
							<dt>provider repository ID</dt>
							<dd>
								{String((providerRepositoryId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerRepositoryId = resolvedEntity.providerRepositoryId}
					{#if providerRepositoryId !== undefined && providerRepositoryId !== null}
						<div>
							<dt>provider repository ID</dt>
							<dd>
								{String((providerRepositoryId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							source: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const source = pendingEntity.source}
					{#if source !== undefined && source !== null}
						<div>
							<dt>Source</dt>
							<dd>
								{String((source) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const source = resolvedEntity.source}
					{#if source !== undefined && source !== null}
						<div>
							<dt>Source</dt>
							<dd>
								{String((source) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>clone urls</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									cloneUrls: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const cloneUrls = pendingEntity.cloneUrls}
							{#if cloneUrls !== undefined && cloneUrls !== null}
								<svelte:element
									this={'a'}
									href={String(cloneUrls)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(cloneUrls)} />
								</svelte:element>
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const cloneUrls = resolvedEntity.cloneUrls}
							{#if cloneUrls !== undefined && cloneUrls !== null}
								<svelte:element
									this={'a'}
									href={String(cloneUrls)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(cloneUrls)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
