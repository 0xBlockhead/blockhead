<script lang="ts">
	// Types/constants
	import { caip2RouteParamsFromNetworkId } from '$/lib/caip.ts'


	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/user-operation/[userOperationHash]',
			{
				...caip2RouteParamsFromNetworkId(entityId.$network),
				userOperationHash: entityId.hash,
			},
		),

		layout = EntityLayout.SummaryDetails,

		summaryUsesHeading = (
			layout === EntityLayout.SummaryDetails
			|| layout === EntityLayout.Details
		),

		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),

		title = 'User operation',

		HeadingSnippet,

		...entityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmUserOperation>
			href?: string
			layout?: EntityLayout

			summaryUsesHeading?: boolean

			open?: boolean

			title?: string

			HeadingSnippet?: Snippet
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const operation = useEntity(
		EntityType.EvmUserOperation,
		entityId,
		{
			$: [
				Source.Blockscout_Rest,
			],
			$bundledTransaction: {},
			$sender: {},
			$block: {},
			timestampMs: {},
			successful: {},
			fee: {},
			nonce: {},
			entryPointVersion: {},
			$entryPoint: {},
			initCode: {},
			callData: {},
			sponsorType: {},
			$paymaster: {},
			$bundler: {},
			paymasterAndData: {},
			signature: {},
			callGasLimit: {},
			verificationGasLimit: {},
			preVerificationGas: {},
			maxFeePerGas: {},
			maxPriorityFeePerGas: {},
			gas: {},
			gasUsed: {},
			gasPrice: {},
		},
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
	{entityId}
	href={href}
	{layout}
	bind:open
	{title}
	{...entityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			format={TruncatedValueFormat.Abbr}
			value={entityId.hash}
		/>
	{/snippet}

	{#snippet Title()}
		{#if HeadingSnippet}
			{@render HeadingSnippet()}
		{:else}
			<TruncatedValue
				format={TruncatedValueFormat.Visual}
				value={entityId.hash}
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
							value={entityId.hash}
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
									entityId={operation.$block[EntityMetaKey.Id]}
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
										entityId={operation.$entryPoint[EntityMetaKey.Id]}
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
							entityId={operation.$bundledTransaction[EntityMetaKey.Id]}
							href={resolve(
								'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(transactions)/tx/[transactionId]',
								{
									...caip2RouteParamsFromNetworkId(entityId.$network),
									transactionId: operation.$bundledTransaction[EntityMetaKey.Id].txHash,
								},
							)}
							layout={EntityLayout.Summary}
							open={false}
							collapsible={false}
							showTypeAnnotation={false}
						/>
					{/if}

					{#if operation.$sender != null}
						<Erc4337SmartAccountView
							entityId={operation.$sender[EntityMetaKey.Id]}
							layout={EntityLayout.Summary}
							open={false}
							collapsible={false}
							showTypeAnnotation={false}
							title="Sender smart account"
						/>
					{/if}

					{#if operation.$paymaster != null}
						<Erc4337PaymasterView
							entityId={operation.$paymaster[EntityMetaKey.Id]}
							layout={EntityLayout.Summary}
							open={false}
							collapsible={false}
							showTypeAnnotation={false}
							title="Paymaster"
						/>
					{/if}

					{#if operation.$bundler != null}
						<Erc4337BundlerView
							entityId={operation.$bundler[EntityMetaKey.Id]}
							layout={EntityLayout.Summary}
							open={false}
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
