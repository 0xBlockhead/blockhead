<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.GitCommit>, 'prefetched'> = $props()

	const gitCommit = $derived(selection({
		fields: {
			message: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.objectId || 'Git commit')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitSignaturesView from '$/views/GitSignaturesView.svelte'
	import GitObjectView from '$/views/GitObjectView.svelte'
</script>


<EntityView
	entityType={EntityType.GitCommit}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/git/commit/[objectId=zeroExHex]/[objectFormat=stringSegment]',
				{
					objectId: selection.entitySelector.objectId,
					objectFormat: selection.entitySelector.objectFormat,
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
		<TruncatedValue value={selection.entitySelector.objectId} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitCommit}>
			{#snippet children(entity)}
				{(entity.message ?? '') || selection.entitySelector.objectId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.objectFormat}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>object ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.objectId} />
				</dd>
			</div>

			<div>
				<dt>object format</dt>
				<dd>
					{selection.entitySelector.objectFormat}
				</dd>
			</div>

			<div>
				<dt>tree object ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									treeObjectId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.treeObjectId} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>object</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$object}
					>
						{#snippet children(gitObject)}
							<GitObjectView
								selection={select(EntityType.GitObject, gitObject[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							authorName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const authorName = entity.authorName}
					{#if authorName != null}
						<div>
							<dt>author name</dt>
							<dd>
								{authorName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							authorEmail: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const authorEmail = entity.authorEmail}
					{#if authorEmail != null}
						<div>
							<dt>author email</dt>
							<dd>
								{authorEmail}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							authorTimestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const authorTimestampMs = entity.authorTimestampMs}
					{#if authorTimestampMs != null}
						<div>
							<dt>author timestamp ms</dt>
							<dd>
								<Timestamp timestamp={authorTimestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							committerName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const committerName = entity.committerName}
					{#if committerName != null}
						<div>
							<dt>committer name</dt>
							<dd>
								{committerName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							committerEmail: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const committerEmail = entity.committerEmail}
					{#if committerEmail != null}
						<div>
							<dt>committer email</dt>
							<dd>
								{committerEmail}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							committerTimestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const committerTimestampMs = entity.committerTimestampMs}
					{#if committerTimestampMs != null}
						<div>
							<dt>committer timestamp ms</dt>
							<dd>
								<Timestamp timestamp={committerTimestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={gitCommit}
		>
			{#snippet children(entity)}
				{@const message = entity.message}
				{#if message != null && message !== ''}
					<p data-text="long-text">{message}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		{@const signaturesResource = selection.$$signatures}
		<ResourceBoundary
			resource={signaturesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<GitSignaturesView
						selection={signaturesResource}
						countResource={signaturesResource.count}
						title='signatures'
						id='signatures'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
