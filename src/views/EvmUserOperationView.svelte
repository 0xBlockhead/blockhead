<script lang="ts">
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
		'/(explore)/(networks)/network/[networkId]/(network)/user-operation/[userOperationHash]',
		{
			networkId: String(entityId.$network.chainId),
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
			timestampSeconds: {},
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
	{#snippet Heading()}
		{#if HeadingSnippet}
			{@render HeadingSnippet()}
		{:else}
			<TruncatedValue
				format={TruncatedValueFormat.Visual}
				value={entityId.hash}
			/>
		{/if}
	{/snippet}

	{#snippet Value()}
		<TruncatedValue
			format={TruncatedValueFormat.Abbr}
			value={entityId.hash}
		/>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
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
						{#snippet children(loadedOperation)}
							{#if loadedOperation.successful !== undefined}
								{String(loadedOperation.successful)}
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
						{#snippet children(loadedOperation)}
							{#if loadedOperation.$block !== undefined}
								<EvmBlockView
									entityId={loadedOperation.$block[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
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
						{#snippet children(loadedOperation)}
							{#if loadedOperation.fee != null && loadedOperation.fee !== ''}
								{loadedOperation.fee}
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
						{#snippet children(loadedOperation)}
							{#if loadedOperation.nonce !== undefined}
								<NumberValue value={loadedOperation.nonce} />
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
							{#snippet children(loadedOperation)}
								{#if loadedOperation.entryPointVersion != null}
									{loadedOperation.entryPointVersion}
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
							{#snippet children(loadedOperation)}
								{#if loadedOperation.$entryPoint != null}
									<EvmContractView
										entityId={loadedOperation.$entryPoint[EntityMetaKey.Id]}
										layout={EntityLayout.Title}
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
							{#snippet children(loadedOperation)}
								{#if loadedOperation.sponsorType != null}
									{loadedOperation.sponsorType}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
		<ResourceBoundary resource={operation}>
			{#snippet children(loadedOperation)}
				<div class="entity-details" data-column="gap-2">
					{#if loadedOperation.$bundledTransaction != null}
						<EvmTransactionView
							entityId={loadedOperation.$bundledTransaction[EntityMetaKey.Id]}
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
								{
								networkId: String(entityId.$network.chainId),
								transactionId: loadedOperation.$bundledTransaction[EntityMetaKey.Id].txHash,
								},
							)}
							layout={EntityLayout.Summary}
							open={false}
							collapsible={false}
							showTypeAnnotation={false}
						/>
					{/if}

					{#if loadedOperation.$sender != null}
						<Erc4337SmartAccountView
							entityId={loadedOperation.$sender[EntityMetaKey.Id]}
							layout={EntityLayout.Summary}
							open={false}
							collapsible={false}
							showTypeAnnotation={false}
							title="Sender smart account"
						/>
					{/if}

					{#if loadedOperation.$paymaster != null}
						<Erc4337PaymasterView
							entityId={loadedOperation.$paymaster[EntityMetaKey.Id]}
							layout={EntityLayout.Summary}
							open={false}
							collapsible={false}
							showTypeAnnotation={false}
							title="Paymaster"
						/>
					{/if}

					{#if loadedOperation.$bundler != null}
						<Erc4337BundlerView
							entityId={loadedOperation.$bundler[EntityMetaKey.Id]}
							layout={EntityLayout.Summary}
							open={false}
							collapsible={false}
							showTypeAnnotation={false}
							title="Bundler"
						/>
					{/if}

					<dl data-column-item="center">
						{#if loadedOperation.callGasLimit !== undefined}
							<div>
								<dt>Call gas limit</dt>
								<dd><NumberValue value={loadedOperation.callGasLimit} /></dd>
							</div>
						{/if}

						{#if loadedOperation.verificationGasLimit !== undefined}
							<div>
								<dt>Verification gas limit</dt>
								<dd><NumberValue value={loadedOperation.verificationGasLimit} /></dd>
							</div>
						{/if}

						{#if loadedOperation.preVerificationGas !== undefined}
							<div>
								<dt>Pre-verification gas</dt>
								<dd><NumberValue value={loadedOperation.preVerificationGas} /></dd>
							</div>
						{/if}

						{#if loadedOperation.maxFeePerGas !== undefined}
							<div>
								<dt>Max fee per gas</dt>
								<dd><NumberValue value={loadedOperation.maxFeePerGas} /></dd>
							</div>
						{/if}

						{#if loadedOperation.maxPriorityFeePerGas !== undefined}
							<div>
								<dt>Max priority fee per gas</dt>
								<dd><NumberValue value={loadedOperation.maxPriorityFeePerGas} /></dd>
							</div>
						{/if}

						{#if loadedOperation.gas !== undefined}
							<div>
								<dt>Gas</dt>
								<dd><NumberValue value={loadedOperation.gas} /></dd>
							</div>
						{/if}

						{#if loadedOperation.gasUsed !== undefined}
							<div>
								<dt>Gas used</dt>
								<dd><NumberValue value={loadedOperation.gasUsed} /></dd>
							</div>
						{/if}

						{#if loadedOperation.gasPrice !== undefined}
							<div>
								<dt>Gas price</dt>
								<dd><NumberValue value={loadedOperation.gasPrice} /></dd>
							</div>
						{/if}

						{#if loadedOperation.initCode != null && loadedOperation.initCode !== '0x'}
							<div>
								<dt>Init code</dt>
								<dd>
									<TruncatedValue
										format={TruncatedValueFormat.Visual}
										value={loadedOperation.initCode}
									/>
								</dd>
							</div>
						{/if}

						{#if loadedOperation.callData != null && loadedOperation.callData !== '0x'}
							<div>
								<dt>Call data</dt>
								<dd>
									<TruncatedValue
										format={TruncatedValueFormat.Visual}
										value={loadedOperation.callData}
									/>
								</dd>
							</div>
						{/if}

						{#if loadedOperation.paymasterAndData != null && loadedOperation.paymasterAndData !== '0x'}
							<div>
								<dt>Paymaster data</dt>
								<dd>
									<TruncatedValue
										format={TruncatedValueFormat.Visual}
										value={loadedOperation.paymasterAndData}
									/>
								</dd>
							</div>
						{/if}

						{#if loadedOperation.signature != null && loadedOperation.signature !== '0x'}
							<div>
								<dt>Signature</dt>
								<dd>
									<TruncatedValue
										format={TruncatedValueFormat.Visual}
										value={loadedOperation.signature}
									/>
								</dd>
							</div>
						{/if}
					</dl>
				</div>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			User operations carry calldata and gas limits for ERC-4337 accounts; bundlers submit them on-chain as a single transaction through the EntryPoint contract.
		</p>
	{/snippet}
</EntityView>
