<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.CardanoStakePool> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Blockfrost_Rest,
		],
	}))
	const cardanoStakePool = $derived(viewSelection({
		fields: {
			ticker: true,
			vrfKeyHash: true,
		},
	}))
	const titleFallback = $derived([(prefetched.ticker ?? ''), selection.entitySelector.poolId].filter(Boolean).join(' ') || 'Cardano stake pool')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoStakePool}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/stake-pool/[poolId=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					poolId: selection.entitySelector.poolId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cardanoStakePool}>
			{#snippet children(entity)}
				{[(entity.ticker ?? ''), selection.entitySelector.poolId].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cardanoStakePool}>
			{#snippet children(entity)}
				{(entity.vrfKeyHash ?? '') || [(entity.ticker ?? ''), selection.entitySelector.poolId].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>pool ID</dt>
				<dd>
					{selection.entitySelector.poolId}
				</dd>
			</div>

			<ResourceBoundary
				resource={cardanoStakePool}
			>
				{#snippet children(entity)}
					{@const vrfKeyHash = entity.vrfKeyHash}
					{#if vrfKeyHash != null}
						<div>
							<dt>vrf key hash</dt>
							<dd>
								<TruncatedValue value={vrfKeyHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							name: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={cardanoStakePool}
			>
				{#snippet children(entity)}
					{@const ticker = entity.ticker}
					{#if ticker != null}
						<div>
							<dt>ticker</dt>
							<dd>
								{ticker}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							description: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const description = entity.description}
					{#if description != null}
						<div>
							<dt>description</dt>
							<dd>
								{description}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							homepage: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const homepage = entity.homepage}
					{#if homepage != null}
						<div>
							<dt>homepage</dt>
							<dd>
								{homepage}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
