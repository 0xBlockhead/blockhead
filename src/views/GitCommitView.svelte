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
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.GitCommit>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.GitCommit>>
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
	const gitCommit = $derived(selection({
		fields: {
			message: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.objectId) ?? '')].filter(Boolean).join(' ') || 'Git commit')
	const viewDomId = $derived('git-commit-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitSignaturesView from '$/views/GitSignaturesView.svelte'
	import GitObjectView from '$/views/GitObjectView.svelte'
</script>


<EntityView
	entityType={EntityType.GitCommit}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={gitCommit}>
			{#snippet Pending()}
				{@const objectId0 = pendingEntity.objectId}
				{#if objectId0 !== undefined && objectId0 !== null}
					<TruncatedValue value={String((objectId0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const objectId0 = resolvedEntity.objectId}
				{#if objectId0 !== undefined && objectId0 !== null}
					<TruncatedValue value={String((objectId0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitCommit}>
			{#snippet Pending()}
				{[String((pendingEntity.message) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.objectId) ?? '')].filter(Boolean).join(' ') || title || 'Git commit'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.message) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.objectId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={gitCommit}>
			{#snippet Pending()}
				{@const objectFormat0 = pendingEntity.objectFormat}
				{#if objectFormat0 !== undefined && objectFormat0 !== null}
					<span data-text="muted">
						{String((objectFormat0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const objectFormat0 = resolvedEntity.objectFormat}
				{#if objectFormat0 !== undefined && objectFormat0 !== null}
					<span data-text="muted">
						{String((objectFormat0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>object ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									objectId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const objectId = pendingEntity.objectId}
							{#if objectId !== undefined && objectId !== null}
								<TruncatedValue value={String((objectId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const objectId = resolvedEntity.objectId}
							{#if objectId !== undefined && objectId !== null}
								<TruncatedValue value={String((objectId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>object format</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									objectFormat: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const objectFormat = pendingEntity.objectFormat}
							{#if objectFormat !== undefined && objectFormat !== null}
								{String((objectFormat) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const objectFormat = resolvedEntity.objectFormat}
							{#if objectFormat !== undefined && objectFormat !== null}
								{String((objectFormat) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
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
						{#snippet Pending()}
							{@const treeObjectId = pendingEntity.treeObjectId}
							{#if treeObjectId !== undefined && treeObjectId !== null}
								<TruncatedValue value={String((treeObjectId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const treeObjectId = resolvedEntity.treeObjectId}
							{#if treeObjectId !== undefined && treeObjectId !== null}
								<TruncatedValue value={String((treeObjectId) ?? '')} />
							{/if}
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
							{#if gitObject != null && gitObject[EntityMetaKey.Selector] != null}
								<GitObjectView
									selection={select(EntityType.GitObject, gitObject[EntityMetaKey.Selector])}
									prefetched={gitObject}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
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
				{#snippet Pending()}
					{@const authorName = pendingEntity.authorName}
					{#if authorName !== undefined && authorName !== null}
						<div>
							<dt>author name</dt>
							<dd>
								{String((authorName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const authorName = resolvedEntity.authorName}
					{#if authorName !== undefined && authorName !== null}
						<div>
							<dt>author name</dt>
							<dd>
								{String((authorName) ?? '')}
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
				{#snippet Pending()}
					{@const authorEmail = pendingEntity.authorEmail}
					{#if authorEmail !== undefined && authorEmail !== null}
						<div>
							<dt>author email</dt>
							<dd>
								{String((authorEmail) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const authorEmail = resolvedEntity.authorEmail}
					{#if authorEmail !== undefined && authorEmail !== null}
						<div>
							<dt>author email</dt>
							<dd>
								{String((authorEmail) ?? '')}
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
				{#snippet Pending()}
					{@const authorTimestampMs = pendingEntity.authorTimestampMs}
					{#if authorTimestampMs !== undefined && authorTimestampMs !== null}
						<div>
							<dt>author timestamp ms</dt>
							<dd>
								<Timestamp timestamp={Number(authorTimestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const authorTimestampMs = resolvedEntity.authorTimestampMs}
					{#if authorTimestampMs !== undefined && authorTimestampMs !== null}
						<div>
							<dt>author timestamp ms</dt>
							<dd>
								<Timestamp timestamp={Number(authorTimestampMs)} />
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
				{#snippet Pending()}
					{@const committerName = pendingEntity.committerName}
					{#if committerName !== undefined && committerName !== null}
						<div>
							<dt>committer name</dt>
							<dd>
								{String((committerName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const committerName = resolvedEntity.committerName}
					{#if committerName !== undefined && committerName !== null}
						<div>
							<dt>committer name</dt>
							<dd>
								{String((committerName) ?? '')}
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
				{#snippet Pending()}
					{@const committerEmail = pendingEntity.committerEmail}
					{#if committerEmail !== undefined && committerEmail !== null}
						<div>
							<dt>committer email</dt>
							<dd>
								{String((committerEmail) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const committerEmail = resolvedEntity.committerEmail}
					{#if committerEmail !== undefined && committerEmail !== null}
						<div>
							<dt>committer email</dt>
							<dd>
								{String((committerEmail) ?? '')}
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
				{#snippet Pending()}
					{@const committerTimestampMs = pendingEntity.committerTimestampMs}
					{#if committerTimestampMs !== undefined && committerTimestampMs !== null}
						<div>
							<dt>committer timestamp ms</dt>
							<dd>
								<Timestamp timestamp={Number(committerTimestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const committerTimestampMs = resolvedEntity.committerTimestampMs}
					{#if committerTimestampMs !== undefined && committerTimestampMs !== null}
						<div>
							<dt>committer timestamp ms</dt>
							<dd>
								<Timestamp timestamp={Number(committerTimestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					fields: {
						message: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const message = resolvedEntity.message}
				{#if message !== undefined && message !== null && message !== ''}
					<p data-text="long-text">{String((message) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<GitSignaturesView
				selection={selection.$$signatures}
				title='signatures'
				emptyText='No signatures.'
				id='GitSignaturesView-signatures'
			/>
		{/if}
	{/snippet}
</EntityView>
