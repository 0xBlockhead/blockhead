<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.AptosCoinBalance_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AptosCoinBalance_Timestamp>>
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
	const aptosCoinBalanceTimestamp = $derived(selection({
		fields: {
			assetType: true,
			amount: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.assetType) ?? '')].filter(Boolean).join(' ') || 'current Aptos coin balance observation')
	const viewDomId = $derived('aptos-coin-balance-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AptosAccountView from '$/views/AptosAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosCoinBalance_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aptosCoinBalanceTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.assetType) ?? '')].filter(Boolean).join(' ') || title || 'current Aptos coin balance observation'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.assetType) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aptosCoinBalanceTimestamp}>
			{#snippet Pending()}
				{@const amount0 = pendingEntity.amount}
				{#if amount0 !== undefined && amount0 !== null}
					<NumberValue value={Number(amount0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const amount0 = resolvedEntity.amount}
				{#if amount0 !== undefined && amount0 !== null}
					<NumberValue value={Number(amount0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aptosCoinBalanceTimestamp}>
			{#snippet Pending()}
				{@const ledgerVersion0 = pendingEntity.ledgerVersion}
				{#if ledgerVersion0 !== undefined && ledgerVersion0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(ledgerVersion0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const ledgerVersion0 = resolvedEntity.ledgerVersion}
				{#if ledgerVersion0 !== undefined && ledgerVersion0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(ledgerVersion0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A current balance reported by the Aptos Indexer, anchored to the row's last transaction version. This surface does not imply retained balance history.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<AptosAccountView
						selection={select(EntityType.AptosAccount, selection.entitySelector.$account, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>asset type</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									assetType: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const assetType = pendingEntity.assetType}
							{#if assetType !== undefined && assetType !== null}
								{String((assetType) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const assetType = resolvedEntity.assetType}
							{#if assetType !== undefined && assetType !== null}
								{String((assetType) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>storage ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									storageId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const storageId = pendingEntity.storageId}
							{#if storageId !== undefined && storageId !== null}
								{String((storageId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const storageId = resolvedEntity.storageId}
							{#if storageId !== undefined && storageId !== null}
								{String((storageId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>primary store</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									isPrimary: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const isPrimary = pendingEntity.isPrimary}
							{#if isPrimary !== undefined && isPrimary !== null}
								{isPrimary ? 'Yes' : 'No'}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const isPrimary = resolvedEntity.isPrimary}
							{#if isPrimary !== undefined && isPrimary !== null}
								{isPrimary ? 'Yes' : 'No'}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							coinType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const coinType = pendingEntity.coinType}
					{#if coinType !== undefined && coinType !== null}
						<div>
							<dt>coin type</dt>
							<dd>
								{String((coinType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const coinType = resolvedEntity.coinType}
					{#if coinType !== undefined && coinType !== null}
						<div>
							<dt>coin type</dt>
							<dd>
								{String((coinType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>amount</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									amount: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const amount = pendingEntity.amount}
							{#if amount !== undefined && amount !== null}
								<NumberValue value={Number(amount)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const amount = resolvedEntity.amount}
							{#if amount !== undefined && amount !== null}
								<NumberValue value={Number(amount)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>last transaction version</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									ledgerVersion: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const ledgerVersion = pendingEntity.ledgerVersion}
							{#if ledgerVersion !== undefined && ledgerVersion !== null}
								<NumberValue value={Number(ledgerVersion)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const ledgerVersion = resolvedEntity.ledgerVersion}
							{#if ledgerVersion !== undefined && ledgerVersion !== null}
								<NumberValue value={Number(ledgerVersion)} />
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
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

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
				resource={
					selection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestampMs = pendingEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>owner address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									ownerAddress: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const ownerAddress = pendingEntity.ownerAddress}
							{#if ownerAddress !== undefined && ownerAddress !== null}
								<TruncatedValue value={String((ownerAddress) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const ownerAddress = resolvedEntity.ownerAddress}
							{#if ownerAddress !== undefined && ownerAddress !== null}
								<TruncatedValue value={String((ownerAddress) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
