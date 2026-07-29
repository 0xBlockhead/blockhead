<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.RadicleDiscussionComment> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import GitObjectView from '$/views/GitObjectView.svelte'
</script>


<EntityView
	entityType={EntityType.RadicleDiscussionComment}
	entitySelector={selection.entitySelector}
	title={title ?? 'radicle discussion comment'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		radicle discussion comment
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>comment ID</dt>
				<dd>
					{selection.entitySelector.commentId}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							authorDid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const authorDid = entity.authorDid}
					{#if authorDid != null}
						<div>
							<dt>author DID</dt>
							<dd>
								{authorDid}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							body: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const body = entity.body}
					{#if body != null}
						<div>
							<dt>body</dt>
							<dd>
								{body}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bodyObjectId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const bodyObjectId = entity.bodyObjectId}
					{#if bodyObjectId != null}
						<div>
							<dt>body object ID</dt>
							<dd>
								{bodyObjectId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
								{createdAt}
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
								{updatedAt}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							replyToCommentId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const replyToCommentId = entity.replyToCommentId}
					{#if replyToCommentId != null}
						<div>
							<dt>reply to comment ID</dt>
							<dd>
								{replyToCommentId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$payloadObject}
			>
				{#snippet children(gitObject)}
					{#if gitObject != null}
						<div>
							<dt>payload object</dt>
							<dd>
								<GitObjectView
									selection={select(EntityType.GitObject, gitObject[EntityMetaKey.Selector])}
									prefetched={gitObject}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
