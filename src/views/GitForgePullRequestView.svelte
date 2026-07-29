<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.GitForgePullRequest> = $props()

	const gitForgePullRequest = $derived(selection({
		fields: {
			title: true,
			state: true,
		},
	}))
	const titleFallback = $derived((prefetched.title ?? '') || String(selection.entitySelector.pullRequestNumber) || 'Git forge pull request')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitForgeMirrorView from '$/views/GitForgeMirrorView.svelte'
</script>


<EntityView
	entityType={EntityType.GitForgePullRequest}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={gitForgePullRequest}>
			{#snippet children(entity)}
				{(entity.title ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitForgePullRequest}>
			{#snippet children(entity)}
				{entity.state || (entity.title ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>forge mirror</dt>
				<dd>
					<GitForgeMirrorView
						selection={select(EntityType.GitForgeMirror, selection.entitySelector.$forgeMirror)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>pull request number</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.pullRequestNumber}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={gitForgePullRequest}
			>
				{#snippet children(entity)}
					{@const title = entity.title}
					{#if title != null}
						<div>
							<dt>title</dt>
							<dd>
								{title}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>state</dt>
				<dd>
					<ResourceBoundary
						resource={gitForgePullRequest}
					>
						{#snippet children(entity)}
							{entity.state}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							baseRef: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const baseRef = entity.baseRef}
					{#if baseRef != null}
						<div>
							<dt>base ref</dt>
							<dd>
								{baseRef}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							headRef: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const headRef = entity.headRef}
					{#if headRef != null}
						<div>
							<dt>head ref</dt>
							<dd>
								{headRef}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							headObjectId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const headObjectId = entity.headObjectId}
					{#if headObjectId != null}
						<div>
							<dt>head object ID</dt>
							<dd>
								<TruncatedValue value={headObjectId} />
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
							updatedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const updatedAt = entity.updatedAt}
					{#if updatedAt != null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={updatedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mergedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const mergedAt = entity.mergedAt}
					{#if mergedAt != null}
						<div>
							<dt>merged AT</dt>
							<dd>
								<Timestamp timestamp={mergedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
