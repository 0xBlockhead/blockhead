<script lang="ts">
	// Types/constants
	import {
		caip2RouteParamsFromNetworkId,
		evmChainIdFromNetworkId,
	} from '$/lib/caip.ts'


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
		href,
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			RouteContent?: Snippet
			entityId: EntityId<typeof schema, EntityType.EvmContract>
			title?: string
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'TypeAnnotationTooltip'
		>
	> = $props()


	// State
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
				bytecodeHash: {},
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
	import Address from '$/views/Address.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmContract}
	{entityId}
	{title}
	{href}
	bind:open
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Value()}
		<Address
			network={entityId.$network}
			address={entityId.address}
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
					{@render Value()}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		{@render Title()}
	{/snippet}

		{#snippet Content(context)}
			<div data-column="gap-1">
				<dl data-column-item="center">
					<div>
						<dt>Chain ID</dt>
						<dd>{String(evmChainIdFromNetworkId(entityId.$network))}</dd>
					</div>
					{#if context?.open}
					<ResourceBoundary
						placeholderText="Loading contract details…"
						resource={contract}
					>
						{#snippet children(contract)}
							{#if contract.precompileName}
								<div>
									<dt>Address</dt>
									<dd>
										<Address
											network={entityId.$network}
											address={entityId.address}
										/>
									</dd>
								</div>
							{/if}

							{#if !contract.precompileName && contract.$deployer}
								<div>
									<dt>Deployer</dt>
									<dd>
										<ActorNetworkView
											entityId={{
												$network: entityId.$network,
												$actor: contract.$deployer[EntityMetaKey.Id],
											}}
											href={resolve(
												'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(accounts)/account/[address]',
												{
													...caip2RouteParamsFromNetworkId(entityId.$network),
													address: contract.$deployer[EntityMetaKey.Id].address,
												},
											)}
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
											href={resolve(
												'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(transactions)/tx/[transactionId]',
												{
													...caip2RouteParamsFromNetworkId(entityId.$network),
													transactionId: contract.$creationTransaction[EntityMetaKey.Id].txHash,
												},
											)}
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
											<a
												href={resolve(
													'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(contracts)/contract/[address]',
													{
														...caip2RouteParamsFromNetworkId(entityId.$network),
														address: contract.$implementation[EntityMetaKey.Id].address,
													},
												)}
											>
												<Address
													network={contract.$implementation[EntityMetaKey.Id].$network}
													address={contract.$implementation[EntityMetaKey.Id].address}
												/>
											</a>
										</dd>
									</div>
								{/if}

							{#if contract.bytecodeHash}
								<div>
									<dt>Bytecode hash</dt>
									<dd>
										<TruncatedValue
											value={contract.bytecodeHash}
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
											<TruncatedValue
												value={contract.abi}
												format={TruncatedValueFormat.Visual}
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
		open: _detailsOpen,
	})}
		{#if _children}
			{@render _children()}
		{/if}
	{/snippet}
</EntityView>
