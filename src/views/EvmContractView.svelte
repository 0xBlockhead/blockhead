<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		title = 'Contract',
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(contracts)/contract/[address]', {
			caip2Namespace: selector.$network.caip2.namespace,
			caip2Reference: selector.$network.caip2.reference,
			address: selector.address,
		}),
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.EvmContract>
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
	import { subscribe } from '$/routes/+layout.svelte'

	const contract = subscribe(EntityType.EvmContract,
		selector,
		({ sources: [
				Source.Local_Internal,
				Source.Constants_Internal,
				Source.Sourcify_Rest,
				Source.Blockscout_Rest,
				Source.Etherscan_Rest,
				...(open ?
					[
						Source.Voltaire_JsonRpc,
					]
				:
					[]),
			], fields: { precompileName: ({ sources: [
					Source.Constants_Internal,
				] }), $verification: ({ sources: [
					Source.Sourcify_Rest,
				], fields: { $compilation: ({ fields: { fullyQualifiedName: true, name: true } }) } }), ...(open && ({ $deployer: true, $creationTransaction: true, $implementation: true, codeHash: true, code: true, abi: true, storageSlotReads: true, $verification: ({ sources: [
						Source.Sourcify_Rest,
					], fields: { match: true, creationMatch: true, runtimeMatch: true, verifiedAtMs: true, $compilation: ({ fields: { fullyQualifiedName: true, name: true } }), $sourceBundle: true } }) })) } }),
	)


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
	entitySelector={selector}
	{title}
	{href}
	bind:open
	{collapsible}
	{...entityViewRest}
>
	{#snippet Value()}
		<EvmNetworkAccountView
			selector={{
				$network: selector.$network,
				$actor: { address: selector.address },
			}}
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			placeholderText="Loading contract…"
			resource={contract}
		>
			{#snippet children(contract)}
				{#if contract.fields.precompileName}
					{contract.fields.precompileName}
				{:else if contract.fields.$verification?.$compilation?.fullyQualifiedName}
					<code>
						{contract.fields.$verification.$compilation.fullyQualifiedName
							.split(':')[0]
							.split('/')
							.at(-1)}
					</code>
				{:else if contract.fields.$verification?.$compilation?.name}
					{contract.fields.$verification.$compilation.name}
				{:else}
						<EvmNetworkAccountView
							selector={{
								$network: selector.$network,
								$actor: { address: selector.address },
							}}
							layout={EntityLayout.Value}
							open={false}
						/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open })}
		<div data-column="gap-1">
			<dl data-column-item="center">
				<div>
					<dt>Chain ID</dt>
					<dd>{String(evmChainIdFromCaip2(`${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`))}</dd>
				</div>
				<ResourceBoundary
					placeholderText="Loading contract details…"
					resource={contract}
				>
					{#snippet children(contract)}
						{#if open && contract.fields.precompileName}
							<div>
								<dt>Address</dt>
								<dd>
									<EvmNetworkAccountView
										selector={{
											$network: selector.$network,
											$actor: { address: selector.address },
										}}
										layout={EntityLayout.Value}
										open={false}
									/>
								</dd>
							</div>
						{/if}

						{#if open && !contract.fields.precompileName && contract.fields.$deployer}
							<div>
								<dt>Deployer</dt>
								<dd>
									<EvmNetworkAccountView
										selector={{
											$network: selector.$network,
											$actor: contract.fields.$deployer[EntityMetaKey.Selector],
										}}
										href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(accounts)/account/[address]', {
											caip2Namespace: selector.$network.caip2.namespace,
											caip2Reference: selector.$network.caip2.reference,
											address: contract.fields.$deployer[EntityMetaKey.Selector].address,
										})}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}

						{#if open && !contract.fields.precompileName && contract.fields.$creationTransaction}
							<div>
								<dt>Creation transaction</dt>
								<dd>
									<EvmTransactionView
										selector={contract.fields.$creationTransaction[EntityMetaKey.Selector]}
										href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(transactions)/tx/[transactionId]', {
											caip2Namespace: selector.$network.caip2.namespace,
											caip2Reference: selector.$network.caip2.reference,
											transactionId: contract.fields.$creationTransaction[EntityMetaKey.Selector].txHash,
										})}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}

						{#if open && !contract.fields.precompileName && contract.fields.$implementation}
							<div>
								<dt>Implementation</dt>
								<dd>
									<Self
										selector={contract.fields.$implementation[EntityMetaKey.Selector]}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}

						{#if open && contract.fields.codeHash}
							<div>
								<dt>Bytecode hash</dt>
								<dd>
									<TruncatedValue
										value={contract.fields.codeHash}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}

						{#if open && contract.fields.code}
							<div>
								<dt>Runtime bytecode</dt>
								<dd>
									<TruncatedValue
										value={contract.fields.code}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}

						{#if open && !contract.fields.precompileName}
							{#if open && contract.fields.abi !== undefined}
								<div>
									<dt>ABI</dt>
									<dd>
										<EvmAbiView
											abi={contract.fields.abi}
										/>
									</dd>
								</div>
							{:else}
								<div>
									<dt>ABI</dt>
									<dd>No ABI JSON yet.</dd>
								</div>
							{/if}
						{/if}
					{/snippet}
				</ResourceBoundary>
			</dl>
		</div>
	{/snippet}

</EntityView>
