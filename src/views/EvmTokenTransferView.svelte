<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmTokenStandard } from '$/constants/Evm.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.EvmTokenTransfer>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.EvmTokenTransfer>>
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
	const evmTokenTransfer = $derived(selection({
		sources: [
			Source.Blockscout_Rest,
		],
		fields: {
			standard: true,
			amount: true,
		},
	}))
	const titleFallback = $derived((String((pendingEntity.indexInLog) ?? '') ? 'Transfer #' + String((pendingEntity.indexInLog) ?? '') : '') || 'Token transfer')
	const viewDomId = $derived('evm-token-transfer-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		href ?? (pendingEntity.indexInLog !== undefined && pendingEntity.$log !== undefined && pendingEntity.$log.indexInTransaction !== undefined && pendingEntity.$log.$transaction !== undefined && pendingEntity.$log.$transaction.txHash !== undefined && pendingEntity.$log.$transaction.$network !== undefined && pendingEntity.$log.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/log/[indexInTransaction=nonNegativeInteger]/token-transfer/[transferIndex=nonNegativeInteger]', {
			transferIndex: String(pendingEntity.indexInLog ?? ''),
			indexInTransaction: String(pendingEntity.$log.indexInTransaction ?? ''),
			transactionId: String(pendingEntity.$log.$transaction.txHash ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$log.$transaction.$network.caip2) ?? ''),
		}) : pendingEntity.indexInLog !== undefined && pendingEntity.$log !== undefined && pendingEntity.$log.indexInTransaction !== undefined && pendingEntity.$log.$transaction !== undefined && pendingEntity.$log.$transaction.txHash !== undefined && pendingEntity.$log.$transaction.$network !== undefined && pendingEntity.$log.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/log/[indexInTransaction=nonNegativeInteger]/token-transfer/[transferIndex=nonNegativeInteger]', {
			transferIndex: String(pendingEntity.indexInLog ?? ''),
			indexInTransaction: String(pendingEntity.$log.indexInTransaction ?? ''),
			transactionId: String(pendingEntity.$log.$transaction.txHash ?? ''),
			network: String(pendingEntity.$log.$transaction.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmTokenTransfer}>
			{#snippet Pending()}
				{(String((pendingEntity.indexInLog) ?? '') ? 'Transfer #' + String((pendingEntity.indexInLog) ?? '') : '') || title || [(String((pendingEntity.indexInLog) ?? '') ? '#' + String((pendingEntity.indexInLog) ?? '') : '')].filter(Boolean).join(' ') || 'Token transfer'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.standard) ?? ''), String((resolvedEntity.amount) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
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
								fields: {
									indexInLog: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const indexInLog = pendingEntity.indexInLog}
							{#if indexInLog !== undefined && indexInLog !== null}
								<span>#</span>
								{String((indexInLog) ?? '')}
							{/if}
						{/snippet}

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
						selection={select(EntityType.EvmLog, selection.entitySelector.$log, {})}
						href={
							(selection.entitySelector.$log.indexInTransaction !== undefined && selection.entitySelector.$log.$transaction !== undefined && selection.entitySelector.$log.$transaction.txHash !== undefined && selection.entitySelector.$log.$transaction.$network !== undefined && selection.entitySelector.$log.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/log/[indexInTransaction=nonNegativeInteger]', {
								indexInTransaction: String(selection.entitySelector.$log.indexInTransaction ?? ''),
								transactionId: String(selection.entitySelector.$log.$transaction.txHash ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$log.$transaction.$network.caip2) ?? ''),
							}) : selection.entitySelector.$log.indexInTransaction !== undefined && selection.entitySelector.$log.$transaction !== undefined && selection.entitySelector.$log.$transaction.txHash !== undefined && selection.entitySelector.$log.$transaction.$network !== undefined && selection.entitySelector.$log.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/log/[indexInTransaction=nonNegativeInteger]', {
								indexInTransaction: String(selection.entitySelector.$log.indexInTransaction ?? ''),
								transactionId: String(selection.entitySelector.$log.$transaction.txHash ?? ''),
								network: String(selection.entitySelector.$log.$transaction.$network.slug ?? ''),
							}) : undefined)
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
								fields: {
									standard: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const standard = pendingEntity.standard}
							{#if standard !== undefined && standard !== null}
								{String((standard) ?? '')}
							{/if}
						{/snippet}

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

			<ProjectionBoundary
				resource={selection.Nft}
			>
				{#snippet Applicable(projection)}
					{#if contentOpen}
						<div>
							<dt>Token ID</dt>
							<dd>
								<ResourceBoundary
									resource={
										projection.tokenId({
											fields: {
												tokenId: true,
											},
										})
									}
								>
									{#snippet Pending()}{/snippet}
									{#snippet children(tokenId)}
										{#if tokenId !== undefined && tokenId !== null}
											<NumberValue value={Number(tokenId)} />
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
				{#snippet Pending()}{/snippet}

				{#snippet children(evmAccount)}
					{#if evmAccount != null && evmAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>From</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(evmAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/account/[address=evmAddress]', {
											address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
										}) : undefined)
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
				{#snippet Pending()}{/snippet}

				{#snippet children(evmAccount)}
					{#if evmAccount != null && evmAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>To</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(evmAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/account/[address=evmAddress]', {
											address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
										}) : undefined)
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
				{#snippet Pending()}{/snippet}

				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null && evmCoinInstance[EntityMetaKey.Selector] != null}
						<div>
							<dt>Token</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									prefetched={evmCoinInstance}
									href={
										(evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
											chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
											coinInstanceSlug: String('native' ?? ''),
										}) : evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].$contract !== undefined && evmCoinInstance[EntityMetaKey.Selector].$contract.address !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
											coinInstanceSlug: String(evmCoinInstance[EntityMetaKey.Selector].$contract.address ?? ''),
											chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
										}) : undefined)
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
					{#snippet Pending()}{/snippet}

					{#snippet children(evmContract)}
						{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
							<div>
								<dt>Token contract</dt>
								<dd>
									<EvmContractView
										selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
										prefetched={evmContract}
										href={
											(evmContract[EntityMetaKey.Selector].address !== undefined && evmContract[EntityMetaKey.Selector].$network !== undefined && evmContract[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
												address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
												network: String(caip2StringFromValue(evmContract[EntityMetaKey.Selector].$network.caip2) ?? ''),
											}) : evmContract[EntityMetaKey.Selector].address !== undefined && evmContract[EntityMetaKey.Selector].$network !== undefined && evmContract[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
												address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
												network: String(evmContract[EntityMetaKey.Selector].$network.slug ?? ''),
											}) : undefined)
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
							sources: [
								Source.Blockscout_Rest,
								Source.Etherscan_Rest,
							],
							fields: {
								tokenSymbol: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const tokenSymbol = pendingEntity.tokenSymbol}
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
							sources: [
								Source.Blockscout_Rest,
								Source.Etherscan_Rest,
							],
							fields: {
								tokenName: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const tokenName = pendingEntity.tokenName}
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
							sources: [
								Source.Blockscout_Rest,
								Source.Etherscan_Rest,
							],
							fields: {
								tokenDecimals: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const tokenDecimals = pendingEntity.tokenDecimals}
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
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const tokenDecimals = resolvedEntity.tokenDecimals}
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
