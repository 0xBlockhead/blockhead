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
	}: EntitySelectionViewProps<EntityType.BitcoinCashBcmrMetadata> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.BitcoinCashBcmr_Github,
		],
	}))
	const bitcoinCashBcmrMetadata = $derived(viewSelection({
		fields: {
			name: true,
			symbol: true,
			decimals: true,
		},
	}))
	const titleFallback = $derived((prefetched.name ?? '') || selection.entitySelector.categoryId || 'Bitcoin cash bcmr metadata')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinCashBcmrMetadata}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/bitcoin-cash/metadata/[categoryId=stringSegment]/[registryUrl=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					categoryId: selection.entitySelector.categoryId,
					registryUrl: selection.entitySelector.registryUrl,
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
		<ResourceBoundary resource={bitcoinCashBcmrMetadata}>
			{#snippet children(entity)}
				{(entity.name ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bitcoinCashBcmrMetadata}>
			{#snippet children(entity)}
				{(entity.symbol ?? '') || (entity.name ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={bitcoinCashBcmrMetadata}>
			{#snippet children(entity)}
				{@const decimals = entity.decimals}
				{#if decimals != null}
					<span data-text="muted">
						<NumberValue
							value={decimals}
						/>
					</span>
				{/if}
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
				<dt>category ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.categoryId} />
				</dd>
			</div>

			<div>
				<dt>registry URL</dt>
				<dd>
					<a
						href={selection.entitySelector.registryUrl}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={selection.entitySelector.registryUrl} />
					</a>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={bitcoinCashBcmrMetadata}
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
				resource={bitcoinCashBcmrMetadata}
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
				resource={bitcoinCashBcmrMetadata}
			>
				{#snippet children(entity)}
					{@const decimals = entity.decimals}
					{#if decimals != null}
						<div>
							<dt>Decimals</dt>
							<dd>
								<NumberValue
									value={decimals}
								/>
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
							<dt>Description</dt>
							<dd>
								{description}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
