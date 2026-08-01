<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HyperliquidFill>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HyperliquidAccountView from '$/views/HyperliquidAccountView.svelte'
	import HyperliquidOrderView from '$/views/HyperliquidOrderView.svelte'
	import HyperliquidTransactionView from '$/views/HyperliquidTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidFill}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<HyperliquidAccountView
						selection={select(EntityType.HyperliquidAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>tid</dt>
				<dd>
					{selection.entitySelector.tid}
				</dd>
			</div>

			<div>
				<dt>oid</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									oid: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.oid}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>coin</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									coin: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.coin}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							side: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const side = entity.side}
					{#if side != null}
						<div>
							<dt>side</dt>
							<dd>
								{side}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							direction: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const direction = entity.direction}
					{#if direction != null}
						<div>
							<dt>direction</dt>
							<dd>
								{direction}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							price: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const price = entity.price}
					{#if price != null}
						<div>
							<dt>price</dt>
							<dd>
								{price}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							size: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const size = entity.size}
					{#if size != null}
						<div>
							<dt>size</dt>
							<dd>
								{size}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							startPosition: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const startPosition = entity.startPosition}
					{#if startPosition != null}
						<div>
							<dt>start position</dt>
							<dd>
								{startPosition}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							closedPnl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const closedPnl = entity.closedPnl}
					{#if closedPnl != null}
						<div>
							<dt>closed pnl</dt>
							<dd>
								{closedPnl}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fee: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fee = entity.fee}
					{#if fee != null}
						<div>
							<dt>fee</dt>
							<dd>
								{fee}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeToken: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeToken = entity.feeToken}
					{#if feeToken != null}
						<div>
							<dt>fee token</dt>
							<dd>
								{feeToken}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timeMs = entity.timeMs}
					{#if timeMs != null}
						<div>
							<dt>time ms</dt>
							<dd>
								{timeMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							hash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const hash = entity.hash}
					{#if hash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue value={hash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							crossed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const crossed = entity.crossed}
					{#if crossed != null}
						<div>
							<dt>crossed</dt>
							<dd>
								{crossed}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$order}
			>
				{#snippet children(hyperliquidOrder)}
					{#if hyperliquidOrder != null}
						<div>
							<dt>order</dt>
							<dd>
								<HyperliquidOrderView
									selection={select(EntityType.HyperliquidOrder, hyperliquidOrder[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$transaction}
			>
				{#snippet children(hyperliquidTransaction)}
					{#if hyperliquidTransaction != null}
						<div>
							<dt>transaction</dt>
							<dd>
								<HyperliquidTransactionView
									selection={select(EntityType.HyperliquidTransaction, hyperliquidTransaction[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
