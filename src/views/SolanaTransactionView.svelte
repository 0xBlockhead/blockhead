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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.SolanaTransaction>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.SolanaTransaction>
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
	const solanaTransaction = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			status: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.signature) ?? '')].filter(Boolean).join(' ') || 'solana transaction')
	const viewDomId = $derived('solana-transaction-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SolanaInstructionsView from '$/views/SolanaInstructionsView.svelte'
	import SolanaBlockView from '$/views/SolanaBlockView.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'signature' in selection.entitySelector
			&& selection.entitySelector.signature != null
			&& selection.entitySelector != null && '$network' in selection.entitySelector ?
				selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
				&& selection.entitySelector.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
				transactionId: String(selection.entitySelector.signature ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
					&& selection.entitySelector.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
					transactionId: String(selection.entitySelector.signature ?? ''),
					network: String(selection.entitySelector.$network.slug ?? ''),
				})
				:
					undefined
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'status')}
			{@const signature0 = pendingEntity.signature}
			{#if signature0 !== undefined && signature0 !== null}
				<TruncatedValue value={String((signature0) ?? '')} />
			{/if}
		{:else}
			<ResourceBoundary resource={solanaTransaction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const signature0 = resolvedEntity.signature}
					{#if signature0 !== undefined && signature0 !== null}
						<TruncatedValue value={String((signature0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'status')}
			{@const signature0 = pendingEntity.signature}
			{#if signature0 !== undefined && signature0 !== null}
				<TruncatedValue value={String((signature0) ?? '')} />
			{/if}
		{:else}
			<ResourceBoundary resource={solanaTransaction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const signature0 = resolvedEntity.signature}
					{#if signature0 !== undefined && signature0 !== null}
						<TruncatedValue value={String((signature0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'status')}
			{@const status0 = pendingEntity.status}
			{#if status0 !== undefined && status0 !== null}
				<span data-text="muted">
					{String((status0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={solanaTransaction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status0 = resolvedEntity.status}
					{#if status0 !== undefined && status0 !== null}
						<span data-text="muted">
							{String((status0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Signature</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									signature: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const signature = resolvedEntity.signature}
							{#if signature !== undefined && signature !== null}
								<TruncatedValue value={String((signature) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>Status</dt>
							<dd>
								{String((status) ?? '')}
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
							slot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const slot = resolvedEntity.slot}
					{#if slot !== undefined && slot !== null}
						<div>
							<dt>Slot</dt>
							<dd>
								{String((slot) ?? '')}
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
							feeLamports: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeLamports = resolvedEntity.feeLamports}
					{#if feeLamports !== undefined && feeLamports !== null}
						<div>
							<dt>Fee</dt>
							<dd>
								{String((feeLamports) ?? '')}
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
							computeUnitsConsumed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const computeUnitsConsumed = resolvedEntity.computeUnitsConsumed}
					{#if computeUnitsConsumed !== undefined && computeUnitsConsumed !== null}
						<div>
							<dt>Compute units consumed</dt>
							<dd>
								{String((computeUnitsConsumed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(solanaBlock)}
					{#if solanaBlock != null && solanaBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>Block</dt>
							<dd>
								<SolanaBlockView
									selection={select(EntityType.SolanaBlock, solanaBlock[EntityMetaKey.Selector])}
									prefetched={solanaBlock}
									href={
										(
											solanaBlock[EntityMetaKey.Selector] != null && 'slot' in solanaBlock[EntityMetaKey.Selector]
											&& solanaBlock[EntityMetaKey.Selector].slot != null
											&& solanaBlock[EntityMetaKey.Selector] != null && '$network' in solanaBlock[EntityMetaKey.Selector] ?
												solanaBlock[EntityMetaKey.Selector].$network != null && 'caip2' in solanaBlock[EntityMetaKey.Selector].$network
												&& solanaBlock[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
												blockNumber: String(solanaBlock[EntityMetaKey.Selector].slot ?? ''),
												network: String(caip2StringFromValue(solanaBlock[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													solanaBlock[EntityMetaKey.Selector].$network != null && 'slug' in solanaBlock[EntityMetaKey.Selector].$network
													&& solanaBlock[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
													blockNumber: String(solanaBlock[EntityMetaKey.Selector].slot ?? ''),
													network: String(solanaBlock[EntityMetaKey.Selector].$network.slug ?? ''),
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
				resource={selection.$feePayer}
			>
				{#snippet children(solanaAccount)}
					{#if solanaAccount != null && solanaAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Fee payer</dt>
							<dd>
								<SolanaAccountView
									selection={select(EntityType.SolanaAccount, solanaAccount[EntityMetaKey.Selector])}
									prefetched={solanaAccount}
									href={
										(
											solanaAccount[EntityMetaKey.Selector] != null && 'pubkey' in solanaAccount[EntityMetaKey.Selector]
											&& solanaAccount[EntityMetaKey.Selector].pubkey != null
											&& solanaAccount[EntityMetaKey.Selector] != null && '$network' in solanaAccount[EntityMetaKey.Selector] ?
												solanaAccount[EntityMetaKey.Selector].$network != null && 'caip2' in solanaAccount[EntityMetaKey.Selector].$network
												&& solanaAccount[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
												accountId: String(solanaAccount[EntityMetaKey.Selector].pubkey ?? ''),
												network: String(caip2StringFromValue(solanaAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													solanaAccount[EntityMetaKey.Selector].$network != null && 'slug' in solanaAccount[EntityMetaKey.Selector].$network
													&& solanaAccount[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
													accountId: String(solanaAccount[EntityMetaKey.Selector].pubkey ?? ''),
													network: String(solanaAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
								:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				{@const solanaTransactionSolanaInstructionsViewInstructionsResource = selection
		.$$instructions({
			sources: [
				Source.Solana_JsonRpc,
			],
		})}
				<ResourceBoundary
					resource={solanaTransactionSolanaInstructionsViewInstructionsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<SolanaInstructionsView
							selection={solanaTransactionSolanaInstructionsViewInstructionsResource}
							countResource={solanaTransactionSolanaInstructionsViewInstructionsResource.count}
							title='Instructions'
							id='SolanaInstructionsView-instructions'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
