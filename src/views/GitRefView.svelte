<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
			selection: RegisteredEntityProxyResource<EntityType.GitRef>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.GitRef>
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
	const gitRef = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			refKind: true,
			targetObjectId: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			refKind: true,
			targetObjectId: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.refName) ?? '')].filter(Boolean).join(' ') || 'Git ref')
	const viewDomId = $derived('git-ref-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'refKind') && Object.hasOwn(prefetched, 'targetObjectId')}
			{[String((pendingEntity.refName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={gitRef}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.refName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'refKind') && Object.hasOwn(prefetched, 'targetObjectId')}
			{[String((pendingEntity.refKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.refName) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={gitRef}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.refKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.refName) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'refKind') && Object.hasOwn(prefetched, 'targetObjectId')}
			{@const targetObjectId0 = pendingEntity.targetObjectId}
			{#if targetObjectId0 !== undefined && targetObjectId0 !== null}
				<span data-text="muted">
					<TruncatedValue value={String((targetObjectId0) ?? '')} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={gitRef}>
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
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>repository</dt>
				<dd>
					<GitRepositoryView
						selection={select(EntityType.GitRepository, selection.entitySelector.$repository)}
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
								sources: selection.sources,
								fields: {
									refName: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									refKind: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							targetObjectId: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							symbolicTarget: true,
						},
					})
				}
			>
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
		{@const gitRefGitRefObservationTimestampsViewObservationsResource = selection.$$observations}
		<ResourceBoundary
			resource={gitRefGitRefObservationTimestampsViewObservationsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<GitRefObservation_TimestampsView
					selection={gitRefGitRefObservationTimestampsViewObservationsResource}
					countResource={gitRefGitRefObservationTimestampsViewObservationsResource.count}
					title='observations'
					id='GitRefObservation_TimestampsView-observations'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
