<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/user-operation/[userOperationHash=userOperationHash]', {
				caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
				userOperationHash: selection.entitySelector.hash,
		}),

		layout = EntityLayout.SummaryDetails,

		summaryUsesHeading = (
			layout === EntityLayout.SummaryDetails
		),

		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),

		title = 'User operation',
		collapsible = true,

		HeadingSnippet,

		...entityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmUserOperation>
			href?: string
			layout?: EntityLayout

			summaryUsesHeading?: boolean

			open?: boolean

			title?: string
			collapsible?: boolean

			HeadingSnippet?: Snippet
		},
		Pick<
				ComponentProps<typeof EntityView>,
				| 'showTypeAnnotation'
			>
	> = $props()


	const operation = $derived(selection( {
		sources: [Source.Blockscout_Rest],
	}))
	const bundledTransaction = $derived(operation.$bundledTransaction)
	const sender = $derived(operation.$sender)
	const block = $derived(operation.$block)
	const timestampMs = $derived(operation.timestampMs)
	const successful = $derived(operation.successful)
	const fee = $derived(operation.fee)
	const nonce = $derived(operation.nonce)
	const entryPointVersion = $derived(operation.entryPointVersion)
	const entryPoint = $derived(operation.$entryPoint)
	const initCode = $derived(operation.initCode)
	const callData = $derived(operation.callData)
	const sponsorType = $derived(operation.sponsorType)
	const paymaster = $derived(operation.$paymaster)
	const bundler = $derived(operation.$bundler)
	const paymasterAndData = $derived(operation.paymasterAndData)
	const signature = $derived(operation.signature)
	const callGasLimit = $derived(operation.callGasLimit)
	const verificationGasLimit = $derived(operation.verificationGasLimit)
	const preVerificationGas = $derived(operation.preVerificationGas)
	const maxFeePerGas = $derived(operation.maxFeePerGas)
	const maxPriorityFeePerGas = $derived(operation.maxPriorityFeePerGas)
	const gas = $derived(operation.gas)
	const gasUsed = $derived(operation.gasUsed)
	const gasPrice = $derived(operation.gasPrice)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import Erc4337SmartAccountView from '$/views/Erc4337SmartAccountView.svelte'
	import Erc4337PaymasterView from '$/views/Erc4337PaymasterView.svelte'
	import Erc4337BundlerView from '$/views/Erc4337BundlerView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmUserOperation}
	entitySelector={selection.entitySelector}
	href={href}
	{layout}
	bind:open
	{title}
		{collapsible}
	{...entityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			format={TruncatedValueFormat.Abbr}
			value={selection.entitySelector.hash}
		/>
	{/snippet}

	{#snippet Title()}
		{#if HeadingSnippet}
			{@render HeadingSnippet()}
		{:else}
			<TruncatedValue
				format={TruncatedValueFormat.Visual}
				value={selection.entitySelector.hash}
			/>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			User operations carry calldata and gas limits for ERC-4337 accounts; bundlers submit them on-chain as a single transaction through the EntryPoint contract.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<dl data-column-item="center">
			{#if !summaryUsesHeading}
				<div>
					<dt>Operation hash</dt>
					<dd>
						<TruncatedValue
							format={TruncatedValueFormat.Visual}
							value={selection.entitySelector.hash}
						/>
					</dd>
				</div>
			{/if}

			<div>
				<dt>Successful</dt>
				<dd>
					<ResourceBoundary
						placeholderText="Loading user operation…"
						resource={operation}
					>
						{#snippet children(operation)}
							{#if operation.successful !== undefined}
								{String(operation.successful)}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Bundled block</dt>
				<dd>
					<ResourceBoundary
						placeholderText="Loading user operation…"
						resource={operation}
					>
						{#snippet children(operation)}
							{#if operation.$block !== undefined}
								<EvmBlockView
									selection={select(EntityType.EvmBlock, operation.$block.entitySelector)}
									layout={EntityLayout.Value}

									open={false}
									/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Fee</dt>
				<dd>
					<ResourceBoundary
						placeholderText="Loading user operation…"
						resource={operation}
					>
						{#snippet children(operation)}
							{#if operation.fee != null && operation.fee !== ''}
								{operation.fee}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Nonce</dt>
				<dd>
					<ResourceBoundary
						placeholderText="Loading user operation…"
						resource={operation}
					>
						{#snippet children(operation)}
							{#if operation.nonce !== undefined}
								<NumberValue value={operation.nonce} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<div>
					<dt>Entry point version</dt>
					<dd>
						<ResourceBoundary
							placeholderText="Loading user operation…"
							resource={operation}
						>
							{#snippet children(operation)}
								{#if operation.entryPointVersion != null}
									{operation.entryPointVersion}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>EntryPoint</dt>
					<dd>
						<ResourceBoundary
							placeholderText="Loading user operation…"
							resource={operation}
						>
							{#snippet children(operation)}
								{#if operation.$entryPoint != null}
									<EvmContractView
										selection={select(EntityType.EvmContract, operation.$entryPoint.entitySelector)}
										layout={EntityLayout.Value}

										showTypeAnnotation={false}
										open={false}
										/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Sponsor type</dt>
					<dd>
						<ResourceBoundary
							placeholderText="Loading user operation…"
							resource={operation}
						>
							{#snippet children(operation)}
								{#if operation.sponsorType != null}
									{operation.sponsorType}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open })}
		<ResourceBoundary resource={operation}>
			{#snippet children(operation)}
				<div class="entity-details" data-column="gap-2">
					{#if operation.$bundledTransaction != null}
						<EvmTransactionView
							selection={select(EntityType.EvmTransaction, operation.$bundledTransaction.entitySelector)}
							href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
								caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
								transactionId: operation.$bundledTransaction.entitySelector.txHash,
							})}
							layout={EntityLayout.Summary}

							collapsible={false}
							showTypeAnnotation={false}
						/>
					{/if}

					{#if operation.$sender != null}
						<Erc4337SmartAccountView
							selection={select(EntityType.Erc4337SmartAccount, operation.$sender.entitySelector)}
							layout={EntityLayout.Summary}

							collapsible={false}
							showTypeAnnotation={false}
							title="Sender smart account"
						/>
					{/if}

					{#if operation.$paymaster != null}
						<Erc4337PaymasterView
							selection={select(EntityType.Erc4337Paymaster, operation.$paymaster.entitySelector)}
							layout={EntityLayout.Summary}

							collapsible={false}
							showTypeAnnotation={false}
							title="Paymaster"
						/>
					{/if}

					{#if operation.$bundler != null}
						<Erc4337BundlerView
							selection={select(EntityType.Erc4337Bundler, operation.$bundler.entitySelector)}
							layout={EntityLayout.Summary}

							collapsible={false}
							showTypeAnnotation={false}
							title="Bundler"
						/>
					{/if}

					<div data-column-item="center">
						{#if operation.callGasLimit !== undefined}
							<div>
								<dt>Call gas limit</dt>
								<dd><NumberValue value={operation.callGasLimit} /></dd>
							</div>
						{/if}

						{#if operation.verificationGasLimit !== undefined}
							<div>
								<dt>Verification gas limit</dt>
								<dd><NumberValue value={operation.verificationGasLimit} /></dd>
							</div>
						{/if}

						{#if operation.preVerificationGas !== undefined}
							<div>
								<dt>Pre-verification gas</dt>
								<dd><NumberValue value={operation.preVerificationGas} /></dd>
							</div>
						{/if}

						{#if operation.maxFeePerGas !== undefined}
							<div>
								<dt>Max fee per gas</dt>
								<dd><NumberValue value={operation.maxFeePerGas} /></dd>
							</div>
						{/if}

						{#if operation.maxPriorityFeePerGas !== undefined}
							<div>
								<dt>Max priority fee per gas</dt>
								<dd><NumberValue value={operation.maxPriorityFeePerGas} /></dd>
							</div>
						{/if}

						{#if operation.gas !== undefined}
							<div>
								<dt>Gas</dt>
								<dd><NumberValue value={operation.gas} /></dd>
							</div>
						{/if}

						{#if operation.gasUsed !== undefined}
							<div>
								<dt>Gas used</dt>
								<dd><NumberValue value={operation.gasUsed} /></dd>
							</div>
						{/if}

						{#if operation.gasPrice !== undefined}
							<div>
								<dt>Gas price</dt>
								<dd><NumberValue value={operation.gasPrice} /></dd>
							</div>
						{/if}

						{#if operation.initCode != null && operation.initCode !== '0x'}
							<div>
								<dt>Init code</dt>
								<dd>
									<TruncatedValue
										format={TruncatedValueFormat.Visual}
										value={operation.initCode}
									/>
								</dd>
							</div>
						{/if}

						{#if operation.callData != null && operation.callData !== '0x'}
							<div>
								<dt>Call data</dt>
								<dd>
									<TruncatedValue
										format={TruncatedValueFormat.Visual}
										value={operation.callData}
									/>
								</dd>
							</div>
						{/if}

						{#if operation.paymasterAndData != null && operation.paymasterAndData !== '0x'}
							<div>
								<dt>Paymaster data</dt>
								<dd>
									<TruncatedValue
										format={TruncatedValueFormat.Visual}
										value={operation.paymasterAndData}
									/>
								</dd>
							</div>
						{/if}

						{#if operation.signature != null && operation.signature !== '0x'}
							<div>
								<dt>Signature</dt>
								<dd>
									<TruncatedValue
										format={TruncatedValueFormat.Visual}
										value={operation.signature}
									/>
								</dd>
							</div>
						{/if}
					</div>
				</div>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
