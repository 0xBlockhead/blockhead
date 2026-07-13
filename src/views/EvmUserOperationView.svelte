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
			selection: EntityProxyResource<typeof schema, EntityType.EvmUserOperation>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmUserOperation>>
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
		sources: [
			Source.Blockscout_Rest,
		],
		fields: {
			successful: true,
			timestampMs: true,
			fee: true,
			nonce: true,
			$bundledTransaction: true,
			$block: true,
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
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined && pendingEntity.hash !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/user-operation/[userOperationHash=userOperationHash]', {
			network: String(pendingEntity.$network.slug ?? ''),
			userOperationHash: String(pendingEntity.hash ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmUserOperation}>
			{#snippet Pending()}
				{@const hash0 = pendingEntity.hash}
				{#if hash0 !== undefined && hash0 !== null}
					<TruncatedValue value={String((hash0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const hash0 = resolvedEntity.hash}
				{#if hash0 !== undefined && hash0 !== null}
					<TruncatedValue value={String((hash0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmUserOperation}>
			{#snippet Pending()}
				{@const hash0 = pendingEntity.hash}
				{#if hash0 !== undefined && hash0 !== null}
					<TruncatedValue value={String((hash0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const hash0 = resolvedEntity.hash}
				{#if hash0 !== undefined && hash0 !== null}
					<TruncatedValue value={String((hash0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={evmUserOperation}>
			{#snippet Pending()}
				{@const successful0 = pendingEntity.successful}
				{#if successful0 !== undefined && successful0 !== null}
					<span data-text="muted">
						{successful0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}

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
								sources: [
									Source.Blockscout_Rest,
								],
								fields: {
									hash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const hash = pendingEntity.hash}
							{#if hash !== undefined && hash !== null}
								<TruncatedValue value={String((hash) ?? '')} />
							{/if}
						{/snippet}

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
						sources: [
							Source.Blockscout_Rest,
						],
						fields: {
							successful: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const successful = pendingEntity.successful}
					{#if successful !== undefined && successful !== null}
						<div>
							<dt>Successful</dt>
							<dd>
								{successful ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						sources: [
							Source.Blockscout_Rest,
						],
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Blockscout_Rest,
						],
						fields: {
							fee: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fee = pendingEntity.fee}
					{#if fee !== undefined && fee !== null}
						<div>
							<dt>Fee</dt>
							<dd>
								{String((fee) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						sources: [
							Source.Blockscout_Rest,
						],
						fields: {
							nonce: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nonce = pendingEntity.nonce}
					{#if nonce !== undefined && nonce !== null}
						<div>
							<dt>Nonce</dt>
							<dd>
								<NumberValue value={Number(nonce)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nonce = resolvedEntity.nonce}
					{#if nonce !== undefined && nonce !== null}
						<div>
							<dt>Nonce</dt>
							<dd>
								<NumberValue value={Number(nonce)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: [
								Source.Blockscout_Rest,
							],
							fields: {
								entryPointVersion: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const entryPointVersion = pendingEntity.entryPointVersion}
						{#if entryPointVersion !== undefined && entryPointVersion !== null}
							<div>
								<dt>Entry point version</dt>
								<dd>
									{String((entryPointVersion) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

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
							sources: [
								Source.Blockscout_Rest,
							],
							fields: {
								sponsorType: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const sponsorType = pendingEntity.sponsorType}
						{#if sponsorType !== undefined && sponsorType !== null}
							<div>
								<dt>Sponsor type</dt>
								<dd>
									{String((sponsorType) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

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
				{#snippet Pending()}{/snippet}

				{#snippet children(evmTransaction)}
					{#if evmTransaction != null && evmTransaction[EntityMetaKey.Selector] != null}
						<div>
							<dt>Bundled transaction</dt>
							<dd>
								<EvmTransactionView
									selection={select(EntityType.EvmTransaction, evmTransaction[EntityMetaKey.Selector])}
									prefetched={evmTransaction}
									href={
										(evmTransaction[EntityMetaKey.Selector].$network !== undefined && evmTransaction[EntityMetaKey.Selector].$network.slug !== undefined && evmTransaction[EntityMetaKey.Selector].txHash !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
											network: String(evmTransaction[EntityMetaKey.Selector].$network.slug ?? ''),
											transactionId: String(evmTransaction[EntityMetaKey.Selector].txHash ?? ''),
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
				{#snippet Pending()}{/snippet}

				{#snippet children(evmBlock)}
					{#if evmBlock != null && evmBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>Bundled block</dt>
							<dd>
								<EvmBlockView
									selection={select(EntityType.EvmBlock, evmBlock[EntityMetaKey.Selector])}
									prefetched={evmBlock}
									href={
										(evmBlock[EntityMetaKey.Selector].$network !== undefined && evmBlock[EntityMetaKey.Selector].$network.slug !== undefined && evmBlock[EntityMetaKey.Selector].blockNumber !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
											network: String(evmBlock[EntityMetaKey.Selector].$network.slug ?? ''),
											blockNumber: String(evmBlock[EntityMetaKey.Selector].blockNumber ?? ''),
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
							{#snippet Pending()}{/snippet}

							{#snippet children(erc4337SmartAccount)}
								{#if erc4337SmartAccount != null && erc4337SmartAccount[EntityMetaKey.Selector] != null}
									<div>
										<dt>Sender</dt>
										<dd>
											<Erc4337SmartAccountView
												selection={select(EntityType.Erc4337SmartAccount, erc4337SmartAccount[EntityMetaKey.Selector])}
												prefetched={erc4337SmartAccount}
												href={
													(erc4337SmartAccount[EntityMetaKey.Selector].$network !== undefined && erc4337SmartAccount[EntityMetaKey.Selector].$network.slug !== undefined && erc4337SmartAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/smart-account/[address=evmAddress]', {
														network: String(erc4337SmartAccount[EntityMetaKey.Selector].$network.slug ?? ''),
														address: String(erc4337SmartAccount[EntityMetaKey.Selector].address ?? ''),
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
							{#snippet Pending()}{/snippet}

							{#snippet children(erc4337Paymaster)}
								{#if erc4337Paymaster != null && erc4337Paymaster[EntityMetaKey.Selector] != null}
									<div>
										<dt>Paymaster</dt>
										<dd>
											<Erc4337PaymasterView
												selection={select(EntityType.Erc4337Paymaster, erc4337Paymaster[EntityMetaKey.Selector])}
												prefetched={erc4337Paymaster}
												href={
													(erc4337Paymaster[EntityMetaKey.Selector].$network !== undefined && erc4337Paymaster[EntityMetaKey.Selector].$network.slug !== undefined && erc4337Paymaster[EntityMetaKey.Selector].address !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/paymaster/[address=evmAddress]', {
														network: String(erc4337Paymaster[EntityMetaKey.Selector].$network.slug ?? ''),
														address: String(erc4337Paymaster[EntityMetaKey.Selector].address ?? ''),
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
							{#snippet Pending()}{/snippet}

							{#snippet children(erc4337Bundler)}
								{#if erc4337Bundler != null && erc4337Bundler[EntityMetaKey.Selector] != null}
									<div>
										<dt>Bundler</dt>
										<dd>
											<Erc4337BundlerView
												selection={select(EntityType.Erc4337Bundler, erc4337Bundler[EntityMetaKey.Selector])}
												prefetched={erc4337Bundler}
												href={
													(erc4337Bundler[EntityMetaKey.Selector].$network !== undefined && erc4337Bundler[EntityMetaKey.Selector].$network.slug !== undefined && erc4337Bundler[EntityMetaKey.Selector].address !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/bundler/[address=evmAddress]', {
														network: String(erc4337Bundler[EntityMetaKey.Selector].$network.slug ?? ''),
														address: String(erc4337Bundler[EntityMetaKey.Selector].address ?? ''),
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
							{#snippet Pending()}{/snippet}

							{#snippet children(evmContract)}
								{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
									<div>
										<dt>EntryPoint</dt>
										<dd>
											<EvmContractView
												selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
												prefetched={evmContract}
												href={
													(evmContract[EntityMetaKey.Selector].$network !== undefined && evmContract[EntityMetaKey.Selector].$network.slug !== undefined && evmContract[EntityMetaKey.Selector].address !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
														network: String(evmContract[EntityMetaKey.Selector].$network.slug ?? ''),
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
					</dl>
				{/snippet}

				{#snippet SectionGasFees({ id, label })}
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
							{#snippet Pending()}
								{@const callGasLimit = pendingEntity.callGasLimit}
								{#if callGasLimit !== undefined && callGasLimit !== null}
									<div>
										<dt>Call gas limit</dt>
										<dd>
											<NumberValue value={Number(callGasLimit)} />
										</dd>
									</div>
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const callGasLimit = resolvedEntity.callGasLimit}
								{#if callGasLimit !== undefined && callGasLimit !== null}
									<div>
										<dt>Call gas limit</dt>
										<dd>
											<NumberValue value={Number(callGasLimit)} />
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
							{#snippet Pending()}
								{@const verificationGasLimit = pendingEntity.verificationGasLimit}
								{#if verificationGasLimit !== undefined && verificationGasLimit !== null}
									<div>
										<dt>Verification gas limit</dt>
										<dd>
											<NumberValue value={Number(verificationGasLimit)} />
										</dd>
									</div>
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const verificationGasLimit = resolvedEntity.verificationGasLimit}
								{#if verificationGasLimit !== undefined && verificationGasLimit !== null}
									<div>
										<dt>Verification gas limit</dt>
										<dd>
											<NumberValue value={Number(verificationGasLimit)} />
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
							{#snippet Pending()}
								{@const preVerificationGas = pendingEntity.preVerificationGas}
								{#if preVerificationGas !== undefined && preVerificationGas !== null}
									<div>
										<dt>Pre-verification gas</dt>
										<dd>
											<NumberValue value={Number(preVerificationGas)} />
										</dd>
									</div>
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const preVerificationGas = resolvedEntity.preVerificationGas}
								{#if preVerificationGas !== undefined && preVerificationGas !== null}
									<div>
										<dt>Pre-verification gas</dt>
										<dd>
											<NumberValue value={Number(preVerificationGas)} />
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
							{#snippet Pending()}
								{@const maxFeePerGas = pendingEntity.maxFeePerGas}
								{#if maxFeePerGas !== undefined && maxFeePerGas !== null}
									<div>
										<dt>Max fee per gas</dt>
										<dd>
											<NumberValue value={Number(maxFeePerGas)} />
										</dd>
									</div>
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const maxFeePerGas = resolvedEntity.maxFeePerGas}
								{#if maxFeePerGas !== undefined && maxFeePerGas !== null}
									<div>
										<dt>Max fee per gas</dt>
										<dd>
											<NumberValue value={Number(maxFeePerGas)} />
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
							{#snippet Pending()}
								{@const maxPriorityFeePerGas = pendingEntity.maxPriorityFeePerGas}
								{#if maxPriorityFeePerGas !== undefined && maxPriorityFeePerGas !== null}
									<div>
										<dt>Max priority fee per gas</dt>
										<dd>
											<NumberValue value={Number(maxPriorityFeePerGas)} />
										</dd>
									</div>
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const maxPriorityFeePerGas = resolvedEntity.maxPriorityFeePerGas}
								{#if maxPriorityFeePerGas !== undefined && maxPriorityFeePerGas !== null}
									<div>
										<dt>Max priority fee per gas</dt>
										<dd>
											<NumberValue value={Number(maxPriorityFeePerGas)} />
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
							{#snippet Pending()}
								{@const gas = pendingEntity.gas}
								{#if gas !== undefined && gas !== null}
									<div>
										<dt>Gas</dt>
										<dd>
											<NumberValue value={Number(gas)} />
										</dd>
									</div>
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const gas = resolvedEntity.gas}
								{#if gas !== undefined && gas !== null}
									<div>
										<dt>Gas</dt>
										<dd>
											<NumberValue value={Number(gas)} />
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
							{#snippet Pending()}
								{@const gasUsed = pendingEntity.gasUsed}
								{#if gasUsed !== undefined && gasUsed !== null}
									<div>
										<dt>Gas used</dt>
										<dd>
											<NumberValue value={Number(gasUsed)} />
										</dd>
									</div>
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const gasUsed = resolvedEntity.gasUsed}
								{#if gasUsed !== undefined && gasUsed !== null}
									<div>
										<dt>Gas used</dt>
										<dd>
											<NumberValue value={Number(gasUsed)} />
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
							{#snippet Pending()}
								{@const gasPrice = pendingEntity.gasPrice}
								{#if gasPrice !== undefined && gasPrice !== null}
									<div>
										<dt>Gas price</dt>
										<dd>
											<NumberValue value={Number(gasPrice)} />
										</dd>
									</div>
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const gasPrice = resolvedEntity.gasPrice}
								{#if gasPrice !== undefined && gasPrice !== null}
									<div>
										<dt>Gas price</dt>
										<dd>
											<NumberValue value={Number(gasPrice)} />
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dl>
				{/snippet}

				{#snippet SectionPayloads({ id, label })}
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
							{#snippet Pending()}
								{@const initCode = pendingEntity.initCode}
								{#if initCode !== undefined && initCode !== null}
									<div>
										<dt>Init code</dt>
										<dd>
											<TruncatedValue value={String((initCode) ?? '')} />
										</dd>
									</div>
								{/if}
							{/snippet}

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
							{#snippet Pending()}
								{@const callData = pendingEntity.callData}
								{#if callData !== undefined && callData !== null}
									<div>
										<dt>Call data</dt>
										<dd>
											<TruncatedValue value={String((callData) ?? '')} />
										</dd>
									</div>
								{/if}
							{/snippet}

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
							{#snippet Pending()}
								{@const paymasterAndData = pendingEntity.paymasterAndData}
								{#if paymasterAndData !== undefined && paymasterAndData !== null}
									<div>
										<dt>Paymaster data</dt>
										<dd>
											<TruncatedValue value={String((paymasterAndData) ?? '')} />
										</dd>
									</div>
								{/if}
							{/snippet}

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
							{#snippet Pending()}
								{@const signature = pendingEntity.signature}
								{#if signature !== undefined && signature !== null}
									<div>
										<dt>Signature</dt>
										<dd>
											<TruncatedValue value={String((signature) ?? '')} />
										</dd>
									</div>
								{/if}
							{/snippet}

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
				{/snippet}
			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
