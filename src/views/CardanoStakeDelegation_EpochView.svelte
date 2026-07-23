<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
			selection: RegisteredEntityProxyResource<EntityType.CardanoStakeDelegation_Epoch>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.CardanoStakeDelegation_Epoch>
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
	const cardanoStakeDelegationEpoch = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'Cardano stake delegation epoch'
	const viewDomId = $derived('cardano-stake-delegation-epoch-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoStakeCredentialView from '$/views/CardanoStakeCredentialView.svelte'
	import CardanoStakePoolView from '$/views/CardanoStakePoolView.svelte'
	import CardanoDRepView from '$/views/CardanoDRepView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoStakeDelegation_Epoch}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={cardanoStakeDelegationEpoch}>
				{#snippet children(entity)}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>stake credential</dt>
				<dd>
					<CardanoStakeCredentialView
						selection={select(EntityType.CardanoStakeCredential, selection.entitySelector.$stakeCredential)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>epoch</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									epoch: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const epoch = resolvedEntity.epoch}
							{#if epoch !== undefined && epoch !== null}
								{String((epoch) ?? '')}
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
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
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
				resource={selection.$stakePool}
			>
				{#snippet children(cardanoStakePool)}
					{#if cardanoStakePool != null && cardanoStakePool[EntityMetaKey.Selector] != null}
						<div>
							<dt>stake pool</dt>
							<dd>
								<CardanoStakePoolView
									selection={select(EntityType.CardanoStakePool, cardanoStakePool[EntityMetaKey.Selector])}
									prefetched={cardanoStakePool}
									href={
										(
											cardanoStakePool[EntityMetaKey.Selector] != null && 'poolId' in cardanoStakePool[EntityMetaKey.Selector]
											&& cardanoStakePool[EntityMetaKey.Selector].poolId != null
											&& cardanoStakePool[EntityMetaKey.Selector] != null && '$network' in cardanoStakePool[EntityMetaKey.Selector] ?
												cardanoStakePool[EntityMetaKey.Selector].$network != null && 'caip2' in cardanoStakePool[EntityMetaKey.Selector].$network
												&& cardanoStakePool[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/stake-pool/[poolId=stringSegment]', {
												poolId: String(cardanoStakePool[EntityMetaKey.Selector].poolId ?? ''),
												network: String(caip2StringFromValue(cardanoStakePool[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													cardanoStakePool[EntityMetaKey.Selector].$network != null && 'slug' in cardanoStakePool[EntityMetaKey.Selector].$network
													&& cardanoStakePool[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/stake-pool/[poolId=stringSegment]', {
													poolId: String(cardanoStakePool[EntityMetaKey.Selector].poolId ?? ''),
													network: String(cardanoStakePool[EntityMetaKey.Selector].$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$drep}
			>
				{#snippet children(cardanoDRep)}
					{#if cardanoDRep != null && cardanoDRep[EntityMetaKey.Selector] != null}
						<div>
							<dt>drep</dt>
							<dd>
								<CardanoDRepView
									selection={select(EntityType.CardanoDRep, cardanoDRep[EntityMetaKey.Selector])}
									prefetched={cardanoDRep}
									href={
										(
											cardanoDRep[EntityMetaKey.Selector] != null && 'drepCredential' in cardanoDRep[EntityMetaKey.Selector]
											&& cardanoDRep[EntityMetaKey.Selector].drepCredential != null
											&& cardanoDRep[EntityMetaKey.Selector] != null && '$network' in cardanoDRep[EntityMetaKey.Selector] ?
												cardanoDRep[EntityMetaKey.Selector].$network != null && 'caip2' in cardanoDRep[EntityMetaKey.Selector].$network
												&& cardanoDRep[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/drep/[drepCredential=stringSegment]', {
												drepCredential: String(cardanoDRep[EntityMetaKey.Selector].drepCredential ?? ''),
												network: String(caip2StringFromValue(cardanoDRep[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													cardanoDRep[EntityMetaKey.Selector].$network != null && 'slug' in cardanoDRep[EntityMetaKey.Selector].$network
													&& cardanoDRep[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/drep/[drepCredential=stringSegment]', {
													drepCredential: String(cardanoDRep[EntityMetaKey.Selector].drepCredential ?? ''),
													network: String(cardanoDRep[EntityMetaKey.Selector].$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							activeStake: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activeStake = resolvedEntity.activeStake}
					{#if activeStake !== undefined && activeStake !== null}
						<div>
							<dt>active stake</dt>
							<dd>
								{String((activeStake) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							rewardAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rewardAmount = resolvedEntity.rewardAmount}
					{#if rewardAmount !== undefined && rewardAmount !== null}
						<div>
							<dt>reward amount</dt>
							<dd>
								{String((rewardAmount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							withdrawalAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const withdrawalAmount = resolvedEntity.withdrawalAmount}
					{#if withdrawalAmount !== undefined && withdrawalAmount !== null}
						<div>
							<dt>withdrawal amount</dt>
							<dd>
								{String((withdrawalAmount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							registered: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const registered = resolvedEntity.registered}
					{#if registered !== undefined && registered !== null}
						<div>
							<dt>registered</dt>
							<dd>
								{registered ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							deregistered: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deregistered = resolvedEntity.deregistered}
					{#if deregistered !== undefined && deregistered !== null}
						<div>
							<dt>deregistered</dt>
							<dd>
								{deregistered ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
