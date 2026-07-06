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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoStakePool>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CardanoStakePool>>
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
	const cardanoStakePool = $derived(selection({}))
	const titleFallback = $derived('Cardano stake pool')
	const viewDomId = $derived('cardano-stake-pool-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoNetworkView from '$/views/CardanoNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoStakePool}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cardanoStakePool}>
			{#snippet Pending()}
				{title || 'Cardano stake pool'}
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
					<CardanoNetworkView
						selection={select(EntityType.CardanoNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>pool ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									poolId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const poolId = selection.entitySelector.poolId ?? prefetched.poolId}
							{#if poolId !== undefined && poolId !== null}
								{String((poolId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const poolId = resolvedEntity.poolId}
							{#if poolId !== undefined && poolId !== null}
								{String((poolId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							vrfKeyHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const vrfKeyHash = prefetched.vrfKeyHash}
					{#if vrfKeyHash !== undefined && vrfKeyHash !== null}
						<div>
							<dt>vrf key hash</dt>
							<dd>
								<TruncatedValue value={String((vrfKeyHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const vrfKeyHash = resolvedEntity.vrfKeyHash}
					{#if vrfKeyHash !== undefined && vrfKeyHash !== null}
						<div>
							<dt>vrf key hash</dt>
							<dd>
								<TruncatedValue value={String((vrfKeyHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
