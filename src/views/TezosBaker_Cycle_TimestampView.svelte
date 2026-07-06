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
			selection: EntityProxyResource<typeof schema, EntityType.TezosBaker_Cycle_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TezosBaker_Cycle_Timestamp>>
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
	const tezosBakerCycleTimestamp = $derived(selection({}))
	const titleFallback = $derived('tezos baker cycle timestamp')
	const viewDomId = $derived('tezos-baker-cycle-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TezosBakerView from '$/views/TezosBakerView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosBaker_Cycle_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tezosBakerCycleTimestamp}>
			{#snippet Pending()}
				{title || 'tezos baker cycle timestamp'}
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
				<dt>baker</dt>
				<dd>
					<TezosBakerView
						selection={select(EntityType.TezosBaker, selection.entitySelector.$baker)}
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

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
							stakingBalanceMutez: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stakingBalanceMutez = prefetched.stakingBalanceMutez}
					{#if stakingBalanceMutez !== undefined && stakingBalanceMutez !== null}
						<div>
							<dt>staking balance mutez</dt>
							<dd>
								{String((stakingBalanceMutez) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stakingBalanceMutez = resolvedEntity.stakingBalanceMutez}
					{#if stakingBalanceMutez !== undefined && stakingBalanceMutez !== null}
						<div>
							<dt>staking balance mutez</dt>
							<dd>
								{String((stakingBalanceMutez) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delegatedBalanceMutez: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const delegatedBalanceMutez = prefetched.delegatedBalanceMutez}
					{#if delegatedBalanceMutez !== undefined && delegatedBalanceMutez !== null}
						<div>
							<dt>delegated balance mutez</dt>
							<dd>
								{String((delegatedBalanceMutez) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const delegatedBalanceMutez = resolvedEntity.delegatedBalanceMutez}
					{#if delegatedBalanceMutez !== undefined && delegatedBalanceMutez !== null}
						<div>
							<dt>delegated balance mutez</dt>
							<dd>
								{String((delegatedBalanceMutez) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							expectedBlocks: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const expectedBlocks = prefetched.expectedBlocks}
					{#if expectedBlocks !== undefined && expectedBlocks !== null}
						<div>
							<dt>expected blocks</dt>
							<dd>
								{String((expectedBlocks) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expectedBlocks = resolvedEntity.expectedBlocks}
					{#if expectedBlocks !== undefined && expectedBlocks !== null}
						<div>
							<dt>expected blocks</dt>
							<dd>
								{String((expectedBlocks) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							producedBlocks: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const producedBlocks = prefetched.producedBlocks}
					{#if producedBlocks !== undefined && producedBlocks !== null}
						<div>
							<dt>produced blocks</dt>
							<dd>
								{String((producedBlocks) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const producedBlocks = resolvedEntity.producedBlocks}
					{#if producedBlocks !== undefined && producedBlocks !== null}
						<div>
							<dt>produced blocks</dt>
							<dd>
								{String((producedBlocks) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							missedBlocks: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const missedBlocks = prefetched.missedBlocks}
					{#if missedBlocks !== undefined && missedBlocks !== null}
						<div>
							<dt>missed blocks</dt>
							<dd>
								{String((missedBlocks) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const missedBlocks = resolvedEntity.missedBlocks}
					{#if missedBlocks !== undefined && missedBlocks !== null}
						<div>
							<dt>missed blocks</dt>
							<dd>
								{String((missedBlocks) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							expectedEndorsements: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const expectedEndorsements = prefetched.expectedEndorsements}
					{#if expectedEndorsements !== undefined && expectedEndorsements !== null}
						<div>
							<dt>expected endorsements</dt>
							<dd>
								{String((expectedEndorsements) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expectedEndorsements = resolvedEntity.expectedEndorsements}
					{#if expectedEndorsements !== undefined && expectedEndorsements !== null}
						<div>
							<dt>expected endorsements</dt>
							<dd>
								{String((expectedEndorsements) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							missedEndorsements: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const missedEndorsements = prefetched.missedEndorsements}
					{#if missedEndorsements !== undefined && missedEndorsements !== null}
						<div>
							<dt>missed endorsements</dt>
							<dd>
								{String((missedEndorsements) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const missedEndorsements = resolvedEntity.missedEndorsements}
					{#if missedEndorsements !== undefined && missedEndorsements !== null}
						<div>
							<dt>missed endorsements</dt>
							<dd>
								{String((missedEndorsements) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rewardsMutez: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rewardsMutez = prefetched.rewardsMutez}
					{#if rewardsMutez !== undefined && rewardsMutez !== null}
						<div>
							<dt>rewards mutez</dt>
							<dd>
								{String((rewardsMutez) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rewardsMutez = resolvedEntity.rewardsMutez}
					{#if rewardsMutez !== undefined && rewardsMutez !== null}
						<div>
							<dt>rewards mutez</dt>
							<dd>
								{String((rewardsMutez) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feesMutez: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feesMutez = prefetched.feesMutez}
					{#if feesMutez !== undefined && feesMutez !== null}
						<div>
							<dt>fees mutez</dt>
							<dd>
								{String((feesMutez) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feesMutez = resolvedEntity.feesMutez}
					{#if feesMutez !== undefined && feesMutez !== null}
						<div>
							<dt>fees mutez</dt>
							<dd>
								{String((feesMutez) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
