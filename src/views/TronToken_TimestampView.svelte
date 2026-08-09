<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.TronToken_Timestamp>, 'prefetched'> = $props()

	const token = $derived(selection.entitySelector.$token)


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TronTokenView from '$/views/TronTokenView.svelte'
</script>


<EntityView
	entityType={EntityType.TronToken_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token/[tokenId=stringSegment]/(selection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in token.$network ?
							caip2StringFromValue(token.$network.caip2)
						:
							token.$network.slug
					),
					tokenId: token.tokenId,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Token</dt>
				<dd>
					<TronTokenView
						selection={select(EntityType.TronToken, selection.entitySelector.$token)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockHeight = entity.blockHeight}
					{#if blockHeight != null}
						<div>
							<dt>Block height</dt>
							<dd>
								{blockHeight}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
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
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							symbol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const symbol = entity.symbol}
					{#if symbol != null}
						<div>
							<dt>Symbol</dt>
							<dd>
								{symbol}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							decimals: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const decimals = entity.decimals}
					{#if decimals != null}
						<div>
							<dt>Decimals</dt>
							<dd>
								{decimals}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalSupply: true,
							decimals: true,
							symbol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalSupply = entity.totalSupply}
					{#if totalSupply != null}
						<div>
							<dt>Total supply</dt>
							<dd>
								<NumberValue
									value={totalSupply}
									decimalPlaces={entity.decimals}
								/>

								<span>{entity.symbol == null ? '' : ` ${entity.symbol}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							holderCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const holderCount = entity.holderCount}
					{#if holderCount != null}
						<div>
							<dt>Holders</dt>
							<dd>
								{holderCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transferCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transferCount = entity.transferCount}
					{#if transferCount != null}
						<div>
							<dt>Transfers</dt>
							<dd>
								{transferCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							contractVerified: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contractVerified = entity.contractVerified}
					{#if contractVerified != null}
						<div>
							<dt>Contract verified</dt>
							<dd>
								{contractVerified ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
