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
	import { networkByCaip2 } from '$/constants/Network.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.ElementsIssuance>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ElementsIssuance>>
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
	const elementsIssuance = $derived(selection({
		fields: {
			$asset: true,
			$reissuanceTokenAsset: true,
			isReissuance: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.inputIndex ?? prefetched.inputIndex) ?? '')].filter(Boolean).join(' ') || 'Elements issuance')
	const viewDomId = $derived('elements-issuance-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
	import ElementsAssetView from '$/views/ElementsAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.ElementsIssuance}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={elementsIssuance}>
			{#snippet Pending()}
				{@const inputIndex0 = selection.entitySelector.inputIndex ?? prefetched.inputIndex}
				{#if inputIndex0 !== undefined && inputIndex0 !== null}
					<NumberValue value={Number(inputIndex0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const inputIndex0 = resolvedEntity.inputIndex}
				{#if inputIndex0 !== undefined && inputIndex0 !== null}
					<NumberValue value={Number(inputIndex0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={elementsIssuance}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection.$asset}
				>
					{#snippet children(elementsAsset)}
						{#if elementsAsset != null && elementsAsset[EntityMetaKey.Selector] != null}
							<ElementsAssetView
								selection={select(EntityType.ElementsAsset, elementsAsset[EntityMetaKey.Selector])}
								prefetched={elementsAsset}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={selection.$reissuanceTokenAsset}
				>
					{#snippet children(elementsAsset)}
						{#if elementsAsset != null && elementsAsset[EntityMetaKey.Selector] != null}
							<ElementsAssetView
								selection={select(EntityType.ElementsAsset, elementsAsset[EntityMetaKey.Selector])}
								prefetched={elementsAsset}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection.$asset}
				>
					{#snippet children(elementsAsset)}
						{#if elementsAsset != null && elementsAsset[EntityMetaKey.Selector] != null}
							<ElementsAssetView
								selection={select(EntityType.ElementsAsset, elementsAsset[EntityMetaKey.Selector])}
								prefetched={elementsAsset}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={selection.$reissuanceTokenAsset}
				>
					{#snippet children(elementsAsset)}
						{#if elementsAsset != null && elementsAsset[EntityMetaKey.Selector] != null}
							<ElementsAssetView
								selection={select(EntityType.ElementsAsset, elementsAsset[EntityMetaKey.Selector])}
								prefetched={elementsAsset}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={elementsIssuance}>
			{#snippet Pending()}
				{@const isReissuance0 = prefetched.isReissuance}
				{#if isReissuance0 !== undefined && isReissuance0 !== null}
					<span data-text="muted">
						{isReissuance0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const isReissuance0 = resolvedEntity.isReissuance}
				{#if isReissuance0 !== undefined && isReissuance0 !== null}
					<span data-text="muted">
						{isReissuance0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Transaction</dt>
				<dd>
					<UtxoTransactionView
						selection={select(EntityType.UtxoTransaction, selection.entitySelector.$transaction, {})}
						href={
							(selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined && selection.entitySelector.$transaction.$network.caip2.namespace !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined && selection.entitySelector.$transaction.$network.caip2.reference !== undefined && selection.entitySelector.$transaction.txId !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/transactions/[txId]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$transaction.$network.caip2.namespace) + ':' + String(selection.entitySelector.$transaction.$network.caip2.reference))].slug ?? ''),
								txId: String(selection.entitySelector.$transaction.txId ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Input index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									inputIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const inputIndex = selection.entitySelector.inputIndex ?? prefetched.inputIndex}
							{#if inputIndex !== undefined && inputIndex !== null}
								<NumberValue value={Number(inputIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const inputIndex = resolvedEntity.inputIndex}
							{#if inputIndex !== undefined && inputIndex !== null}
								<NumberValue value={Number(inputIndex)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$asset}
			>
				{#snippet children(elementsAsset)}
					{#if elementsAsset != null && elementsAsset[EntityMetaKey.Selector] != null}
						<div>
							<dt>Asset</dt>
							<dd>
								<ElementsAssetView
									selection={select(EntityType.ElementsAsset, elementsAsset[EntityMetaKey.Selector])}
									prefetched={elementsAsset}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$reissuanceTokenAsset}
			>
				{#snippet children(elementsAsset)}
					{#if elementsAsset != null && elementsAsset[EntityMetaKey.Selector] != null}
						<div>
							<dt>Reissuance token asset</dt>
							<dd>
								<ElementsAssetView
									selection={select(EntityType.ElementsAsset, elementsAsset[EntityMetaKey.Selector])}
									prefetched={elementsAsset}
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
			<ResourceBoundary
				resource={
					selection({
						fields: {
							issuedAmount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const issuedAmount = prefetched.issuedAmount}
					{#if issuedAmount !== undefined && issuedAmount !== null}
						<div>
							<dt>Issued amount</dt>
							<dd>
								<NumberValue value={Number(issuedAmount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const issuedAmount = resolvedEntity.issuedAmount}
					{#if issuedAmount !== undefined && issuedAmount !== null}
						<div>
							<dt>Issued amount</dt>
							<dd>
								<NumberValue value={Number(issuedAmount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tokenAmount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tokenAmount = prefetched.tokenAmount}
					{#if tokenAmount !== undefined && tokenAmount !== null}
						<div>
							<dt>Token amount</dt>
							<dd>
								<NumberValue value={Number(tokenAmount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenAmount = resolvedEntity.tokenAmount}
					{#if tokenAmount !== undefined && tokenAmount !== null}
						<div>
							<dt>Token amount</dt>
							<dd>
								<NumberValue value={Number(tokenAmount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isReissuance: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isReissuance = prefetched.isReissuance}
					{#if isReissuance !== undefined && isReissuance !== null}
						<div>
							<dt>Reissuance</dt>
							<dd>
								{isReissuance ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isReissuance = resolvedEntity.isReissuance}
					{#if isReissuance !== undefined && isReissuance !== null}
						<div>
							<dt>Reissuance</dt>
							<dd>
								{isReissuance ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							assetEntropy: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const assetEntropy = prefetched.assetEntropy}
					{#if assetEntropy !== undefined && assetEntropy !== null}
						<div>
							<dt>Asset entropy</dt>
							<dd>
								<TruncatedValue value={String((assetEntropy) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const assetEntropy = resolvedEntity.assetEntropy}
					{#if assetEntropy !== undefined && assetEntropy !== null}
						<div>
							<dt>Asset entropy</dt>
							<dd>
								<TruncatedValue value={String((assetEntropy) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							assetBlindingNonce: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const assetBlindingNonce = prefetched.assetBlindingNonce}
					{#if assetBlindingNonce !== undefined && assetBlindingNonce !== null}
						<div>
							<dt>Asset blinding nonce</dt>
							<dd>
								<TruncatedValue value={String((assetBlindingNonce) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const assetBlindingNonce = resolvedEntity.assetBlindingNonce}
					{#if assetBlindingNonce !== undefined && assetBlindingNonce !== null}
						<div>
							<dt>Asset blinding nonce</dt>
							<dd>
								<TruncatedValue value={String((assetBlindingNonce) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
