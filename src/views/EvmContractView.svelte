<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children: _children,
		entityId,
		title = 'Contract',
			href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(contracts)/contract/[address]', {
				caip2Namespace: entityId.$network.caip2.namespace,
				caip2Reference: entityId.$network.caip2.reference,
				address: entityId.address,
			}),
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
				children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EvmContract>
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
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const contract = useEntity(
		EntityType.EvmContract,
		entityId,
		{
			$: [
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
			],
			precompileName: {
				$: [
					Source.Constants_Internal,
				],
			},
			$verification: {
				$: [
					Source.Sourcify_Rest,
				],
				$compilation: {
					fullyQualifiedName: {},
					name: {},
				},
			},
			...(open && {
				$deployer: {},
				$creationTransaction: {},
				$implementation: {},
				codeHash: {},
				code: {},
				abi: {},
				storageSlotReads: {},
				$verification: {
					$: [
						Source.Sourcify_Rest,
					],
					match: {},
					creationMatch: {},
					runtimeMatch: {},
					verifiedAtMs: {},
					$compilation: {
						fullyQualifiedName: {},
						name: {},
					},
					$sourceBundle: {},
				},
			}),
		},
	)


	// Components
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmAbiView from '$/views/EvmAbiView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmContract}
	{entityId}
	{title}
	{href}
	bind:open
	{collapsible}
	{...entityViewRest}
>
	{#snippet Value()}
		<EvmNetworkAccountView
			entityId={{
				$network: entityId.$network,
				$actor: { address: entityId.address },
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
				{#if contract.precompileName}
					{contract.precompileName}
				{:else if contract.$verification?.$compilation?.fullyQualifiedName}
					<code>
						{contract.$verification.$compilation.fullyQualifiedName
							.split(':')[0]
							.split('/')
							.at(-1)}
					</code>
				{:else if contract.$verification?.$compilation?.name}
					{contract.$verification.$compilation.name}
				{:else}
						<EvmNetworkAccountView
							entityId={{
								$network: entityId.$network,
								$actor: { address: entityId.address },
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
						<dd>{String(evmChainIdFromCaip2(`${entityId.$network.caip2.namespace}:${entityId.$network.caip2.reference}`))}</dd>
					</div>
					{#if open}
					<ResourceBoundary
						placeholderText="Loading contract details…"
						resource={contract}
					>
						{#snippet children(contract)}
							{#if contract.precompileName}
								<div>
									<dt>Address</dt>
									<dd>
										<EvmNetworkAccountView
											entityId={{
												$network: entityId.$network,
												$actor: { address: entityId.address },
											}}
											layout={EntityLayout.Value}
											open={false}
										/>
									</dd>
								</div>
							{/if}

							{#if !contract.precompileName && contract.$deployer}
								<div>
									<dt>Deployer</dt>
									<dd>
										<EvmNetworkAccountView
											entityId={{
												$network: entityId.$network,
												$actor: contract.$deployer[EntityMetaKey.Id],
											}}
											href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(accounts)/account/[address]', {
												caip2Namespace: entityId.$network.caip2.namespace,
												caip2Reference: entityId.$network.caip2.reference,
												address: contract.$deployer[EntityMetaKey.Id].address,
											})}
											layout={EntityLayout.Title}
											open={false}
										/>
									</dd>
								</div>
							{/if}

							{#if !contract.precompileName && contract.$creationTransaction}
								<div>
									<dt>Creation transaction</dt>
									<dd>
										<EvmTransactionView
											entityId={contract.$creationTransaction[EntityMetaKey.Id]}
											href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(transactions)/tx/[transactionId]', {
												caip2Namespace: entityId.$network.caip2.namespace,
												caip2Reference: entityId.$network.caip2.reference,
												transactionId: contract.$creationTransaction[EntityMetaKey.Id].txHash,
											})}
											layout={EntityLayout.Title}
											open={false}
										/>
									</dd>
								</div>
							{/if}

							{#if !contract.precompileName && contract.$implementation}
									<div>
										<dt>Implementation</dt>
										<dd>
												<a href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(contracts)/contract/[address]', {
													caip2Namespace: entityId.$network.caip2.namespace,
													caip2Reference: entityId.$network.caip2.reference,
														address: contract.$implementation[EntityMetaKey.Id].address,
												})}>
												<EvmNetworkAccountView
													entityId={{
														$network: contract.$implementation[EntityMetaKey.Id].$network,
														$actor: { address: contract.$implementation[EntityMetaKey.Id].address },
													}}
													layout={EntityLayout.Value}
													open={false}
												/>
											</a>
										</dd>
									</div>
								{/if}

							{#if contract.codeHash}
								<div>
									<dt>Bytecode hash</dt>
									<dd>
										<TruncatedValue
											value={contract.codeHash}
											format={TruncatedValueFormat.Visual}
										/>
									</dd>
								</div>
							{/if}

							{#if contract.code}
								<div>
									<dt>Runtime bytecode</dt>
									<dd>
										<TruncatedValue
											value={contract.code}
											format={TruncatedValueFormat.Visual}
										/>
									</dd>
								</div>
							{/if}

							{#if !contract.precompileName}
								{#if contract.abi !== undefined}
									<div>
										<dt>ABI</dt>
										<dd>
											<EvmAbiView
												abi={contract.abi}
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
				{/if}
			</dl>
		</div>
	{/snippet}

	{#snippet Details({
		open,
	})}
		{#if _children}
			{@render _children()}
		{/if}
	{/snippet}
</EntityView>
