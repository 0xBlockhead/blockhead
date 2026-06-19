<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		title = 'Contract',
		href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
			caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
			address: selection.entitySelector.address,
		}),
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmContract>
			title?: string
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
				| 'layout'
				| 'showTypeAnnotation'
				| 'CollapsibleProps'
		>
	> = $props()


	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'
	import { select } from '$/routes/+layout.svelte'

	const contract = $derived(selection( {
		sources: [
			Source.Local_Internal,
			Source.Constants_Internal,
			Source.Sourcify_Rest,
			Source.Blockscout_Rest,
			Source.Etherscan_Rest,
			Source.Voltaire_JsonRpc,
		],
	}))
	const precompileName = $derived(contract.precompileName({
		sources: [Source.Constants_Internal],
	}))
	
	const compilationName = $derived(contract.$verification.$compilation.name)


	// Components
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Self from '$/views/EvmContractView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmAbiView from '$/views/EvmAbiView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmContract}
	entitySelector={selection.entitySelector}
	{title}
	{href}
	bind:open
	{collapsible}
	{...entityViewRest}
>
	{#snippet Value()}
		<EvmNetworkAccountView
			selection={select(EntityType.EvmNetworkAccount, {
				$network: selection.entitySelector.$network,
				$actor: { address: selection.entitySelector.address },
			})}
			layout={EntityLayout.Value}

			open={false}
			/>
	{/snippet}

	{#snippet Title()}
		{#if open}
			<ResourceBoundary
				placeholderText="Loading contract…"
				resource={precompileName}
			>
				{#snippet children(precompileName)}
					{#if precompileName}
						{precompileName}
					{:else}
						<ResourceBoundary
							placeholderText="Loading contract name…"
							resource={contract.$verification.$compilation.fullyQualifiedName}
						>
							{#snippet children(compilationFullyQualifiedName)}
								{#if compilationFullyQualifiedName}
									<code>
										{compilationFullyQualifiedName
											.split(':')[0]
											.split('/')
											.at(-1)}
									</code>
								{:else}
									<ResourceBoundary
										placeholderText="Loading compilation name…"
										resource={compilationName}
									>
										{#snippet children(compilationName)}
											{#if compilationName}
												{compilationName}
											{:else}
												<EvmNetworkAccountView
													selection={select(EntityType.EvmNetworkAccount, {
														$network: selection.entitySelector.$network,
														$actor: { address: selection.entitySelector.address },
													})}
													layout={EntityLayout.Value}
													open={false}
												/>
											{/if}
										{/snippet}
									</ResourceBoundary>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{:else}
			<EvmNetworkAccountView
				selection={select(EntityType.EvmNetworkAccount, {
					$network: selection.entitySelector.$network,
					$actor: { address: selection.entitySelector.address },
				})}
				layout={EntityLayout.Value}

				open={false}
				/>
		{/if}
	{/snippet}

	{#snippet Content({ open })}
		<div data-column="gap-1">
			<dl data-column-item="center">
				<div>
					<dt>Chain ID</dt>
					<dd>{String(evmChainIdFromCaip2(`${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`))}</dd>
				</div>
				<ResourceBoundary
					placeholderText="Loading contract details…"
					resource={precompileName}
				>
					{#snippet children(precompileName)}
						{#if open && precompileName}
							<div>
								<dt>Address</dt>
								<dd>
									<EvmNetworkAccountView
										selection={select(EntityType.EvmNetworkAccount, {
											$network: selection.entitySelector.$network,
											$actor: { address: selection.entitySelector.address },
										})}
										layout={EntityLayout.Value}

										open={false}
										/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				{#if open}
					<ResourceBoundary
						placeholderText="Loading contract…"
						resource={precompileName}
					>
						{#snippet children(precompileName)}
					<ResourceBoundary
						placeholderText="Loading deployer…"
						resource={contract.$deployer}
					>
						{#snippet children(deployer)}
							{#if !precompileName && deployer}
							<div>
								<dt>Deployer</dt>
								<dd>
									<EvmNetworkAccountView
										selection={select(EntityType.EvmNetworkAccount, {
											$network: selection.entitySelector.$network,
											$actor: deployer.entitySelector,
										})}
										href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(accounts)/account/[address=evmAddress]', {
											caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
											address: deployer.entitySelector.address,
										})}
										layout={EntityLayout.Title}

										open={false}
										/>
								</dd>
							</div>
						{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						placeholderText="Loading creation transaction…"
						resource={contract.$creationTransaction}
					>
						{#snippet children(creationTransaction)}
							{#if !precompileName && creationTransaction}
							<div>
								<dt>Creation transaction</dt>
								<dd>
									<EvmTransactionView
										selection={select(EntityType.EvmTransaction, creationTransaction.entitySelector)}
										href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
											caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
											transactionId: creationTransaction.entitySelector.txHash,
										})}
										layout={EntityLayout.Title}

										open={false}
										/>
								</dd>
							</div>
						{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						placeholderText="Loading implementation…"
						resource={contract.$implementation}
					>
						{#snippet children(implementation)}
							{#if !precompileName && implementation}
							<div>
								<dt>Implementation</dt>
								<dd>
									<Self
										selection={select(EntityType.EvmContract, implementation.entitySelector)}
										layout={EntityLayout.Title}

									/>
								</dd>
							</div>
						{/if}
						{/snippet}
					</ResourceBoundary>

					{#if !precompileName}
						<ResourceBoundary
							placeholderText="Loading ABI…"
							resource={contract.abi}
						>
							{#snippet children(abi)}
							{#if abi !== undefined}
								<div>
									<dt>ABI</dt>
									<dd>
										<EvmAbiView
											abi={abi}
										/>
									</dd>
								</div>
							{:else}
								<div>
									<dt>ABI</dt>
									<dd>No ABI JSON yet.</dd>
								</div>
							{/if}
							{/snippet}
						</ResourceBoundary>
					{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						placeholderText="Loading bytecode hash…"
						resource={contract.codeHash}
					>
						{#snippet children(codeHash)}
						{#if codeHash}
							<div>
								<dt>Bytecode hash</dt>
								<dd>
									<TruncatedValue
										value={codeHash}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						placeholderText="Loading runtime bytecode…"
						resource={contract.code}
					>
						{#snippet children(code)}
						{#if code}
							<div>
								<dt>Runtime bytecode</dt>
								<dd>
									<TruncatedValue
										value={code}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}
						{/snippet}
					</ResourceBoundary>

				{/if}
			</dl>
		</div>
	{/snippet}

</EntityView>
