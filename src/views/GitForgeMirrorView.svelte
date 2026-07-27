<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.GitForgeMirror> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = $derived([(pendingEntity.owner ?? ''), (pendingEntity.repositoryName ?? '')].filter(Boolean).join(' ') || 'Git forge mirror')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
</script>


<EntityView
	entityType={EntityType.GitForgeMirror}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{[(pendingEntity.owner ?? ''), (pendingEntity.repositoryName ?? '')].filter(Boolean).join(' ') || 'Git forge mirror'}
	{/snippet}

	{#snippet Value()}
		{(pendingEntity.forgeHost ?? '') || [(pendingEntity.owner ?? ''), (pendingEntity.repositoryName ?? '')].filter(Boolean).join(' ') || titleFallback}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>forge host</dt>
				<dd>
					{pendingEntity.forgeHost}
				</dd>
			</div>

			<div>
				<dt>owner</dt>
				<dd>
					{pendingEntity.owner}
				</dd>
			</div>

			<div>
				<dt>repository name</dt>
				<dd>
					{pendingEntity.repositoryName}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$gitRepository}
			>
				{#snippet children(gitRepository)}
					{#if gitRepository != null}
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
				{#snippet children(entity)}
					{@const defaultBranch = entity.defaultBranch}
					{#if defaultBranch != null}
						<div>
							<dt>default branch</dt>
							<dd>
								{defaultBranch}
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
				{#snippet children(entity)}
					{@const visibility = entity.visibility}
					{#if visibility != null}
						<div>
							<dt>visibility</dt>
							<dd>
								{visibility}
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
				{#snippet children(entity)}
					{@const htmlUrl = entity.htmlUrl}
					{#if htmlUrl != null}
						<div>
							<dt>HTML URL</dt>
							<dd>
								<a
									href={String(htmlUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(htmlUrl)} />
								</a>
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
				{#snippet children(entity)}
					{@const providerRepositoryId = entity.providerRepositoryId}
					{#if providerRepositoryId != null}
						<div>
							<dt>provider repository ID</dt>
							<dd>
								{providerRepositoryId}
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
				{#snippet children(entity)}
					{@const source = entity.source}
					{#if source != null}
						<div>
							<dt>Source</dt>
							<dd>
								{source}
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
						{#snippet children(entity)}
							<a
								href={String(entity.cloneUrls)}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={String(entity.cloneUrls)} />
							</a>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
