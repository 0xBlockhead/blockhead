<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/user-operation/[userOperationHash=userOperationHash]', {
				...{ caip2Namespace: selector.$network.caip2.namespace, caip2Reference: selector.$network.caip2.reference },
				userOperationHash: selector.hash,
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
			selector: EntitySelector<typeof schema, EntityType.EvmUserOperation>
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

	const operation = subscribe(EntityType.EvmUserOperation,
		selector,
		({ sources: [
				Source.Blockscout_Rest,
			], fields: { $bundledTransaction: true, $sender: true, $block: true, timestampMs: true, successful: true, fee: true, nonce: true, entryPointVersion: true, $entryPoint: true, initCode: true, callData: true, sponsorType: true, $paymaster: true, $bundler: true, paymasterAndData: true, signature: true, callGasLimit: true, verificationGasLimit: true, preVerificationGas: true, maxFeePerGas: true, maxPriorityFeePerGas: true, gas: true, gasUsed: true, gasPrice: true } }),
	)


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
	entitySelector={selector}
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
			value={selector.hash}
		/>
	{/snippet}

	{#snippet Title()}
		{#if HeadingSnippet}
			{@render HeadingSnippet()}
		{:else}
			<TruncatedValue
				format={TruncatedValueFormat.Visual}
				value={selector.hash}
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
							value={selector.hash}
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
							{#if operation.fields.successful !== undefined}
								{String(operation.fields.successful)}
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
							{#if operation.fields.$block !== undefined}
								<EvmBlockView
									selector={operation.fields.$block[EntityMetaKey.Selector]}
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
							{#if operation.fields.fee != null && operation.fields.fee !== ''}
								{operation.fields.fee}
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
							{#if operation.fields.nonce !== undefined}
								<NumberValue value={operation.fields.nonce} />
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
								{#if operation.fields.entryPointVersion != null}
									{operation.fields.entryPointVersion}
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
								{#if operation.fields.$entryPoint != null}
									<EvmContractView
										selector={operation.fields.$entryPoint[EntityMetaKey.Selector]}
										layout={EntityLayout.Value}
										open={false}
										showTypeAnnotation={false}
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
								{#if operation.fields.sponsorType != null}
									{operation.fields.sponsorType}
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
					{#if operation.fields.$bundledTransaction != null}
						<EvmTransactionView
							selector={operation.fields.$bundledTransaction[EntityMetaKey.Selector]}
							href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
								...{ caip2Namespace: selector.$network.caip2.namespace, caip2Reference: selector.$network.caip2.reference },
								transactionId: operation.fields.$bundledTransaction[EntityMetaKey.Selector].txHash,
							})}
							layout={EntityLayout.Summary}
							open={false}
							collapsible={false}
							showTypeAnnotation={false}
						/>
					{/if}

					{#if operation.fields.$sender != null}
						<Erc4337SmartAccountView
							selector={operation.fields.$sender[EntityMetaKey.Selector]}
							layout={EntityLayout.Summary}
							open={false}
							collapsible={false}
							showTypeAnnotation={false}
							title="Sender smart account"
						/>
					{/if}

					{#if operation.fields.$paymaster != null}
						<Erc4337PaymasterView
							selector={operation.fields.$paymaster[EntityMetaKey.Selector]}
							layout={EntityLayout.Summary}
							open={false}
							collapsible={false}
							showTypeAnnotation={false}
							title="Paymaster"
						/>
					{/if}

					{#if operation.fields.$bundler != null}
						<Erc4337BundlerView
							selector={operation.fields.$bundler[EntityMetaKey.Selector]}
							layout={EntityLayout.Summary}
							open={false}
							collapsible={false}
							showTypeAnnotation={false}
							title="Bundler"
						/>
					{/if}

					<div data-column-item="center">
						{#if operation.fields.callGasLimit !== undefined}
							<div>
								<dt>Call gas limit</dt>
								<dd><NumberValue value={operation.fields.callGasLimit} /></dd>
							</div>
						{/if}

						{#if operation.fields.verificationGasLimit !== undefined}
							<div>
								<dt>Verification gas limit</dt>
								<dd><NumberValue value={operation.fields.verificationGasLimit} /></dd>
							</div>
						{/if}

						{#if operation.fields.preVerificationGas !== undefined}
							<div>
								<dt>Pre-verification gas</dt>
								<dd><NumberValue value={operation.fields.preVerificationGas} /></dd>
							</div>
						{/if}

						{#if operation.fields.maxFeePerGas !== undefined}
							<div>
								<dt>Max fee per gas</dt>
								<dd><NumberValue value={operation.fields.maxFeePerGas} /></dd>
							</div>
						{/if}

						{#if operation.fields.maxPriorityFeePerGas !== undefined}
							<div>
								<dt>Max priority fee per gas</dt>
								<dd><NumberValue value={operation.fields.maxPriorityFeePerGas} /></dd>
							</div>
						{/if}

						{#if operation.fields.gas !== undefined}
							<div>
								<dt>Gas</dt>
								<dd><NumberValue value={operation.fields.gas} /></dd>
							</div>
						{/if}

						{#if operation.fields.gasUsed !== undefined}
							<div>
								<dt>Gas used</dt>
								<dd><NumberValue value={operation.fields.gasUsed} /></dd>
							</div>
						{/if}

						{#if operation.fields.gasPrice !== undefined}
							<div>
								<dt>Gas price</dt>
								<dd><NumberValue value={operation.fields.gasPrice} /></dd>
							</div>
						{/if}

						{#if operation.fields.initCode != null && operation.fields.initCode !== '0x'}
							<div>
								<dt>Init code</dt>
								<dd>
									<TruncatedValue
										format={TruncatedValueFormat.Visual}
										value={operation.fields.initCode}
									/>
								</dd>
							</div>
						{/if}

						{#if operation.fields.callData != null && operation.fields.callData !== '0x'}
							<div>
								<dt>Call data</dt>
								<dd>
									<TruncatedValue
										format={TruncatedValueFormat.Visual}
										value={operation.fields.callData}
									/>
								</dd>
							</div>
						{/if}

						{#if operation.fields.paymasterAndData != null && operation.fields.paymasterAndData !== '0x'}
							<div>
								<dt>Paymaster data</dt>
								<dd>
									<TruncatedValue
										format={TruncatedValueFormat.Visual}
										value={operation.fields.paymasterAndData}
									/>
								</dd>
							</div>
						{/if}

						{#if operation.fields.signature != null && operation.fields.signature !== '0x'}
							<div>
								<dt>Signature</dt>
								<dd>
									<TruncatedValue
										format={TruncatedValueFormat.Visual}
										value={operation.fields.signature}
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
