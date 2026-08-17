<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.GitForgeReleaseLink> = $props()

	const release = $derived(selection.entitySelector.$release)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Gitlab_Rest,
		],
	}))
	const gitForgeReleaseLink = $derived(viewSelection({
		fields: {
			name: true,
			linkType: true,
		},
	}))
	const titleFallback = $derived((prefetched.name ?? '') || 'Git forge release link')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitForgeReleaseView from '$/views/GitForgeReleaseView.svelte'
</script>


<EntityView
	entityType={EntityType.GitForgeReleaseLink}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/release/[releaseTagName=stringSegment]/(gitForgeRelease)/asset/[linkId=nonNegativeInteger]',
				{
					forgeHost: release.$forgeMirror.forgeHost,
					owner: release.$forgeMirror.owner,
					repositoryName: release.$forgeMirror.repositoryName,
					releaseTagName: release.releaseTagName,
					linkId: String(selection.entitySelector.linkId),
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
		<ResourceBoundary resource={gitForgeReleaseLink}>
			{#snippet children(entity)}
				{entity.name || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitForgeReleaseLink}>
			{#snippet children(entity)}
				{(entity.linkType ?? '') || entity.name || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>release</dt>
				<dd>
					<GitForgeReleaseView
						selection={select(EntityType.GitForgeRelease, selection.entitySelector.$release)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>link ID</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.linkId}
					/>
				</dd>
			</div>

			<div>
				<dt>name</dt>
				<dd>
					<ResourceBoundary
						resource={gitForgeReleaseLink}
					>
						{#snippet children(entity)}
							{entity.name}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									url: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<a
								href={entity.url}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={entity.url} />
							</a>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={gitForgeReleaseLink}
			>
				{#snippet children(entity)}
					{@const linkType = entity.linkType}
					{#if linkType != null}
						<div>
							<dt>link type</dt>
							<dd>
								{linkType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							directAssetUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const directAssetUrl = entity.directAssetUrl}
					{#if directAssetUrl != null}
						<div>
							<dt>direct asset URL</dt>
							<dd>
								<a
									href={directAssetUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={directAssetUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
