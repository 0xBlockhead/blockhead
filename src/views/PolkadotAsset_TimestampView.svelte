<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.PolkadotAsset_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.SubstrateSidecar_Rest,
		],
	}))
	const polkadotAssetTimestamp = $derived(viewSelection({
		fields: {
			symbol: true,
			name: true,
			status: true,
		},
	}))
	const titleFallback = $derived([(prefetched.symbol ?? ''), (prefetched.name ?? '')].filter(Boolean).join(' ') || 'Polkadot asset timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import PolkadotAssetView from '$/views/PolkadotAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotAsset_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={polkadotAssetTimestamp}>
			{#snippet children(entity)}
				{[(entity.symbol ?? ''), (entity.name ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={polkadotAssetTimestamp}>
			{#snippet children(entity)}
				{(entity.status ?? '') || [(entity.symbol ?? ''), (entity.name ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={selection.entitySelector.timestampMs} />
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Asset</dt>
				<dd>
					<PolkadotAssetView
						selection={select(EntityType.PolkadotAsset, selection.entitySelector.$asset)}
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
					viewSelection({
						fields: {
							blockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockNumber = entity.blockNumber}
					{#if blockNumber != null}
						<div>
							<dt>Block number</dt>
							<dd>
								<NumberValue
									value={blockNumber}
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
							blockHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockHash = entity.blockHash}
					{#if blockHash != null}
						<div>
							<dt>Block hash</dt>
							<dd>
								<TruncatedValue value={blockHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={polkadotAssetTimestamp}
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
				resource={polkadotAssetTimestamp}
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
				resource={polkadotAssetTimestamp}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>Status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
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
								<NumberValue
									value={decimals}
								/>
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
							supply: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const supply = entity.supply}
					{#if supply != null}
						<div>
							<dt>Supply</dt>
							<dd>
								<NumberValue
									value={supply}
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
								<NumberValue
									value={holderCount}
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
							existentialDepositPlancks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const existentialDepositPlancks = entity.existentialDepositPlancks}
					{#if existentialDepositPlancks != null}
						<div>
							<dt>Existential deposit plancks</dt>
							<dd>
								<NumberValue
									value={existentialDepositPlancks}
								/>
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
							owner: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const owner = entity.owner}
					{#if owner != null}
						<div>
							<dt>Owner</dt>
							<dd>
								{owner}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							issuer: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const issuer = entity.issuer}
					{#if issuer != null}
						<div>
							<dt>Issuer</dt>
							<dd>
								<TruncatedValue value={issuer} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							admin: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const admin = entity.admin}
					{#if admin != null}
						<div>
							<dt>Admin</dt>
							<dd>
								{admin}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							freezer: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const freezer = entity.freezer}
					{#if freezer != null}
						<div>
							<dt>Freezer</dt>
							<dd>
								{freezer}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
