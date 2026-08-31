<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.EvmUserOperation>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Blockscout_Rest,
		],
	}))
	const evmUserOperation = $derived(viewSelection({
		fields: {
			successful: true,
			timestampMs: true,
			fee: true,
			nonce: true,
		},
	}))
	const viewDomId = $derived('evm-user-operation-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? (selection.entitySelector.hash || 'User operation')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/user-operation/[userOperationHash=userOperationHash]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					userOperationHash: selection.entitySelector.hash,
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
		<TruncatedValue value={selection.entitySelector.hash} />
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.hash} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={evmUserOperation}>
			{#snippet children(entity)}
				{@const successful = entity.successful}
				{#if successful != null}
					<span data-text="muted">
						{successful ? 'Yes' : 'No'}
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
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Operation hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.hash} />
				</dd>
			</div>

			<ResourceBoundary
				resource={evmUserOperation}
			>
				{#snippet children(entity)}
					{@const successful = entity.successful}
					{#if successful != null}
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
				resource={evmUserOperation}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={evmUserOperation}
			>
				{#snippet children(entity)}
					{@const fee = entity.fee}
					{#if fee != null}
						<div>
							<dt>Fee</dt>
							<dd>
								{fee}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={evmUserOperation}
			>
				{#snippet children(entity)}
					{@const nonce = entity.nonce}
					{#if nonce != null}
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
						viewSelection({
							fields: {
								entryPointVersion: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const entryPointVersion = entity.entryPointVersion}
						{#if entryPointVersion != null}
							<div>
								<dt>Entry point version</dt>
								<dd>
									{entryPointVersion}
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
								sponsorType: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const sponsorType = entity.sponsorType}
						{#if sponsorType != null}
							<div>
								<dt>Sponsor type</dt>
								<dd>
									{sponsorType}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$bundledTransaction}
			>
				{#snippet children(evmTransaction)}
					{#if evmTransaction != null}
						<div>
							<dt>Bundled transaction</dt>
							<dd>
								<EvmTransactionView
									selection={select(EntityType.EvmTransaction, evmTransaction[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(evmBlock)}
					{#if evmBlock != null}
						{@const evmBlockInitial = untrack(() => evmBlock)}
						<div>
							<dt>Bundled block</dt>
							<dd>
								<EvmBlockView
									selection={select(EntityType.EvmBlock, (evmBlock ?? evmBlockInitial)[EntityMetaKey.Selector])}
									prefetched={evmBlock ?? evmBlockInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
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
							resource={selection.$sender}
						>
							{#snippet children(erc4337SmartAccount)}
								{#if erc4337SmartAccount != null}
									<div>
										<dt>Sender</dt>
										<dd>
											<Erc4337SmartAccountView
												selection={select(EntityType.Erc4337SmartAccount, erc4337SmartAccount[EntityMetaKey.Selector])}
												layout={EntityLayout.Value}
											/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={selection.$paymaster}
						>
							{#snippet children(erc4337Paymaster)}
								{#if erc4337Paymaster != null}
									<div>
										<dt>Paymaster</dt>
										<dd>
											<Erc4337PaymasterView
												selection={select(EntityType.Erc4337Paymaster, erc4337Paymaster[EntityMetaKey.Selector])}
												layout={EntityLayout.Value}
											/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={selection.$bundler}
						>
							{#snippet children(erc4337Bundler)}
								{#if erc4337Bundler != null}
									<div>
										<dt>Bundler</dt>
										<dd>
											<Erc4337BundlerView
												selection={select(EntityType.Erc4337Bundler, erc4337Bundler[EntityMetaKey.Selector])}
												layout={EntityLayout.Value}
											/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={selection.$entryPoint}
						>
							{#snippet children(evmContract)}
								{#if evmContract != null}
									{@const evmContractInitial = untrack(() => evmContract)}
									<div>
										<dt>EntryPoint</dt>
										<dd>
											<EvmContractView
												selection={select(EntityType.EvmContract, (evmContract ?? evmContractInitial)[EntityMetaKey.Selector])}
												prefetched={evmContract ?? evmContractInitial}
												layout={EntityLayout.Value}
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
									fields: {
										callGasLimit: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const callGasLimit = entity.callGasLimit}
								{#if callGasLimit != null}
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
									fields: {
										verificationGasLimit: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const verificationGasLimit = entity.verificationGasLimit}
								{#if verificationGasLimit != null}
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
									fields: {
										preVerificationGas: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const preVerificationGas = entity.preVerificationGas}
								{#if preVerificationGas != null}
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
									fields: {
										maxFeePerGas: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const maxFeePerGas = entity.maxFeePerGas}
								{#if maxFeePerGas != null}
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
									fields: {
										maxPriorityFeePerGas: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const maxPriorityFeePerGas = entity.maxPriorityFeePerGas}
								{#if maxPriorityFeePerGas != null}
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
									fields: {
										gas: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const gas = entity.gas}
								{#if gas != null}
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
									fields: {
										gasUsed: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const gasUsed = entity.gasUsed}
								{#if gasUsed != null}
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
									fields: {
										gasPrice: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const gasPrice = entity.gasPrice}
								{#if gasPrice != null}
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
									fields: {
										initCode: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const initCode = entity.initCode}
								{#if initCode != null}
									<div>
										<dt>Init code</dt>
										<dd>
											<TruncatedValue value={initCode} />
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={
								selection({
									fields: {
										callData: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const callData = entity.callData}
								{#if callData != null}
									<div>
										<dt>Call data</dt>
										<dd>
											<TruncatedValue value={callData} />
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={
								selection({
									fields: {
										paymasterAndData: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const paymasterAndData = entity.paymasterAndData}
								{#if paymasterAndData != null}
									<div>
										<dt>Paymaster data</dt>
										<dd>
											<TruncatedValue value={paymasterAndData} />
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={
								selection({
									fields: {
										signature: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const signature = entity.signature}
								{#if signature != null}
									<div>
										<dt>Signature</dt>
										<dd>
											<TruncatedValue value={signature} />
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dl>
				</article>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
