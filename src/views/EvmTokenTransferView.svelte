<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { EvmTokenStandard } from '$/constants/Evm.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.EvmTokenTransfer>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.EvmTokenTransfer>
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
	const evmTokenTransfer = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			standard: true,
			amount: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			standard: true,
			amount: true,
		},
	}))
	const titleFallback = $derived((String((pendingEntity.indexInLog) ?? '') ? 'Transfer #' + String((pendingEntity.indexInLog) ?? '') : '') || 'Token transfer')
	const viewDomId = $derived('evm-token-transfer-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.indexInLog ?? '')}
	href={
		href ?? (
			selection.entitySelector != null && 'indexInLog' in selection.entitySelector
			&& selection.entitySelector.indexInLog != null
			&& selection.entitySelector != null && '$log' in selection.entitySelector
			&& selection.entitySelector.$log != null && 'indexInTransaction' in selection.entitySelector.$log
			&& selection.entitySelector.$log.indexInTransaction != null
			&& selection.entitySelector.$log != null && '$transaction' in selection.entitySelector.$log
			&& selection.entitySelector.$log.$transaction != null && 'txHash' in selection.entitySelector.$log.$transaction
			&& selection.entitySelector.$log.$transaction.txHash != null
			&& selection.entitySelector.$log.$transaction != null && '$network' in selection.entitySelector.$log.$transaction ?
				selection.entitySelector.$log.$transaction.$network != null && 'caip2' in selection.entitySelector.$log.$transaction.$network
				&& selection.entitySelector.$log.$transaction.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/log/[indexInTransaction=nonNegativeInteger]/token-transfer/[transferIndex=nonNegativeInteger]', {
				transferIndex: String(selection.entitySelector.indexInLog ?? ''),
				indexInTransaction: String(selection.entitySelector.$log.indexInTransaction ?? ''),
				transactionId: String(selection.entitySelector.$log.$transaction.txHash ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$log.$transaction.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$log.$transaction.$network != null && 'slug' in selection.entitySelector.$log.$transaction.$network
					&& selection.entitySelector.$log.$transaction.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/log/[indexInTransaction=nonNegativeInteger]/token-transfer/[transferIndex=nonNegativeInteger]', {
					transferIndex: String(selection.entitySelector.indexInLog ?? ''),
					indexInTransaction: String(selection.entitySelector.$log.indexInTransaction ?? ''),
					transactionId: String(selection.entitySelector.$log.$transaction.txHash ?? ''),
					network: String(selection.entitySelector.$log.$transaction.$network.slug ?? ''),
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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'standard') && Object.hasOwn(prefetched, 'amount')}
			{[String((pendingEntity.standard) ?? ''), String((pendingEntity.amount) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={evmTokenTransfer}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.standard) ?? ''), String((resolvedEntity.amount) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = pendingEntity.indexInLog}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Index in log</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									indexInLog: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInLog = resolvedEntity.indexInLog}
							{#if indexInLog !== undefined && indexInLog !== null}
								<span>#</span>
								{String((indexInLog) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Log</dt>
				<dd>
					<EvmLogView
						selection={select(EntityType.EvmLog, selection.entitySelector.$log)}
						href={
							(
								selection.entitySelector.$log != null && 'indexInTransaction' in selection.entitySelector.$log
								&& selection.entitySelector.$log.indexInTransaction != null
								&& selection.entitySelector.$log != null && '$transaction' in selection.entitySelector.$log
								&& selection.entitySelector.$log.$transaction != null && 'txHash' in selection.entitySelector.$log.$transaction
								&& selection.entitySelector.$log.$transaction.txHash != null
								&& selection.entitySelector.$log.$transaction != null && '$network' in selection.entitySelector.$log.$transaction ?
									selection.entitySelector.$log.$transaction.$network != null && 'caip2' in selection.entitySelector.$log.$transaction.$network
									&& selection.entitySelector.$log.$transaction.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/log/[indexInTransaction=nonNegativeInteger]', {
									indexInTransaction: String(selection.entitySelector.$log.indexInTransaction ?? ''),
									transactionId: String(selection.entitySelector.$log.$transaction.txHash ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$log.$transaction.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$log.$transaction.$network != null && 'slug' in selection.entitySelector.$log.$transaction.$network
										&& selection.entitySelector.$log.$transaction.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/log/[indexInTransaction=nonNegativeInteger]', {
										indexInTransaction: String(selection.entitySelector.$log.indexInTransaction ?? ''),
										transactionId: String(selection.entitySelector.$log.$transaction.txHash ?? ''),
										network: String(selection.entitySelector.$log.$transaction.$network.slug ?? ''),
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
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Standard</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									standard: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const standard = resolvedEntity.standard}
							{#if standard !== undefined && standard !== null}
								{String((standard) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Amount</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									amount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const amount = resolvedEntity.amount}
							{#if amount !== undefined && amount !== null}
								<NumberValue
									value={amount}
								/>
							{/if}
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
										{#if tokenId !== undefined && tokenId !== null}
											<NumberValue
												value={tokenId}
											/>
										{/if}
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
					{#if evmAccount != null && evmAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>From</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(
											evmAccount[EntityMetaKey.Selector] != null && 'address' in evmAccount[EntityMetaKey.Selector]
											&& evmAccount[EntityMetaKey.Selector].address != null ?
												resolve('/account/[address=evmAddress]', {
											address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
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
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$to}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null && evmAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>To</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(
											evmAccount[EntityMetaKey.Selector] != null && 'address' in evmAccount[EntityMetaKey.Selector]
											&& evmAccount[EntityMetaKey.Selector].address != null ?
												resolve('/account/[address=evmAddress]', {
											address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
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
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$coinInstance}
			>
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null && evmCoinInstance[EntityMetaKey.Selector] != null}
						<div>
							<dt>Token</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									prefetched={evmCoinInstance}
									href={
										(
											evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency'
											&& evmCoinInstance[EntityMetaKey.Selector] != null && '$network' in evmCoinInstance[EntityMetaKey.Selector]
											&& evmCoinInstance[EntityMetaKey.Selector].$network != null && 'caip2' in evmCoinInstance[EntityMetaKey.Selector].$network
											&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2 != null && 'reference' in evmCoinInstance[EntityMetaKey.Selector].$network.caip2
											&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference != null ?
												resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
											chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
											coinInstanceSlug: String('native'),
										})
										:
												evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token'
												&& evmCoinInstance[EntityMetaKey.Selector] != null && '$contract' in evmCoinInstance[EntityMetaKey.Selector]
												&& evmCoinInstance[EntityMetaKey.Selector].$contract != null && 'address' in evmCoinInstance[EntityMetaKey.Selector].$contract
												&& evmCoinInstance[EntityMetaKey.Selector].$contract.address != null
												&& evmCoinInstance[EntityMetaKey.Selector] != null && '$network' in evmCoinInstance[EntityMetaKey.Selector]
												&& evmCoinInstance[EntityMetaKey.Selector].$network != null && 'caip2' in evmCoinInstance[EntityMetaKey.Selector].$network
												&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2 != null && 'reference' in evmCoinInstance[EntityMetaKey.Selector].$network.caip2
												&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference != null ?
													resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
												coinInstanceSlug: String(evmCoinInstance[EntityMetaKey.Selector].$contract.address ?? ''),
												chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
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
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$tokenContract}
				>
					{#snippet children(evmContract)}
						{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
							<div>
								<dt>Token contract</dt>
								<dd>
									<EvmContractView
										selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
										prefetched={evmContract}
										href={
											(
												evmContract[EntityMetaKey.Selector] != null && 'address' in evmContract[EntityMetaKey.Selector]
												&& evmContract[EntityMetaKey.Selector].address != null
												&& evmContract[EntityMetaKey.Selector] != null && '$network' in evmContract[EntityMetaKey.Selector] ?
													evmContract[EntityMetaKey.Selector].$network != null && 'caip2' in evmContract[EntityMetaKey.Selector].$network
													&& evmContract[EntityMetaKey.Selector].$network.caip2 != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
													address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
													network: String(caip2StringFromValue(evmContract[EntityMetaKey.Selector].$network.caip2) ?? ''),
												})
												:
														evmContract[EntityMetaKey.Selector].$network != null && 'slug' in evmContract[EntityMetaKey.Selector].$network
														&& evmContract[EntityMetaKey.Selector].$network.slug != null ?
															resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
														address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
														network: String(evmContract[EntityMetaKey.Selector].$network.slug ?? ''),
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
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								tokenSymbol: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const tokenSymbol = resolvedEntity.tokenSymbol}
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
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								tokenName: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const tokenName = resolvedEntity.tokenName}
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
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								tokenDecimals: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const tokenDecimals = resolvedEntity.tokenDecimals}
						{#if tokenDecimals !== undefined && tokenDecimals !== null}
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
