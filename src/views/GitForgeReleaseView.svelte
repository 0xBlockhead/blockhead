<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.GitForgeRelease> = $props()

	const forgeMirror = $derived(selection.entitySelector.$forgeMirror)
	const gitForgeRelease = $derived(selection({
		fields: {
			name: true,
		},
	}))
	const titleFallback = $derived((prefetched.name ?? '') || selection.entitySelector.releaseTagName || 'Git forge release')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitForgeReleaseLinksView from '$/views/GitForgeReleaseLinksView.svelte'
	import GitForgeMirrorView from '$/views/GitForgeMirrorView.svelte'
</script>


<EntityView
	entityType={EntityType.GitForgeRelease}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/release/[releaseTagName=stringSegment]',
				{
					forgeHost: forgeMirror.forgeHost,
					owner: forgeMirror.owner,
					repositoryName: forgeMirror.repositoryName,
					releaseTagName: selection.entitySelector.releaseTagName,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={gitForgeRelease}>
			{#snippet children(entity)}
				{(entity.name ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.releaseTagName || (prefetched.name ?? '') || titleFallback}
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>forge mirror</dt>
				<dd>
					<GitForgeMirrorView
						selection={select(EntityType.GitForgeMirror, selection.entitySelector.$forgeMirror)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>release tag name</dt>
				<dd>
					{selection.entitySelector.releaseTagName}
				</dd>
			</div>

			<ResourceBoundary
				resource={gitForgeRelease}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							targetObjectId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const targetObjectId = entity.targetObjectId}
					{#if targetObjectId != null}
						<div>
							<dt>target object ID</dt>
							<dd>
								<TruncatedValue value={targetObjectId} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							draft: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const draft = entity.draft}
					{#if draft != null}
						<div>
							<dt>draft</dt>
							<dd>
								{draft ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							prerelease: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const prerelease = entity.prerelease}
					{#if prerelease != null}
						<div>
							<dt>prerelease</dt>
							<dd>
								{prerelease ? 'Yes' : 'No'}
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
							createdAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const createdAt = entity.createdAt}
					{#if createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={createdAt} />
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
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const linksResource = selection.$$links}
		<ResourceBoundary
			resource={linksResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<GitForgeReleaseLinksView
						selection={linksResource}
						countResource={linksResource.count}
						title='Assets'
						id='links'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
