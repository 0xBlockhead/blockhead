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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
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
		},
	}))
	const titleFallback = $derived((String((selection.entitySelector.indexInLog ?? prefetched.indexInLog) ?? '') ? 'Transfer #' + String((selection.entitySelector.indexInLog ?? prefetched.indexInLog) ?? '') : '') || 'Token transfer')
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
	idDragPlainText={String(selection.entitySelector.indexInLog ?? prefetched.indexInLog ?? '')}
	href={
		href ?? (pendingEntity.$log !== undefined && pendingEntity.$log.$transaction !== undefined && pendingEntity.$log.$transaction.$network !== undefined && pendingEntity.$log.$transaction.$network.caip2 !== undefined && pendingEntity.$log.$transaction.$network.caip2.namespace !== undefined && pendingEntity.$log !== undefined && pendingEntity.$log.$transaction !== undefined && pendingEntity.$log.$transaction.$network !== undefined && pendingEntity.$log.$transaction.$network.caip2 !== undefined && pendingEntity.$log.$transaction.$network.caip2.reference !== undefined && pendingEntity.$log !== undefined && pendingEntity.$log.$transaction !== undefined && pendingEntity.$log.$transaction.txHash !== undefined && pendingEntity.$log !== undefined && pendingEntity.$log.indexInTransaction !== undefined && pendingEntity.indexInLog !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]/token-transfer/[indexInTransaction=nonNegativeInteger]/[indexInLog=nonNegativeInteger]', {
			caip2: `${String(pendingEntity.$log.$transaction.$network.caip2.namespace ?? '')}:${String(pendingEntity.$log.$transaction.$network.caip2.reference ?? '')}`,
			transactionId: String(pendingEntity.$log.$transaction.txHash ?? ''),
			indexInTransaction: String(pendingEntity.$log.indexInTransaction ?? ''),
			indexInLog: String(pendingEntity.indexInLog ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmTokenTransfer}>
			{#snippet Pending()}
				{(String((selection.entitySelector.indexInLog ?? prefetched.indexInLog) ?? '') ? 'Transfer #' + String((selection.entitySelector.indexInLog ?? prefetched.indexInLog) ?? '') : '') || title || [(String((selection.entitySelector.indexInLog ?? prefetched.indexInLog) ?? '') ? '#' + String((selection.entitySelector.indexInLog ?? prefetched.indexInLog) ?? '') : '')].filter(Boolean).join(' ') || 'Token transfer'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.standard) ?? ''), String((resolvedEntity.amount) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{@const serialValue = selection.entitySelector.indexInLog ?? prefetched.indexInLog}
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
							{@const indexInLog = selection.entitySelector.indexInLog ?? prefetched.indexInLog}
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
							(selection.entitySelector.$log.$transaction !== undefined && selection.entitySelector.$log.$transaction.$network !== undefined && selection.entitySelector.$log.$transaction.$network.caip2 !== undefined && selection.entitySelector.$log.$transaction.$network.caip2.namespace !== undefined && selection.entitySelector.$log.$transaction !== undefined && selection.entitySelector.$log.$transaction.$network !== undefined && selection.entitySelector.$log.$transaction.$network.caip2 !== undefined && selection.entitySelector.$log.$transaction.$network.caip2.reference !== undefined && selection.entitySelector.$log.$transaction !== undefined && selection.entitySelector.$log.$transaction.txHash !== undefined && selection.entitySelector.$log.indexInTransaction !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]/log/[indexInTransaction=nonNegativeInteger]', {
								caip2: `${String(selection.entitySelector.$log.$transaction.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$log.$transaction.$network.caip2.reference ?? '')}`,
								transactionId: String(selection.entitySelector.$log.$transaction.txHash ?? ''),
								indexInTransaction: String(selection.entitySelector.$log.indexInTransaction ?? ''),
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
							{@const standard = prefetched.standard}
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
							{@const amount = prefetched.amount}
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

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								tokenId: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const tokenId = prefetched.tokenId}
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
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const tokenId = resolvedEntity.tokenId}
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
										(evmAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/(explore)/account/[address=evmAddress]', {
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
				{#snippet children(evmAccount)}
					{#if evmAccount != null && evmAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>To</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(evmAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/(explore)/account/[address=evmAddress]', {
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
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null && evmCoinInstance[EntityMetaKey.Selector] != null}
						<div>
							<dt>Token</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									prefetched={evmCoinInstance}
									href={
										(evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined && (evmCoinInstance[EntityMetaKey.Selector].type !== undefined && (evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' ? true : evmCoinInstance[EntityMetaKey.Selector].$contract !== undefined && evmCoinInstance[EntityMetaKey.Selector].$contract.address !== undefined)) ? resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
											chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
											coinInstanceSlug: String((evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' ? 'native' : evmCoinInstance[EntityMetaKey.Selector].$contract.address)),
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
					{#snippet children(evmContract)}
						{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
							<div>
								<dt>Token contract</dt>
								<dd>
									<EvmContractView
										selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
										prefetched={evmContract}
										href={
											(evmContract[EntityMetaKey.Selector].$network !== undefined && evmContract[EntityMetaKey.Selector].$network.caip2 !== undefined && evmContract[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && evmContract[EntityMetaKey.Selector].$network !== undefined && evmContract[EntityMetaKey.Selector].$network.caip2 !== undefined && evmContract[EntityMetaKey.Selector].$network.caip2.reference !== undefined && evmContract[EntityMetaKey.Selector].address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
												caip2: `${String(evmContract[EntityMetaKey.Selector].$network.caip2.namespace ?? '')}:${String(evmContract[EntityMetaKey.Selector].$network.caip2.reference ?? '')}`,
												address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
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
						{@const tokenSymbol = prefetched.tokenSymbol}
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
						{@const tokenName = prefetched.tokenName}
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
						{@const tokenDecimals = prefetched.tokenDecimals}
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
