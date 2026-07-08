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
			selection: EntityProxyResource<typeof schema, EntityType.GitRef>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.GitRef>>
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
	const gitRef = $derived(selection({
		fields: {
			refKind: true,
			targetObjectId: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.refName ?? prefetched.refName) ?? '')].filter(Boolean).join(' ') || 'Git ref')
	const viewDomId = $derived('git-ref-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitRefObservation_TimestampsView from '$/views/GitRefObservation_TimestampsView.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
</script>


<EntityView
	entityType={EntityType.GitRef}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={gitRef}>
			{#snippet Pending()}
				{[String((selection.entitySelector.refName ?? prefetched.refName) ?? '')].filter(Boolean).join(' ') || title || 'Git ref'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.refName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitRef}>
			{#snippet Pending()}
				{[String((prefetched.refKind) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.refName ?? prefetched.refName) ?? '')].filter(Boolean).join(' ') || title || 'Git ref'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.refKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.refName) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={gitRef}>
			{#snippet Pending()}
				{@const targetObjectId0 = prefetched.targetObjectId}
				{#if targetObjectId0 !== undefined && targetObjectId0 !== null}
					<span data-text="muted">
						<TruncatedValue value={String((targetObjectId0) ?? '')} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const targetObjectId0 = resolvedEntity.targetObjectId}
				{#if targetObjectId0 !== undefined && targetObjectId0 !== null}
					<span data-text="muted">
						<TruncatedValue value={String((targetObjectId0) ?? '')} />
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
				<dt>ref name</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									refName: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const refName = selection.entitySelector.refName ?? prefetched.refName}
							{#if refName !== undefined && refName !== null}
								{String((refName) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const refName = resolvedEntity.refName}
							{#if refName !== undefined && refName !== null}
								{String((refName) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>ref kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									refKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const refKind = prefetched.refKind}
							{#if refKind !== undefined && refKind !== null}
								{String((refKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const refKind = resolvedEntity.refKind}
							{#if refKind !== undefined && refKind !== null}
								{String((refKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							targetObjectId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const targetObjectId = prefetched.targetObjectId}
					{#if targetObjectId !== undefined && targetObjectId !== null}
						<div>
							<dt>target object ID</dt>
							<dd>
								<TruncatedValue value={String((targetObjectId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const targetObjectId = resolvedEntity.targetObjectId}
					{#if targetObjectId !== undefined && targetObjectId !== null}
						<div>
							<dt>target object ID</dt>
							<dd>
								<TruncatedValue value={String((targetObjectId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							symbolicTarget: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const symbolicTarget = prefetched.symbolicTarget}
					{#if symbolicTarget !== undefined && symbolicTarget !== null}
						<div>
							<dt>symbolic target</dt>
							<dd>
								{String((symbolicTarget) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const symbolicTarget = resolvedEntity.symbolicTarget}
					{#if symbolicTarget !== undefined && symbolicTarget !== null}
						<div>
							<dt>symbolic target</dt>
							<dd>
								{String((symbolicTarget) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<GitRefObservation_TimestampsView
				selection={selection.$$observations}
				title='observations'
				emptyText='No ref observations.'
				id='GitRefObservation_TimestampsView-observations'
			/>
		{/if}
	{/snippet}
</EntityView>
