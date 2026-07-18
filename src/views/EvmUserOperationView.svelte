<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.EvmUserOperation>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.EvmUserOperation>>
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
	const evmUserOperation = $derived(selection({
		sources: selection.sources,
		fields: {
			successful: true,
			timestampMs: true,
			fee: true,
			nonce: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.hash) ?? '')].filter(Boolean).join(' ') || 'User operation')
	const viewDomId = $derived('evm-user-operation-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import Erc4337SmartAccountView from '$/views/Erc4337SmartAccountView.svelte'
	import Erc4337PaymasterView from '$/views/Erc4337PaymasterView.svelte'
	import Erc4337BundlerView from '$/views/Erc4337BundlerView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmUserOperation}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.hash !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/user-operation/[userOperationHash=userOperationHash]', {
			userOperationHash: String(pendingEntity.hash ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$network.caip2) ?? ''),
		}) : pendingEntity.hash !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/user-operation/[userOperationHash=userOperationHash]', {
			userOperationHash: String(pendingEntity.hash ?? ''),
			network: String(pendingEntity.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const hash0 = pendingEntity.hash}
					{#if hash0 !== undefined && hash0 !== null}
						<TruncatedValue value={String((hash0) ?? '')} />
					{/if}
		{:else}
			<ResourceBoundary resource={evmUserOperation}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const hash0 = resolvedEntity.hash}
					{#if hash0 !== undefined && hash0 !== null}
						<TruncatedValue value={String((hash0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const hash0 = pendingEntity.hash}
					{#if hash0 !== undefined && hash0 !== null}
						<TruncatedValue value={String((hash0) ?? '')} />
					{/if}
		{:else}
			<ResourceBoundary resource={evmUserOperation}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const hash0 = resolvedEntity.hash}
					{#if hash0 !== undefined && hash0 !== null}
						<TruncatedValue value={String((hash0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const successful0 = pendingEntity.successful}
			{#if successful0 !== undefined && successful0 !== null}
				<span data-text="muted">
					{successful0 ? 'Yes' : 'No'}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={evmUserOperation}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const successful0 = resolvedEntity.successful}
					{#if successful0 !== undefined && successful0 !== null}
						<span data-text="muted">
							{successful0 ? 'Yes' : 'No'}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Operation hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									hash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const hash = resolvedEntity.hash}
							{#if hash !== undefined && hash !== null}
								<TruncatedValue value={String((hash) ?? '')} />
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
							successful: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const successful = resolvedEntity.successful}
					{#if successful !== undefined && successful !== null}
						<div>
							<dt>Successful</dt>
							<dd>
								{successful ? 'Yes' : 'No'}
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
							timestampMs: true,
						},
					})
				}
			>
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							fee: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fee = resolvedEntity.fee}
					{#if fee !== undefined && fee !== null}
						<div>
							<dt>Fee</dt>
							<dd>
								{String((fee) ?? '')}
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
							nonce: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nonce = resolvedEntity.nonce}
					{#if nonce !== undefined && nonce !== null}
						<div>
							<dt>Nonce</dt>
							<dd>
								<NumberValue
									value={nonce}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								entryPointVersion: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const entryPointVersion = resolvedEntity.entryPointVersion}
						{#if entryPointVersion !== undefined && entryPointVersion !== null}
							<div>
								<dt>Entry point version</dt>
								<dd>
									{String((entryPointVersion) ?? '')}
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
								sponsorType: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const sponsorType = resolvedEntity.sponsorType}
						{#if sponsorType !== undefined && sponsorType !== null}
							<div>
								<dt>Sponsor type</dt>
								<dd>
									{String((sponsorType) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection.$bundledTransaction({
						sources: [
							Source.Blockscout_Rest,
						],
					})
				}
			>
				{#snippet children(evmTransaction)}
					{#if evmTransaction != null && evmTransaction[EntityMetaKey.Selector] != null}
						<div>
							<dt>Bundled transaction</dt>
							<dd>
								<EvmTransactionView
									selection={select(EntityType.EvmTransaction, evmTransaction[EntityMetaKey.Selector])}
									prefetched={evmTransaction}
									href={
										(evmTransaction[EntityMetaKey.Selector].txHash !== undefined && evmTransaction[EntityMetaKey.Selector].$network !== undefined && evmTransaction[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
											transactionId: String(evmTransaction[EntityMetaKey.Selector].txHash ?? ''),
											network: String(caip2StringFromValue(evmTransaction[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : evmTransaction[EntityMetaKey.Selector].txHash !== undefined && evmTransaction[EntityMetaKey.Selector].$network !== undefined && evmTransaction[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
											transactionId: String(evmTransaction[EntityMetaKey.Selector].txHash ?? ''),
											network: String(evmTransaction[EntityMetaKey.Selector].$network.slug ?? ''),
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
				resource={
					selection.$block({
						sources: [
							Source.Blockscout_Rest,
						],
					})
				}
			>
				{#snippet children(evmBlock)}
					{#if evmBlock != null && evmBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>Bundled block</dt>
							<dd>
								<EvmBlockView
									selection={select(EntityType.EvmBlock, evmBlock[EntityMetaKey.Selector])}
									prefetched={evmBlock}
									href={
										(evmBlock[EntityMetaKey.Selector].blockNumber !== undefined && evmBlock[EntityMetaKey.Selector].$network !== undefined && evmBlock[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
											blockNumber: String(evmBlock[EntityMetaKey.Selector].blockNumber ?? ''),
											network: String(caip2StringFromValue(evmBlock[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : evmBlock[EntityMetaKey.Selector].blockNumber !== undefined && evmBlock[EntityMetaKey.Selector].$network !== undefined && evmBlock[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
											blockNumber: String(evmBlock[EntityMetaKey.Selector].blockNumber ?? ''),
											network: String(evmBlock[EntityMetaKey.Selector].$network.slug ?? ''),
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
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-details-tabs'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'participants',
							label: 'Participants',
						},
						{
							id: 'gas-fees',
							label: 'Gas & fees',
						},
						{
							id: 'payloads',
							label: 'Payloads',
						},
					]
				}
				data-card
			>
				{#snippet SectionParticipants({ id, label })}
					<article id={`${id}-participants-fields`} data-column-item="flexible" data-card data-scroll-container>
					<dl data-column-item="center">
						<ResourceBoundary
							resource={
								selection.$sender({
									sources: [
										Source.Blockscout_Rest,
									],
								})
							}
						>
							{#snippet children(erc4337SmartAccount)}
								{#if erc4337SmartAccount != null && erc4337SmartAccount[EntityMetaKey.Selector] != null}
									<div>
										<dt>Sender</dt>
										<dd>
											<Erc4337SmartAccountView
												selection={select(EntityType.Erc4337SmartAccount, erc4337SmartAccount[EntityMetaKey.Selector])}
												prefetched={erc4337SmartAccount}
												href={
													(erc4337SmartAccount[EntityMetaKey.Selector].address !== undefined && erc4337SmartAccount[EntityMetaKey.Selector].$network !== undefined && erc4337SmartAccount[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/smart-account/[address=evmAddress]', {
														address: String(erc4337SmartAccount[EntityMetaKey.Selector].address ?? ''),
														network: String(caip2StringFromValue(erc4337SmartAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
													}) : erc4337SmartAccount[EntityMetaKey.Selector].address !== undefined && erc4337SmartAccount[EntityMetaKey.Selector].$network !== undefined && erc4337SmartAccount[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/smart-account/[address=evmAddress]', {
														address: String(erc4337SmartAccount[EntityMetaKey.Selector].address ?? ''),
														network: String(erc4337SmartAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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
							resource={
								selection.$paymaster({
									sources: [
										Source.Blockscout_Rest,
									],
								})
							}
						>
							{#snippet children(erc4337Paymaster)}
								{#if erc4337Paymaster != null && erc4337Paymaster[EntityMetaKey.Selector] != null}
									<div>
										<dt>Paymaster</dt>
										<dd>
											<Erc4337PaymasterView
												selection={select(EntityType.Erc4337Paymaster, erc4337Paymaster[EntityMetaKey.Selector])}
												prefetched={erc4337Paymaster}
												href={
													(erc4337Paymaster[EntityMetaKey.Selector].address !== undefined && erc4337Paymaster[EntityMetaKey.Selector].$network !== undefined && erc4337Paymaster[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/paymaster/[address=evmAddress]', {
														address: String(erc4337Paymaster[EntityMetaKey.Selector].address ?? ''),
														network: String(caip2StringFromValue(erc4337Paymaster[EntityMetaKey.Selector].$network.caip2) ?? ''),
													}) : erc4337Paymaster[EntityMetaKey.Selector].address !== undefined && erc4337Paymaster[EntityMetaKey.Selector].$network !== undefined && erc4337Paymaster[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/paymaster/[address=evmAddress]', {
														address: String(erc4337Paymaster[EntityMetaKey.Selector].address ?? ''),
														network: String(erc4337Paymaster[EntityMetaKey.Selector].$network.slug ?? ''),
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
							resource={
								selection.$bundler({
									sources: [
										Source.Blockscout_Rest,
									],
								})
							}
						>
							{#snippet children(erc4337Bundler)}
								{#if erc4337Bundler != null && erc4337Bundler[EntityMetaKey.Selector] != null}
									<div>
										<dt>Bundler</dt>
										<dd>
											<Erc4337BundlerView
												selection={select(EntityType.Erc4337Bundler, erc4337Bundler[EntityMetaKey.Selector])}
												prefetched={erc4337Bundler}
												href={
													(erc4337Bundler[EntityMetaKey.Selector].address !== undefined && erc4337Bundler[EntityMetaKey.Selector].$network !== undefined && erc4337Bundler[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/bundler/[address=evmAddress]', {
														address: String(erc4337Bundler[EntityMetaKey.Selector].address ?? ''),
														network: String(caip2StringFromValue(erc4337Bundler[EntityMetaKey.Selector].$network.caip2) ?? ''),
													}) : erc4337Bundler[EntityMetaKey.Selector].address !== undefined && erc4337Bundler[EntityMetaKey.Selector].$network !== undefined && erc4337Bundler[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/bundler/[address=evmAddress]', {
														address: String(erc4337Bundler[EntityMetaKey.Selector].address ?? ''),
														network: String(erc4337Bundler[EntityMetaKey.Selector].$network.slug ?? ''),
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
							resource={
								selection.$entryPoint({
									sources: [
										Source.Blockscout_Rest,
									],
								})
							}
						>
							{#snippet children(evmContract)}
								{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
									<div>
										<dt>EntryPoint</dt>
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
					</dl>

					</article>
				{/snippet}

				{#snippet SectionGasFees({ id, label })}
					<article id={`${id}-gas-fees-fields`} data-column-item="flexible" data-card data-scroll-container>
					<dl data-column-item="center">
						<ResourceBoundary
							resource={
								selection({
									sources: [
										Source.Blockscout_Rest,
									],
									fields: {
										callGasLimit: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const callGasLimit = resolvedEntity.callGasLimit}
								{#if callGasLimit !== undefined && callGasLimit !== null}
									<div>
										<dt>Call gas limit</dt>
										<dd>
											<NumberValue
												value={callGasLimit}
											/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={
								selection({
									sources: [
										Source.Blockscout_Rest,
									],
									fields: {
										verificationGasLimit: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const verificationGasLimit = resolvedEntity.verificationGasLimit}
								{#if verificationGasLimit !== undefined && verificationGasLimit !== null}
									<div>
										<dt>Verification gas limit</dt>
										<dd>
											<NumberValue
												value={verificationGasLimit}
											/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={
								selection({
									sources: [
										Source.Blockscout_Rest,
									],
									fields: {
										preVerificationGas: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const preVerificationGas = resolvedEntity.preVerificationGas}
								{#if preVerificationGas !== undefined && preVerificationGas !== null}
									<div>
										<dt>Pre-verification gas</dt>
										<dd>
											<NumberValue
												value={preVerificationGas}
											/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={
								selection({
									sources: [
										Source.Blockscout_Rest,
									],
									fields: {
										maxFeePerGas: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const maxFeePerGas = resolvedEntity.maxFeePerGas}
								{#if maxFeePerGas !== undefined && maxFeePerGas !== null}
									<div>
										<dt>Max fee per gas</dt>
										<dd>
											<NumberValue
												value={maxFeePerGas}
											/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={
								selection({
									sources: [
										Source.Blockscout_Rest,
									],
									fields: {
										maxPriorityFeePerGas: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const maxPriorityFeePerGas = resolvedEntity.maxPriorityFeePerGas}
								{#if maxPriorityFeePerGas !== undefined && maxPriorityFeePerGas !== null}
									<div>
										<dt>Max priority fee per gas</dt>
										<dd>
											<NumberValue
												value={maxPriorityFeePerGas}
											/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={
								selection({
									sources: [
										Source.Blockscout_Rest,
									],
									fields: {
										gas: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const gas = resolvedEntity.gas}
								{#if gas !== undefined && gas !== null}
									<div>
										<dt>Gas</dt>
										<dd>
											<NumberValue
												value={gas}
											/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={
								selection({
									sources: [
										Source.Blockscout_Rest,
									],
									fields: {
										gasUsed: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const gasUsed = resolvedEntity.gasUsed}
								{#if gasUsed !== undefined && gasUsed !== null}
									<div>
										<dt>Gas used</dt>
										<dd>
											<NumberValue
												value={gasUsed}
											/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={
								selection({
									sources: [
										Source.Blockscout_Rest,
									],
									fields: {
										gasPrice: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const gasPrice = resolvedEntity.gasPrice}
								{#if gasPrice !== undefined && gasPrice !== null}
									<div>
										<dt>Gas price</dt>
										<dd>
											<NumberValue
												value={gasPrice}
											/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dl>

					</article>
				{/snippet}

				{#snippet SectionPayloads({ id, label })}
					<article id={`${id}-payloads-fields`} data-column-item="flexible" data-card data-scroll-container>
					<dl data-column-item="center">
						<ResourceBoundary
							resource={
								selection({
									sources: [
										Source.Blockscout_Rest,
									],
									fields: {
										initCode: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const initCode = resolvedEntity.initCode}
								{#if initCode !== undefined && initCode !== null}
									<div>
										<dt>Init code</dt>
										<dd>
											<TruncatedValue value={String((initCode) ?? '')} />
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={
								selection({
									sources: [
										Source.Blockscout_Rest,
									],
									fields: {
										callData: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const callData = resolvedEntity.callData}
								{#if callData !== undefined && callData !== null}
									<div>
										<dt>Call data</dt>
										<dd>
											<TruncatedValue value={String((callData) ?? '')} />
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={
								selection({
									sources: [
										Source.Blockscout_Rest,
									],
									fields: {
										paymasterAndData: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const paymasterAndData = resolvedEntity.paymasterAndData}
								{#if paymasterAndData !== undefined && paymasterAndData !== null}
									<div>
										<dt>Paymaster data</dt>
										<dd>
											<TruncatedValue value={String((paymasterAndData) ?? '')} />
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={
								selection({
									sources: [
										Source.Blockscout_Rest,
									],
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
									<div>
										<dt>Signature</dt>
										<dd>
											<TruncatedValue value={String((signature) ?? '')} />
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dl>

					</article>
				{/snippet}
			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
