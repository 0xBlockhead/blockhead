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
			selection: EntityProxyResource<typeof schema, EntityType.TezosBaker_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TezosBaker_Timestamp>>
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
	const tezosBakerTimestamp = $derived(selection({}))
	const titleFallback = $derived('tezos baker timestamp')
	const viewDomId = $derived('tezos-baker-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TezosBakerView from '$/views/TezosBakerView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosBaker_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tezosBakerTimestamp}>
			{#snippet Pending()}
				{title || 'tezos baker timestamp'}
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
						selection={select(EntityType.TezosBaker, selection.entitySelector.$baker, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>level</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									level: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const level = selection.entitySelector.level ?? prefetched.level}
							{#if level !== undefined && level !== null}
								{String((level) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const level = resolvedEntity.level}
							{#if level !== undefined && level !== null}
								{String((level) ?? '')}
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
							timestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestampMs = prefetched.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							consensusKey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const consensusKey = prefetched.consensusKey}
					{#if consensusKey !== undefined && consensusKey !== null}
						<div>
							<dt>consensus key</dt>
							<dd>
								{String((consensusKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const consensusKey = resolvedEntity.consensusKey}
					{#if consensusKey !== undefined && consensusKey !== null}
						<div>
							<dt>consensus key</dt>
							<dd>
								{String((consensusKey) ?? '')}
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
							ownDelegatedBalanceMutez: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ownDelegatedBalanceMutez = prefetched.ownDelegatedBalanceMutez}
					{#if ownDelegatedBalanceMutez !== undefined && ownDelegatedBalanceMutez !== null}
						<div>
							<dt>own delegated balance mutez</dt>
							<dd>
								{String((ownDelegatedBalanceMutez) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ownDelegatedBalanceMutez = resolvedEntity.ownDelegatedBalanceMutez}
					{#if ownDelegatedBalanceMutez !== undefined && ownDelegatedBalanceMutez !== null}
						<div>
							<dt>own delegated balance mutez</dt>
							<dd>
								{String((ownDelegatedBalanceMutez) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							votingPower: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const votingPower = prefetched.votingPower}
					{#if votingPower !== undefined && votingPower !== null}
						<div>
							<dt>voting power</dt>
							<dd>
								{String((votingPower) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const votingPower = resolvedEntity.votingPower}
					{#if votingPower !== undefined && votingPower !== null}
						<div>
							<dt>voting power</dt>
							<dd>
								{String((votingPower) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							active: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const active = prefetched.active}
					{#if active !== undefined && active !== null}
						<div>
							<dt>active</dt>
							<dd>
								{active ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const active = resolvedEntity.active}
					{#if active !== undefined && active !== null}
						<div>
							<dt>active</dt>
							<dd>
								{active ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
