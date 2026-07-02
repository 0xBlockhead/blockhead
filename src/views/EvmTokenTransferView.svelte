<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { EvmTokenStandard } from '$/constants/Evm.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmTokenTransfer>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmTokenTransfer>>
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

	const evmTokenTransfer = $derived(selection({
		sources: [
			Source.Blockscout_Rest,
		],
		fields: {
			standard: true,
			amount: true,
			$from: true,
			$to: true,
			$coinInstance: true,
			$tokenContract: true,
			...(open && {
				tokenId: true,
				tokenName: true,
				tokenSymbol: true,
				tokenDecimals: true,
			}),
		},
	}))
	const titleFallback = $derived((String((({ ...selection.entitySelector, ...prefetched }).indexInLog) ?? '') ? 'Transfer #' + String((({ ...selection.entitySelector, ...prefetched }).indexInLog) ?? '') : '') || 'Token transfer')
	const viewDomId = $derived('evm-token-transfer-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
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
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(({ ...selection.entitySelector, ...prefetched }).indexInLog ?? '')}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]/token-transfer/[indexInTransaction=nonNegativeInteger]/[indexInLog=nonNegativeInteger]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$log.$transaction.$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$log.$transaction.$network.caip2.reference)}`,
			transactionId: String(({ ...selection.entitySelector, ...prefetched }).$log.$transaction.txHash),
			indexInTransaction: String(({ ...selection.entitySelector, ...prefetched }).$log.indexInTransaction),
			indexInLog: String(({ ...selection.entitySelector, ...prefetched }).indexInLog),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{(String((({ ...selection.entitySelector, ...prefetched }).indexInLog) ?? '') ? 'Transfer #' + String((({ ...selection.entitySelector, ...prefetched }).indexInLog) ?? '') : '') || title || ['#' + String((selection.entitySelector.indexInLog) ?? '')].filter(Boolean).join(' ') || 'Token transfer'}
		{:else}
			<ResourceBoundary resource={evmTokenTransfer}>
				{#snippet Pending()}
					{(String((({ ...selection.entitySelector, ...prefetched }).indexInLog) ?? '') ? 'Transfer #' + String((({ ...selection.entitySelector, ...prefetched }).indexInLog) ?? '') : '') || title || ['#' + String((selection.entitySelector.indexInLog) ?? '')].filter(Boolean).join(' ') || 'Token transfer'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.standard) ?? ''), String((entity.amount) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).indexInLog}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Log</dt>
				<dd>
					<EvmLogView
						selection={select(EntityType.EvmLog, selection.entitySelector.$log)}
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]/log/[indexInTransaction=nonNegativeInteger]', {
								caip2: `${String(selection.entitySelector.$log.$transaction.$network.caip2.namespace)}:${String(selection.entitySelector.$log.$transaction.$network.caip2.reference)}`,
								transactionId: String(selection.entitySelector.$log.$transaction.txHash),
								indexInTransaction: String(selection.entitySelector.$log.indexInTransaction),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary resource={evmTokenTransfer}>
					{#snippet Pending()}
						{@const tokenId = prefetched.tokenId ?? selection.entitySelector.tokenId}
						{#if tokenId !== undefined && tokenId !== null}
							<div>
								<dt>Token ID</dt>
								<dd>
									<NumberValue value={Number(tokenId)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const tokenId = entity.tokenId ?? selection.entitySelector.tokenId ?? prefetched.tokenId}
						{#if tokenId !== undefined && tokenId !== null}
							<div>
								<dt>Token ID</dt>
								<dd>
									<NumberValue value={Number(tokenId)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmAccount, false>('$from')}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>From</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount.entitySelector)}
									prefetched={evmAccount}
									href={
										resolve('/(explore)/account/[address=evmAddress]', {
											address: String(evmAccount.entitySelector.address),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmAccount, false>('$to')}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>To</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount.entitySelector)}
									prefetched={evmAccount}
									href={
										resolve('/(explore)/account/[address=evmAddress]', {
											address: String(evmAccount.entitySelector.address),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmCoinInstance, false>('$coinInstance')}
			>
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null}
						<div>
							<dt>Token</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance.entitySelector)}
									prefetched={evmCoinInstance}
									href={
										resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
											chainId: String(evmCoinInstance.entitySelector.$network.caip2.reference),
											coinInstanceSlug: String(
												(
													evmCoinInstance.entitySelector.type === 'NativeCurrency' ?
														'native'
													:
														evmCoinInstance.entitySelector.$contract.address
												)
											),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.EvmContract, false>('$tokenContract')}
				>
					{#snippet children(evmContract)}
						{#if evmContract != null}
							<div>
								<dt>Token contract</dt>
								<dd>
									<EvmContractView
										selection={select(EntityType.EvmContract, evmContract.entitySelector)}
										prefetched={evmContract}
										href={
											resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
												caip2: `${String(evmContract.entitySelector.$network.caip2.namespace)}:${String(evmContract.entitySelector.$network.caip2.reference)}`,
												address: String(evmContract.entitySelector.address),
											})
										}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={evmTokenTransfer}>
					{#snippet Pending()}
						{@const tokenSymbol = prefetched.tokenSymbol ?? selection.entitySelector.tokenSymbol}
						{#if tokenSymbol !== undefined && tokenSymbol !== null}
							<div>
								<dt>Token symbol</dt>
								<dd>
									{String((tokenSymbol) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const tokenSymbol = entity.tokenSymbol ?? selection.entitySelector.tokenSymbol ?? prefetched.tokenSymbol}
						{#if tokenSymbol !== undefined && tokenSymbol !== null}
							<div>
								<dt>Token symbol</dt>
								<dd>
									{String((tokenSymbol) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={evmTokenTransfer}>
					{#snippet Pending()}
						{@const tokenName = prefetched.tokenName ?? selection.entitySelector.tokenName}
						{#if tokenName !== undefined && tokenName !== null}
							<div>
								<dt>Token name</dt>
								<dd>
									{String((tokenName) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const tokenName = entity.tokenName ?? selection.entitySelector.tokenName ?? prefetched.tokenName}
						{#if tokenName !== undefined && tokenName !== null}
							<div>
								<dt>Token name</dt>
								<dd>
									{String((tokenName) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={evmTokenTransfer}>
					{#snippet Pending()}
						{@const tokenDecimals = prefetched.tokenDecimals ?? selection.entitySelector.tokenDecimals}
						{#if tokenDecimals !== undefined && tokenDecimals !== null}
							<div>
								<dt>Token decimals</dt>
								<dd>
									<NumberValue value={Number(tokenDecimals)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const tokenDecimals = entity.tokenDecimals ?? selection.entitySelector.tokenDecimals ?? prefetched.tokenDecimals}
						{#if tokenDecimals !== undefined && tokenDecimals !== null}
							<div>
								<dt>Token decimals</dt>
								<dd>
									<NumberValue value={Number(tokenDecimals)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}
</EntityView>
