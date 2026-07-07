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
			selection: EntityProxyResource<typeof schema, EntityType.TezosCycle>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TezosCycle>>
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
	const tezosCycle = $derived(selection({}))
	const titleFallback = $derived('tezos cycle')
	const viewDomId = $derived('tezos-cycle-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TezosNetworkView from '$/views/TezosNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosCycle}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tezosCycle}>
			{#snippet Pending()}
				{title || 'tezos cycle'}
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
				<dt>network</dt>
				<dd>
					<TezosNetworkView
						selection={select(EntityType.TezosNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>cycle</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									cycle: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const cycle = selection.entitySelector.cycle ?? prefetched.cycle}
							{#if cycle !== undefined && cycle !== null}
								{String((cycle) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const cycle = resolvedEntity.cycle}
							{#if cycle !== undefined && cycle !== null}
								{String((cycle) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							firstLevel: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const firstLevel = prefetched.firstLevel}
					{#if firstLevel !== undefined && firstLevel !== null}
						<div>
							<dt>first level</dt>
							<dd>
								{String((firstLevel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const firstLevel = resolvedEntity.firstLevel}
					{#if firstLevel !== undefined && firstLevel !== null}
						<div>
							<dt>first level</dt>
							<dd>
								{String((firstLevel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastLevel: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastLevel = prefetched.lastLevel}
					{#if lastLevel !== undefined && lastLevel !== null}
						<div>
							<dt>last level</dt>
							<dd>
								{String((lastLevel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastLevel = resolvedEntity.lastLevel}
					{#if lastLevel !== undefined && lastLevel !== null}
						<div>
							<dt>last level</dt>
							<dd>
								{String((lastLevel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							snapshotLevel: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const snapshotLevel = prefetched.snapshotLevel}
					{#if snapshotLevel !== undefined && snapshotLevel !== null}
						<div>
							<dt>snapshot level</dt>
							<dd>
								{String((snapshotLevel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const snapshotLevel = resolvedEntity.snapshotLevel}
					{#if snapshotLevel !== undefined && snapshotLevel !== null}
						<div>
							<dt>snapshot level</dt>
							<dd>
								{String((snapshotLevel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							randomSeed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const randomSeed = prefetched.randomSeed}
					{#if randomSeed !== undefined && randomSeed !== null}
						<div>
							<dt>random seed</dt>
							<dd>
								{String((randomSeed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const randomSeed = resolvedEntity.randomSeed}
					{#if randomSeed !== undefined && randomSeed !== null}
						<div>
							<dt>random seed</dt>
							<dd>
								{String((randomSeed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
