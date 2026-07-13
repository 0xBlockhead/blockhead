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
			selection: EntityProxyResource<typeof schema, EntityType.HederaSchedule>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HederaSchedule>>
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
	const hederaSchedule = $derived(selection({}))
	const titleFallback = $derived('hedera schedule')
	const viewDomId = $derived('hedera-schedule-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaNetworkView from '$/views/HederaNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaSchedule}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaSchedule}>
			{#snippet Pending()}
				{title || 'hedera schedule'}
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
					<HederaNetworkView
						selection={select(EntityType.HederaNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>schedule ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									scheduleId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const scheduleId = pendingEntity.scheduleId}
							{#if scheduleId !== undefined && scheduleId !== null}
								{String((scheduleId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const scheduleId = resolvedEntity.scheduleId}
							{#if scheduleId !== undefined && scheduleId !== null}
								{String((scheduleId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							creatorAccountId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const creatorAccountId = pendingEntity.creatorAccountId}
					{#if creatorAccountId !== undefined && creatorAccountId !== null}
						<div>
							<dt>creator account ID</dt>
							<dd>
								<TruncatedValue value={String((creatorAccountId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const creatorAccountId = resolvedEntity.creatorAccountId}
					{#if creatorAccountId !== undefined && creatorAccountId !== null}
						<div>
							<dt>creator account ID</dt>
							<dd>
								<TruncatedValue value={String((creatorAccountId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							payerAccountId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const payerAccountId = pendingEntity.payerAccountId}
					{#if payerAccountId !== undefined && payerAccountId !== null}
						<div>
							<dt>payer account ID</dt>
							<dd>
								<TruncatedValue value={String((payerAccountId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const payerAccountId = resolvedEntity.payerAccountId}
					{#if payerAccountId !== undefined && payerAccountId !== null}
						<div>
							<dt>payer account ID</dt>
							<dd>
								<TruncatedValue value={String((payerAccountId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
