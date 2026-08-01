<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.EvmTokenTransfer>, 'prefetched'> = $props()

	const log = $derived(selection.entitySelector.$log)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Blockscout_Rest,
		],
	}))
	const evmTokenTransfer = $derived(viewSelection({
		fields: {
			standard: true,
			amount: true,
		},
	}))
	const titleFallback = $derived(`Transfer #${selection.entitySelector.indexInLog}`)


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmLogView from '$/views/EvmLogView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTokenTransfer}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	idDragPlainText={String(selection.entitySelector.indexInLog)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/log/[indexInTransaction=nonNegativeInteger]/(evmLog)/token-transfer/[transferIndex=nonNegativeInteger]',
				{
					network: (
						'caip2' in log.$transaction.$network ?
							caip2StringFromValue(log.$transaction.$network.caip2)
						:
							log.$transaction.$network.slug
					),
					transactionId: log.$transaction.txHash,
					indexInTransaction: String(log.indexInTransaction),
					transferIndex: String(selection.entitySelector.indexInLog),
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
		<ResourceBoundary resource={evmTokenTransfer}>
			{#snippet children(entity)}
				{[entity.standard, String(entity.amount)].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span data-badge="small">
			#{selection.entitySelector.indexInLog}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Index in log</dt>
				<dd>
					<span>#</span>
					{selection.entitySelector.indexInLog}
				</dd>
			</div>

			<div>
				<dt>Log</dt>
				<dd>
					<EvmLogView
						selection={select(EntityType.EvmLog, selection.entitySelector.$log)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Standard</dt>
				<dd>
					<ResourceBoundary
						resource={evmTokenTransfer}
					>
						{#snippet children(entity)}
							{entity.standard}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Amount</dt>
				<dd>
					<ResourceBoundary
						resource={evmTokenTransfer}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.amount}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ProjectionBoundary
				resource={selection.Nft}
			>
				{#snippet Applicable(projection)}
					{#if contentOpen}
						<div>
							<dt>Token ID</dt>
							<dd>
								<ResourceBoundary
									resource={projection.tokenId}
								>
									{#snippet children(tokenId)}
										<NumberValue
											value={tokenId}
										/>
									{/snippet}
								</ResourceBoundary>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ProjectionBoundary>

			<ResourceBoundary
				resource={selection.$from}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>From</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$to}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>To</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$coinInstance}
			>
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null}
						<div>
							<dt>Token</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$tokenContract}
				>
					{#snippet children(evmContract)}
						{#if evmContract != null}
							<div>
								<dt>Token contract</dt>
								<dd>
									<EvmContractView
										selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
										prefetched={evmContract}
										layout={EntityLayout.Value}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								tokenSymbol: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const tokenSymbol = entity.tokenSymbol}
						{#if tokenSymbol != null}
							<div>
								<dt>Token symbol</dt>
								<dd>
									{tokenSymbol}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								tokenName: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const tokenName = entity.tokenName}
						{#if tokenName != null}
							<div>
								<dt>Token name</dt>
								<dd>
									{tokenName}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								tokenDecimals: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const tokenDecimals = entity.tokenDecimals}
						{#if tokenDecimals != null}
							<div>
								<dt>Token decimals</dt>
								<dd>
									<NumberValue
										value={tokenDecimals}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}
</EntityView>
