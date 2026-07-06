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
			selection: EntityProxyResource<typeof schema, EntityType.GitForgePullRequest>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.GitForgePullRequest>>
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
	const gitForgePullRequest = $derived(selection({
		fields: {
			title: true,
			state: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.title) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.pullRequestNumber ?? prefetched.pullRequestNumber) ?? '')].filter(Boolean).join(' ') || 'Git forge pull request')
	const viewDomId = $derived('git-forge-pull-request-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitForgeMirrorView from '$/views/GitForgeMirrorView.svelte'
</script>


<EntityView
	entityType={EntityType.GitForgePullRequest}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={gitForgePullRequest}>
			{#snippet Pending()}
				{[String((prefetched.title) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.pullRequestNumber ?? prefetched.pullRequestNumber) ?? '')].filter(Boolean).join(' ') || 'Git forge pull request'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.title) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitForgePullRequest}>
			{#snippet Pending()}
				{[String((prefetched.state) ?? '')].filter(Boolean).join(' ') || [String((prefetched.title) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.pullRequestNumber ?? prefetched.pullRequestNumber) ?? '')].filter(Boolean).join(' ') || 'Git forge pull request'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.state) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.title) ?? '')].filter(Boolean).join(' ') || titleFallback}
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									pullRequestNumber: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const pullRequestNumber = selection.entitySelector.pullRequestNumber ?? prefetched.pullRequestNumber}
							{#if pullRequestNumber !== undefined && pullRequestNumber !== null}
								<NumberValue value={Number(pullRequestNumber)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const pullRequestNumber = resolvedEntity.pullRequestNumber}
							{#if pullRequestNumber !== undefined && pullRequestNumber !== null}
								<NumberValue value={Number(pullRequestNumber)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							title: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const title = prefetched.title}
					{#if title !== undefined && title !== null}
						<div>
							<dt>title</dt>
							<dd>
								{String((title) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const title = resolvedEntity.title}
					{#if title !== undefined && title !== null}
						<div>
							<dt>title</dt>
							<dd>
								{String((title) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>state</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									state: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const state = prefetched.state}
							{#if state !== undefined && state !== null}
								{String((state) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const state = resolvedEntity.state}
							{#if state !== undefined && state !== null}
								{String((state) ?? '')}
							{/if}
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
				{#snippet Pending()}
					{@const baseRef = prefetched.baseRef}
					{#if baseRef !== undefined && baseRef !== null}
						<div>
							<dt>base ref</dt>
							<dd>
								{String((baseRef) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const baseRef = resolvedEntity.baseRef}
					{#if baseRef !== undefined && baseRef !== null}
						<div>
							<dt>base ref</dt>
							<dd>
								{String((baseRef) ?? '')}
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
				{#snippet Pending()}
					{@const headRef = prefetched.headRef}
					{#if headRef !== undefined && headRef !== null}
						<div>
							<dt>head ref</dt>
							<dd>
								{String((headRef) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const headRef = resolvedEntity.headRef}
					{#if headRef !== undefined && headRef !== null}
						<div>
							<dt>head ref</dt>
							<dd>
								{String((headRef) ?? '')}
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
				{#snippet Pending()}
					{@const headObjectId = prefetched.headObjectId}
					{#if headObjectId !== undefined && headObjectId !== null}
						<div>
							<dt>head object ID</dt>
							<dd>
								<TruncatedValue value={String((headObjectId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const headObjectId = resolvedEntity.headObjectId}
					{#if headObjectId !== undefined && headObjectId !== null}
						<div>
							<dt>head object ID</dt>
							<dd>
								<TruncatedValue value={String((headObjectId) ?? '')} />
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
				{#snippet Pending()}
					{@const createdAt = prefetched.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAt = resolvedEntity.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
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
				{#snippet Pending()}
					{@const updatedAt = prefetched.updatedAt}
					{#if updatedAt !== undefined && updatedAt !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={Number(updatedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const updatedAt = resolvedEntity.updatedAt}
					{#if updatedAt !== undefined && updatedAt !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={Number(updatedAt)} />
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
				{#snippet Pending()}
					{@const mergedAt = prefetched.mergedAt}
					{#if mergedAt !== undefined && mergedAt !== null}
						<div>
							<dt>merged AT</dt>
							<dd>
								<Timestamp timestamp={Number(mergedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mergedAt = resolvedEntity.mergedAt}
					{#if mergedAt !== undefined && mergedAt !== null}
						<div>
							<dt>merged AT</dt>
							<dd>
								<Timestamp timestamp={Number(mergedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
