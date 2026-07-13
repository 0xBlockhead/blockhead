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
			selection: EntityProxyResource<typeof schema, EntityType.TezosBigMapDiff>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TezosBigMapDiff>>
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
	const tezosBigMapDiff = $derived(selection({}))
	const titleFallback = $derived('tezos big map diff')
	const viewDomId = $derived('tezos-big-map-diff-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosOperationView from '$/views/TezosOperationView.svelte'
	import TezosBigMapView from '$/views/TezosBigMapView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosBigMapDiff}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tezosBigMapDiff}>
			{#snippet Pending()}
				{title || 'tezos big map diff'}
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
				<dt>operation</dt>
				<dd>
					<TezosOperationView
						selection={select(EntityType.TezosOperation, selection.entitySelector.$operation, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>big map ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									bigMapId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const bigMapId = pendingEntity.bigMapId}
							{#if bigMapId !== undefined && bigMapId !== null}
								{String((bigMapId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const bigMapId = resolvedEntity.bigMapId}
							{#if bigMapId !== undefined && bigMapId !== null}
								{String((bigMapId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>key hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									keyHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const keyHash = pendingEntity.keyHash}
							{#if keyHash !== undefined && keyHash !== null}
								<TruncatedValue value={String((keyHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const keyHash = resolvedEntity.keyHash}
							{#if keyHash !== undefined && keyHash !== null}
								<TruncatedValue value={String((keyHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>action</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									action: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const action = pendingEntity.action}
							{#if action !== undefined && action !== null}
								{String((action) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const action = resolvedEntity.action}
							{#if action !== undefined && action !== null}
								{String((action) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$bigMap}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(tezosBigMap)}
					{#if tezosBigMap != null && tezosBigMap[EntityMetaKey.Selector] != null}
						<div>
							<dt>big map</dt>
							<dd>
								<TezosBigMapView
									selection={select(EntityType.TezosBigMap, tezosBigMap[EntityMetaKey.Selector])}
									prefetched={tezosBigMap}
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
