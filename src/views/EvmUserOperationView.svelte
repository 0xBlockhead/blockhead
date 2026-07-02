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
			...(open && {
				$sender: true,
				$paymaster: true,
				$bundler: true,
				$entryPoint: true,
				entryPointVersion: true,
				sponsorType: true,
				callGasLimit: true,
				verificationGasLimit: true,
				preVerificationGas: true,
				maxFeePerGas: true,
				maxPriorityFeePerGas: true,
				gas: true,
				gasUsed: true,
				gasPrice: true,
				initCode: true,
				callData: true,
				paymasterAndData: true,
				signature: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).hash) ?? '')].filter(Boolean).join(' ') || 'User operation')
	const viewDomId = $derived('evm-user-operation-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import Erc4337SmartAccountView from '$/views/Erc4337SmartAccountView.svelte'
	import Erc4337PaymasterView from '$/views/Erc4337PaymasterView.svelte'
	import Erc4337BundlerView from '$/views/Erc4337BundlerView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmUserOperation}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/user-operation/[userOperationHash=userOperationHash]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.reference)}`,
			userOperationHash: String(({ ...selection.entitySelector, ...prefetched }).hash),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const hash0 = ({ ...selection.entitySelector, ...prefetched }).hash}
			{#if hash0 !== undefined && hash0 !== null}
				<TruncatedValue value={String(hash0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={evmUserOperation}>
				{#snippet Pending()}
					{@const hash0 = ({ ...selection.entitySelector, ...prefetched }).hash}
					{#if hash0 !== undefined && hash0 !== null}
						<TruncatedValue value={String(hash0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const hash0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).hash}
					{#if hash0 !== undefined && hash0 !== null}
						<TruncatedValue value={String(hash0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const hash0 = ({ ...selection.entitySelector, ...prefetched }).hash}
			{#if hash0 !== undefined && hash0 !== null}
				<TruncatedValue value={String(hash0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={evmUserOperation}>
				{#snippet Pending()}
					{@const hash0 = ({ ...selection.entitySelector, ...prefetched }).hash}
					{#if hash0 !== undefined && hash0 !== null}
						<TruncatedValue value={String(hash0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const hash0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).hash}
					{#if hash0 !== undefined && hash0 !== null}
						<TruncatedValue value={String(hash0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const successful0 = prefetched.successful}
			{#if successful0 !== undefined && successful0 !== null}
				<span data-text="muted">
					{String((successful0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={evmUserOperation}>
				{#snippet Pending()}
					{@const successful0 = prefetched.successful}
					{#if successful0 !== undefined && successful0 !== null}
						<span data-text="muted">
							{String((successful0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const successful0 = entity.successful}
					{#if successful0 !== undefined && successful0 !== null}
						<span data-text="muted">
							{String((successful0) ?? '')}
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
					<EvmNetworkView
						selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
							}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary resource={evmUserOperation}>
				{#snippet Pending()}
					{@const timestampMs = prefetched.timestampMs ?? selection.entitySelector.timestampMs}
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
					{@const timestampMs = entity.timestampMs ?? selection.entitySelector.timestampMs ?? prefetched.timestampMs}
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
			<ResourceBoundary resource={evmUserOperation}>
				{#snippet Pending()}
					{@const fee = prefetched.fee ?? selection.entitySelector.fee}
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
					{@const fee = entity.fee ?? selection.entitySelector.fee ?? prefetched.fee}
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

			<ResourceBoundary resource={evmUserOperation}>
				{#snippet Pending()}
					{@const nonce = prefetched.nonce ?? selection.entitySelector.nonce}
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
					{@const nonce = entity.nonce ?? selection.entitySelector.nonce ?? prefetched.nonce}
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
				<ResourceBoundary resource={evmUserOperation}>
					{#snippet Pending()}
						{@const entryPointVersion = prefetched.entryPointVersion ?? selection.entitySelector.entryPointVersion}
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
						{@const entryPointVersion = entity.entryPointVersion ?? selection.entitySelector.entryPointVersion ?? prefetched.entryPointVersion}
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
				<ResourceBoundary resource={evmUserOperation}>
					{#snippet Pending()}
						{@const sponsorType = prefetched.sponsorType ?? selection.entitySelector.sponsorType}
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
						{@const sponsorType = entity.sponsorType ?? selection.entitySelector.sponsorType ?? prefetched.sponsorType}
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
				resource={selection[EntityProxyField]<EntityType.EvmTransaction, false>('$bundledTransaction')}
			>
				{#snippet children(evmTransaction)}
					{#if evmTransaction != null}
						<div>
							<dt>Bundled transaction</dt>
							<dd>
								<EvmTransactionView
									selection={select(EntityType.EvmTransaction, evmTransaction.entitySelector)}
									prefetched={evmTransaction}
									href={
										resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
											caip2: `${String(evmTransaction.entitySelector.$network.caip2.namespace)}:${String(evmTransaction.entitySelector.$network.caip2.reference)}`,
											transactionId: String(evmTransaction.entitySelector.txHash),
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
				resource={selection[EntityProxyField]<EntityType.EvmBlock, false>('$block')}
			>
				{#snippet children(evmBlock)}
					{#if evmBlock != null}
						<div>
							<dt>Bundled block</dt>
							<dd>
								<EvmBlockView
									selection={select(EntityType.EvmBlock, evmBlock.entitySelector)}
									prefetched={evmBlock}
									href={
										resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blocks)/block/[blockNumber=evmBlockNumber]', {
											caip2: `${String(evmBlock.entitySelector.$network.caip2.namespace)}:${String(evmBlock.entitySelector.$network.caip2.reference)}`,
											blockNumber: String(evmBlock.entitySelector.blockNumber),
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
							resource={selection[EntityProxyField]<EntityType.Erc4337SmartAccount, false>('$sender')}
						>
							{#snippet children(erc4337SmartAccount)}
								{#if erc4337SmartAccount != null}
									<div>
										<dt>Sender</dt>
										<dd>
											<Erc4337SmartAccountView
												selection={select(EntityType.Erc4337SmartAccount, erc4337SmartAccount.entitySelector)}
												prefetched={erc4337SmartAccount}
												href={
													resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/smart-account/[address=evmAddress]', {
														caip2: `${String(erc4337SmartAccount.entitySelector.caip2.namespace)}:${String(erc4337SmartAccount.entitySelector.caip2.reference)}`,
														address: String(erc4337SmartAccount.entitySelector.address),
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
							resource={selection[EntityProxyField]<EntityType.Erc4337Paymaster, false>('$paymaster')}
						>
							{#snippet children(erc4337Paymaster)}
								{#if erc4337Paymaster != null}
									<div>
										<dt>Paymaster</dt>
										<dd>
											<Erc4337PaymasterView
												selection={select(EntityType.Erc4337Paymaster, erc4337Paymaster.entitySelector)}
												prefetched={erc4337Paymaster}
												href={
													resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/paymaster/[address=evmAddress]', {
														caip2: `${String(erc4337Paymaster.entitySelector.caip2.namespace)}:${String(erc4337Paymaster.entitySelector.caip2.reference)}`,
														address: String(erc4337Paymaster.entitySelector.address),
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
							resource={selection[EntityProxyField]<EntityType.Erc4337Bundler, false>('$bundler')}
						>
							{#snippet children(erc4337Bundler)}
								{#if erc4337Bundler != null}
									<div>
										<dt>Bundler</dt>
										<dd>
											<Erc4337BundlerView
												selection={select(EntityType.Erc4337Bundler, erc4337Bundler.entitySelector)}
												prefetched={erc4337Bundler}
												href={
													resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/bundler/[address=evmAddress]', {
														caip2: `${String(erc4337Bundler.entitySelector.caip2.namespace)}:${String(erc4337Bundler.entitySelector.caip2.reference)}`,
														address: String(erc4337Bundler.entitySelector.address),
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
							resource={selection[EntityProxyField]<EntityType.EvmContract, false>('$entryPoint')}
						>
							{#snippet children(evmContract)}
								{#if evmContract != null}
									<div>
										<dt>EntryPoint</dt>
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
					</dl>
				{/snippet}

				{#snippet SectionGasFees({ id, label })}
					<dl data-column-item="center">
						<ResourceBoundary resource={evmUserOperation}>
							{#snippet Pending()}
								{@const callGasLimit = prefetched.callGasLimit ?? selection.entitySelector.callGasLimit}
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
								{@const callGasLimit = entity.callGasLimit ?? selection.entitySelector.callGasLimit ?? prefetched.callGasLimit}
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

						<ResourceBoundary resource={evmUserOperation}>
							{#snippet Pending()}
								{@const verificationGasLimit = prefetched.verificationGasLimit ?? selection.entitySelector.verificationGasLimit}
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
								{@const verificationGasLimit = entity.verificationGasLimit ?? selection.entitySelector.verificationGasLimit ?? prefetched.verificationGasLimit}
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

						<ResourceBoundary resource={evmUserOperation}>
							{#snippet Pending()}
								{@const preVerificationGas = prefetched.preVerificationGas ?? selection.entitySelector.preVerificationGas}
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
								{@const preVerificationGas = entity.preVerificationGas ?? selection.entitySelector.preVerificationGas ?? prefetched.preVerificationGas}
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

						<ResourceBoundary resource={evmUserOperation}>
							{#snippet Pending()}
								{@const maxFeePerGas = prefetched.maxFeePerGas ?? selection.entitySelector.maxFeePerGas}
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
								{@const maxFeePerGas = entity.maxFeePerGas ?? selection.entitySelector.maxFeePerGas ?? prefetched.maxFeePerGas}
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

						<ResourceBoundary resource={evmUserOperation}>
							{#snippet Pending()}
								{@const maxPriorityFeePerGas = prefetched.maxPriorityFeePerGas ?? selection.entitySelector.maxPriorityFeePerGas}
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
								{@const maxPriorityFeePerGas = entity.maxPriorityFeePerGas ?? selection.entitySelector.maxPriorityFeePerGas ?? prefetched.maxPriorityFeePerGas}
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

						<ResourceBoundary resource={evmUserOperation}>
							{#snippet Pending()}
								{@const gas = prefetched.gas ?? selection.entitySelector.gas}
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
								{@const gas = entity.gas ?? selection.entitySelector.gas ?? prefetched.gas}
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

						<ResourceBoundary resource={evmUserOperation}>
							{#snippet Pending()}
								{@const gasUsed = prefetched.gasUsed ?? selection.entitySelector.gasUsed}
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
								{@const gasUsed = entity.gasUsed ?? selection.entitySelector.gasUsed ?? prefetched.gasUsed}
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

						<ResourceBoundary resource={evmUserOperation}>
							{#snippet Pending()}
								{@const gasPrice = prefetched.gasPrice ?? selection.entitySelector.gasPrice}
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
								{@const gasPrice = entity.gasPrice ?? selection.entitySelector.gasPrice ?? prefetched.gasPrice}
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
						<ResourceBoundary resource={evmUserOperation}>
							{#snippet Pending()}
								{@const initCode = prefetched.initCode ?? selection.entitySelector.initCode}
								{#if initCode !== undefined && initCode !== null}
									<div>
										<dt>Init code</dt>
										<dd>
											<TruncatedValue value={String(initCode)} />
										</dd>
									</div>
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const initCode = entity.initCode ?? selection.entitySelector.initCode ?? prefetched.initCode}
								{#if initCode !== undefined && initCode !== null}
									<div>
										<dt>Init code</dt>
										<dd>
											<TruncatedValue value={String(initCode)} />
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary resource={evmUserOperation}>
							{#snippet Pending()}
								{@const callData = prefetched.callData ?? selection.entitySelector.callData}
								{#if callData !== undefined && callData !== null}
									<div>
										<dt>Call data</dt>
										<dd>
											<TruncatedValue value={String(callData)} />
										</dd>
									</div>
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const callData = entity.callData ?? selection.entitySelector.callData ?? prefetched.callData}
								{#if callData !== undefined && callData !== null}
									<div>
										<dt>Call data</dt>
										<dd>
											<TruncatedValue value={String(callData)} />
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary resource={evmUserOperation}>
							{#snippet Pending()}
								{@const paymasterAndData = prefetched.paymasterAndData ?? selection.entitySelector.paymasterAndData}
								{#if paymasterAndData !== undefined && paymasterAndData !== null}
									<div>
										<dt>Paymaster data</dt>
										<dd>
											<TruncatedValue value={String(paymasterAndData)} />
										</dd>
									</div>
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const paymasterAndData = entity.paymasterAndData ?? selection.entitySelector.paymasterAndData ?? prefetched.paymasterAndData}
								{#if paymasterAndData !== undefined && paymasterAndData !== null}
									<div>
										<dt>Paymaster data</dt>
										<dd>
											<TruncatedValue value={String(paymasterAndData)} />
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary resource={evmUserOperation}>
							{#snippet Pending()}
								{@const signature = prefetched.signature ?? selection.entitySelector.signature}
								{#if signature !== undefined && signature !== null}
									<div>
										<dt>Signature</dt>
										<dd>
											<TruncatedValue value={String(signature)} />
										</dd>
									</div>
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const signature = entity.signature ?? selection.entitySelector.signature ?? prefetched.signature}
								{#if signature !== undefined && signature !== null}
									<div>
										<dt>Signature</dt>
										<dd>
											<TruncatedValue value={String(signature)} />
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
