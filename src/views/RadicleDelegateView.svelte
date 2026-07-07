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
			selection: EntityProxyResource<typeof schema, EntityType.RadicleDelegate>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.RadicleDelegate>>
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
	const radicleDelegate = $derived(selection({}))
	const titleFallback = $derived('radicle delegate')
	const viewDomId = $derived('radicle-delegate-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RadicleRepositoryView from '$/views/RadicleRepositoryView.svelte'
</script>


<EntityView
	entityType={EntityType.RadicleDelegate}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={radicleDelegate}>
			{#snippet Pending()}
				{title || 'radicle delegate'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
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
				<dt>DID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									did: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const did = selection.entitySelector.did ?? prefetched.did}
							{#if did !== undefined && did !== null}
								{String((did) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const did = resolvedEntity.did}
							{#if did !== undefined && did !== null}
								{String((did) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							role: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const role = prefetched.role}
					{#if role !== undefined && role !== null}
						<div>
							<dt>role</dt>
							<dd>
								{String((role) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const role = resolvedEntity.role}
					{#if role !== undefined && role !== null}
						<div>
							<dt>role</dt>
							<dd>
								{String((role) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							validFromRevision: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const validFromRevision = prefetched.validFromRevision}
					{#if validFromRevision !== undefined && validFromRevision !== null}
						<div>
							<dt>valid from revision</dt>
							<dd>
								{String((validFromRevision) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const validFromRevision = resolvedEntity.validFromRevision}
					{#if validFromRevision !== undefined && validFromRevision !== null}
						<div>
							<dt>valid from revision</dt>
							<dd>
								{String((validFromRevision) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							validToRevision: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const validToRevision = prefetched.validToRevision}
					{#if validToRevision !== undefined && validToRevision !== null}
						<div>
							<dt>valid to revision</dt>
							<dd>
								{String((validToRevision) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const validToRevision = resolvedEntity.validToRevision}
					{#if validToRevision !== undefined && validToRevision !== null}
						<div>
							<dt>valid to revision</dt>
							<dd>
								{String((validToRevision) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
