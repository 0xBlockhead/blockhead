<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.RadicleSignedRef>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.RadicleSignedRef>>
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
	const radicleSignedRef = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('radicle signed ref')
	const viewDomId = $derived('radicle-signed-ref-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import RadicleRepositoryView from '$/views/RadicleRepositoryView.svelte'
	import GitRefView from '$/views/GitRefView.svelte'
	import GitRefObservation_TimestampView from '$/views/GitRefObservation_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.RadicleSignedRef}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={radicleSignedRef}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>repository</dt>
				<dd>
					<RadicleRepositoryView
						selection={select(EntityType.RadicleRepository, selection.entitySelector.$repository, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>node ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									nodeId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const nodeId = resolvedEntity.nodeId}
							{#if nodeId !== undefined && nodeId !== null}
								{String((nodeId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
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
				<dt>target object ID</dt>
				<dd>
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
								{String((targetObjectId) ?? '')}
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
							signature: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const signature = resolvedEntity.signature}
					{#if signature !== undefined && signature !== null}
						<div>
							<dt>signature</dt>
							<dd>
								<TruncatedValue value={String((signature) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$gitRef}
			>
				{#snippet children(gitRef)}
					{#if gitRef != null && gitRef[EntityMetaKey.Selector] != null}
						<div>
							<dt>Git ref</dt>
							<dd>
								<GitRefView
									selection={select(EntityType.GitRef, gitRef[EntityMetaKey.Selector])}
									prefetched={gitRef}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$refObservation}
			>
				{#snippet children(gitRefObservationTimestamp)}
					{#if gitRefObservationTimestamp != null && gitRefObservationTimestamp[EntityMetaKey.Selector] != null}
						<div>
							<dt>ref observation</dt>
							<dd>
								<GitRefObservation_TimestampView
									selection={select(EntityType.GitRefObservation_Timestamp, gitRefObservationTimestamp[EntityMetaKey.Selector])}
									prefetched={gitRefObservationTimestamp}
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
