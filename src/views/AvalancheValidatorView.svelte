<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.AvalancheValidator>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AvalancheValidator>>
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
	const avalancheValidator = $derived(selection({
		fields: {
			stakeAmountNavax: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.nodeId) ?? '')].filter(Boolean).join(' ') || 'avalanche validator')
	const viewDomId = $derived('avalanche-validator-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AvalancheValidator_TimestampsView from '$/views/AvalancheValidator_TimestampsView.svelte'
	import AvalancheSubnetView from '$/views/AvalancheSubnetView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AvalancheValidator}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={avalancheValidator}>
			{#snippet Pending()}
				{[String((pendingEntity.nodeId) ?? '')].filter(Boolean).join(' ') || title || 'avalanche validator'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.nodeId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={avalancheValidator}>
			{#snippet Pending()}
				{@const stakeAmountNavax0 = pendingEntity.stakeAmountNavax}
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

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={avalancheValidator}>
			{#snippet Pending()}
				{@const startTimeMs0 = pendingEntity.startTimeMs}
				{#if startTimeMs0 !== undefined && startTimeMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(startTimeMs0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const startTimeMs0 = resolvedEntity.startTimeMs}
				{#if startTimeMs0 !== undefined && startTimeMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(startTimeMs0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>node ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									nodeId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const nodeId = pendingEntity.nodeId}
							{#if nodeId !== undefined && nodeId !== null}
								{String((nodeId) ?? '')}
							{/if}
						{/snippet}

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
				<dt>subnet ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									subnetId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const subnetId = pendingEntity.subnetId}
							{#if subnetId !== undefined && subnetId !== null}
								{String((subnetId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const subnetId = resolvedEntity.subnetId}
							{#if subnetId !== undefined && subnetId !== null}
								{String((subnetId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$subnet}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(avalancheSubnet)}
					{#if avalancheSubnet != null && avalancheSubnet[EntityMetaKey.Selector] != null}
						<div>
							<dt>subnet</dt>
							<dd>
								<AvalancheSubnetView
									selection={select(EntityType.AvalancheSubnet, avalancheSubnet[EntityMetaKey.Selector])}
									prefetched={avalancheSubnet}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$network}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(network)}
					{#if network != null && network[EntityMetaKey.Selector] != null}
						<div>
							<dt>network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(network[EntityMetaKey.Selector].caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
										}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(network[EntityMetaKey.Selector].slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>start time ms</dt>
				<dd>
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
							{@const startTimeMs = pendingEntity.startTimeMs}
							{#if startTimeMs !== undefined && startTimeMs !== null}
								<Timestamp timestamp={Number(startTimeMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const startTimeMs = resolvedEntity.startTimeMs}
							{#if startTimeMs !== undefined && startTimeMs !== null}
								<Timestamp timestamp={Number(startTimeMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
					{@const endTimeMs = pendingEntity.endTimeMs}
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
					{@const stakeAmountNavax = pendingEntity.stakeAmountNavax}
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
					{@const potentialRewardNavax = pendingEntity.potentialRewardNavax}
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
		</dl>

		<dl data-column-item="center">
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
					{@const txId = pendingEntity.txId}
					{#if txId !== undefined && txId !== null}
						<div>
							<dt>transaction ID</dt>
							<dd>
								<TruncatedValue value={String((txId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const txId = resolvedEntity.txId}
					{#if txId !== undefined && txId !== null}
						<div>
							<dt>transaction ID</dt>
							<dd>
								<TruncatedValue value={String((txId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delegationFeePercent: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const delegationFeePercent = pendingEntity.delegationFeePercent}
					{#if delegationFeePercent !== undefined && delegationFeePercent !== null}
						<div>
							<dt>delegation fee percent</dt>
							<dd>
								<NumberValue value={Number(delegationFeePercent)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const delegationFeePercent = resolvedEntity.delegationFeePercent}
					{#if delegationFeePercent !== undefined && delegationFeePercent !== null}
						<div>
							<dt>delegation fee percent</dt>
							<dd>
								<NumberValue value={Number(delegationFeePercent)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AvalancheValidator_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No observations yet.'
				id='AvalancheValidator_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
