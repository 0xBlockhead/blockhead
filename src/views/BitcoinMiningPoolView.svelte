<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.BitcoinMiningPool> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.MempoolSpace_Rest,
		],
	}))
	const titleFallback = $derived((prefetched.name ?? '') || 'Bitcoin mining pool')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UtxoAddressesView from '$/views/UtxoAddressesView.svelte'
	import BitcoinMiningPool_TimestampsView from '$/views/BitcoinMiningPool_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinMiningPool}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mining-pool/[slug=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					slug: selection.entitySelector.slug,
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
				{entity.name || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.slug || (prefetched.name ?? '') || titleFallback}
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Catalog id</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									uniqueId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.uniqueId}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							websiteUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const websiteUrl = entity.websiteUrl}
					{#if websiteUrl != null}
						<div>
							<dt>Website</dt>
							<dd>
								<a
									href={websiteUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={websiteUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Coinbase tag regexes</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									coinbaseTagRegexes: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.coinbaseTagRegexes.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const coinbaseAddressesResource = selection.$$coinbaseAddresses}
		<ResourceBoundary
			resource={coinbaseAddressesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<UtxoAddressesView
						selection={coinbaseAddressesResource}
						countResource={coinbaseAddressesResource.count}
						title='Coinbase addresses'
						id='coinbase-addresses'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BitcoinMiningPool_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
