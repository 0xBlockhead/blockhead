<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.PolkadotAssetBalance_Timestamp>, 'prefetched'> = $props()

	const polkadotAssetBalanceTimestamp = $derived(selection({
		fields: {
			freeBalancePlancks: true,
			status: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import PolkadotAccountView from '$/views/PolkadotAccountView.svelte'
	import PolkadotAssetView from '$/views/PolkadotAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotAssetBalance_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'Polkadot asset balance timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<PolkadotAssetView
			selection={select(EntityType.PolkadotAsset, selection.entitySelector.$asset)}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={polkadotAssetBalanceTimestamp}>
			{#snippet children(entity)}
				{@const freeBalancePlancks = entity.freeBalancePlancks}
				{#if freeBalancePlancks != null}
					<NumberValue
						value={freeBalancePlancks}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={polkadotAssetBalanceTimestamp}>
			{#snippet children(entity)}
				{@const status = entity.status}
				{#if status != null}
					<span data-text="muted">
						{status}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<PolkadotAccountView
						selection={select(EntityType.PolkadotAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

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
					selection({
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
					selection({
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
				resource={polkadotAssetBalanceTimestamp}
			>
				{#snippet children(entity)}
					{@const freeBalancePlancks = entity.freeBalancePlancks}
					{#if freeBalancePlancks != null}
						<div>
							<dt>Free balance plancks</dt>
							<dd>
								<NumberValue
									value={freeBalancePlancks}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reservedBalancePlancks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reservedBalancePlancks = entity.reservedBalancePlancks}
					{#if reservedBalancePlancks != null}
						<div>
							<dt>Reserved balance plancks</dt>
							<dd>
								<NumberValue
									value={reservedBalancePlancks}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							frozenBalancePlancks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const frozenBalancePlancks = entity.frozenBalancePlancks}
					{#if frozenBalancePlancks != null}
						<div>
							<dt>Frozen balance plancks</dt>
							<dd>
								<NumberValue
									value={frozenBalancePlancks}
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
					selection({
						fields: {
							transferableBalancePlancks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transferableBalancePlancks = entity.transferableBalancePlancks}
					{#if transferableBalancePlancks != null}
						<div>
							<dt>Transferable balance plancks</dt>
							<dd>
								<NumberValue
									value={transferableBalancePlancks}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lockedBalancePlancks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lockedBalancePlancks = entity.lockedBalancePlancks}
					{#if lockedBalancePlancks != null}
						<div>
							<dt>Locked balance plancks</dt>
							<dd>
								<NumberValue
									value={lockedBalancePlancks}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={polkadotAssetBalanceTimestamp}
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
					selection({
						fields: {
							reason: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reason = entity.reason}
					{#if reason != null}
						<div>
							<dt>Reason</dt>
							<dd>
								{reason}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
