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
			selection: EntityProxyResource<typeof schema, EntityType.AvalancheDelegator>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AvalancheDelegator>>
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
	const avalancheDelegator = $derived(selection({
		fields: {
			delegatorAddress: true,
			stakeAmountNavax: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.delegatorAddress) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.txId ?? prefetched.txId) ?? '')].filter(Boolean).join(' ') || 'avalanche delegator')
	const viewDomId = $derived('avalanche-delegator-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AvalancheValidatorView from '$/views/AvalancheValidatorView.svelte'
</script>


<EntityView
	entityType={EntityType.AvalancheDelegator}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={avalancheDelegator}>
			{#snippet Pending()}
				{[String((prefetched.delegatorAddress) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.txId ?? prefetched.txId) ?? '')].filter(Boolean).join(' ') || 'avalanche delegator'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.delegatorAddress) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={avalancheDelegator}>
			{#snippet Pending()}
				{@const stakeAmountNavax0 = prefetched.stakeAmountNavax}
				{#if stakeAmountNavax0 !== undefined && stakeAmountNavax0 !== null}
					<NumberValue value={Number(stakeAmountNavax0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const stakeAmountNavax0 = resolvedEntity.stakeAmountNavax}
				{#if stakeAmountNavax0 !== undefined && stakeAmountNavax0 !== null}
					<NumberValue value={Number(stakeAmountNavax0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>validator</dt>
				<dd>
					<AvalancheValidatorView
						selection={select(EntityType.AvalancheValidator, selection.entitySelector.$validator, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									txId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const txId = selection.entitySelector.txId ?? prefetched.txId}
							{#if txId !== undefined && txId !== null}
								<TruncatedValue value={String((txId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const txId = resolvedEntity.txId}
							{#if txId !== undefined && txId !== null}
								<TruncatedValue value={String((txId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delegatorAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const delegatorAddress = prefetched.delegatorAddress}
					{#if delegatorAddress !== undefined && delegatorAddress !== null}
						<div>
							<dt>delegator address</dt>
							<dd>
								<TruncatedValue value={String((delegatorAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const delegatorAddress = resolvedEntity.delegatorAddress}
					{#if delegatorAddress !== undefined && delegatorAddress !== null}
						<div>
							<dt>delegator address</dt>
							<dd>
								<TruncatedValue value={String((delegatorAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							stakeAmountNavax: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stakeAmountNavax = prefetched.stakeAmountNavax}
					{#if stakeAmountNavax !== undefined && stakeAmountNavax !== null}
						<div>
							<dt>stake amount navax</dt>
							<dd>
								<NumberValue value={Number(stakeAmountNavax)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stakeAmountNavax = resolvedEntity.stakeAmountNavax}
					{#if stakeAmountNavax !== undefined && stakeAmountNavax !== null}
						<div>
							<dt>stake amount navax</dt>
							<dd>
								<NumberValue value={Number(stakeAmountNavax)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							potentialRewardNavax: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const potentialRewardNavax = prefetched.potentialRewardNavax}
					{#if potentialRewardNavax !== undefined && potentialRewardNavax !== null}
						<div>
							<dt>potential reward navax</dt>
							<dd>
								<NumberValue value={Number(potentialRewardNavax)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const potentialRewardNavax = resolvedEntity.potentialRewardNavax}
					{#if potentialRewardNavax !== undefined && potentialRewardNavax !== null}
						<div>
							<dt>potential reward navax</dt>
							<dd>
								<NumberValue value={Number(potentialRewardNavax)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							startTimeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const startTimeMs = prefetched.startTimeMs}
					{#if startTimeMs !== undefined && startTimeMs !== null}
						<div>
							<dt>start time ms</dt>
							<dd>
								<Timestamp timestamp={Number(startTimeMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const startTimeMs = resolvedEntity.startTimeMs}
					{#if startTimeMs !== undefined && startTimeMs !== null}
						<div>
							<dt>start time ms</dt>
							<dd>
								<Timestamp timestamp={Number(startTimeMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							endTimeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const endTimeMs = prefetched.endTimeMs}
					{#if endTimeMs !== undefined && endTimeMs !== null}
						<div>
							<dt>end time ms</dt>
							<dd>
								<Timestamp timestamp={Number(endTimeMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const endTimeMs = resolvedEntity.endTimeMs}
					{#if endTimeMs !== undefined && endTimeMs !== null}
						<div>
							<dt>end time ms</dt>
							<dd>
								<Timestamp timestamp={Number(endTimeMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
