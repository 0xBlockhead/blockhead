<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.GitTreePathResolution>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.GitTreePathResolution>>
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
	const gitTreePathResolution = $derived(selection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.path) ?? '')].filter(Boolean).join(' ') || 'Git tree path resolution')
	const viewDomId = $derived('git-tree-path-resolution-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
</script>


<EntityView
	entityType={EntityType.GitTreePathResolution}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={gitTreePathResolution}>
			{#snippet Pending()}
				{[String((pendingEntity.path) ?? '')].filter(Boolean).join(' ') || title || 'Git tree path resolution'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.path) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitTreePathResolution}>
			{#snippet Pending()}
				{[String((pendingEntity.status) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.path) ?? '')].filter(Boolean).join(' ') || title || 'Git tree path resolution'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.status) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.path) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={gitTreePathResolution}>
			{#snippet Pending()}
				{@const commitObjectId0 = pendingEntity.commitObjectId}
				{#if commitObjectId0 !== undefined && commitObjectId0 !== null}
					<span data-text="muted">
						<TruncatedValue value={String((commitObjectId0) ?? '')} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const commitObjectId0 = resolvedEntity.commitObjectId}
				{#if commitObjectId0 !== undefined && commitObjectId0 !== null}
					<span data-text="muted">
						<TruncatedValue value={String((commitObjectId0) ?? '')} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>repository</dt>
				<dd>
					<GitRepositoryView
						selection={select(EntityType.GitRepository, selection.entitySelector.$repository, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>commit object ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									commitObjectId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const commitObjectId = pendingEntity.commitObjectId}
							{#if commitObjectId !== undefined && commitObjectId !== null}
								<TruncatedValue value={String((commitObjectId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const commitObjectId = resolvedEntity.commitObjectId}
							{#if commitObjectId !== undefined && commitObjectId !== null}
								<TruncatedValue value={String((commitObjectId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>path</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									path: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const path = pendingEntity.path}
							{#if path !== undefined && path !== null}
								{String((path) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const path = resolvedEntity.path}
							{#if path !== undefined && path !== null}
								{String((path) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>tree object ids</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									treeObjectIds: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const treeObjectIds = pendingEntity.treeObjectIds}
							{#if treeObjectIds !== undefined && treeObjectIds !== null}
								{treeObjectIds.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const treeObjectIds = resolvedEntity.treeObjectIds}
							{#if treeObjectIds !== undefined && treeObjectIds !== null}
								{treeObjectIds.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blobObjectId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blobObjectId = pendingEntity.blobObjectId}
					{#if blobObjectId !== undefined && blobObjectId !== null}
						<div>
							<dt>blob object ID</dt>
							<dd>
								<TruncatedValue value={String((blobObjectId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blobObjectId = resolvedEntity.blobObjectId}
					{#if blobObjectId !== undefined && blobObjectId !== null}
						<div>
							<dt>blob object ID</dt>
							<dd>
								<TruncatedValue value={String((blobObjectId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							submoduleCommitId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const submoduleCommitId = pendingEntity.submoduleCommitId}
					{#if submoduleCommitId !== undefined && submoduleCommitId !== null}
						<div>
							<dt>submodule commit ID</dt>
							<dd>
								<TruncatedValue value={String((submoduleCommitId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const submoduleCommitId = resolvedEntity.submoduleCommitId}
					{#if submoduleCommitId !== undefined && submoduleCommitId !== null}
						<div>
							<dt>submodule commit ID</dt>
							<dd>
								<TruncatedValue value={String((submoduleCommitId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									status: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const status = pendingEntity.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const status = resolvedEntity.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
