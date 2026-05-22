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


	// Props
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
			children?: Snippet
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

	const contractIdKey = $derived(
		stringify(entityId),
	)


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'


	const contract = useEntity(
		EntityType.EvmContract,
		entityId,
		{
			$: [
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
					...(open && {
						match: {},
						creationMatch: {},
						runtimeMatch: {},
						verifiedAt: {},
						$compilation: {},
						$sourceBundle: {},
					}),
				},
			}),
		},
	)


	// Components
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import EvmContractVerificationView from '$/views/EvmContractVerificationView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import Heading from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
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
	{#snippet Heading()}
		{title}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Smart-contract bytecode at this address answers calls with ABI-encoded calldata.
		</p>
		<p>
			A published ABI explains functions, return data, and ABI event declarations—separate from receipt logs, name-service text records, or EIP-4844 blob sidecars.
		</p>
		<p>
			When the resolver surfaces an implementation contract for this proxy address, behavior follows that implementation and storage layout, not the proxy bytecode alone.
		</p>
	{/snippet}

	{#snippet Title()}
		<TruncatedValue
			format={TruncatedValueFormat.Visual}
			value={entityId.address}
		/>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<div data-column="gap-1">
			<dl data-column-item="center">
				<div>
					<dt>Chain ID</dt>
					<dd>{String(entityId.$network.chainId)}</dd>
				</div>
				{#if open}
					<ResourceBoundary
						placeholderText="Loading contract details…"
						resource={contract}
					>
						{#snippet children(contract)}
							{#if contract.$deployer}
								<div>
									<dt>Deployer</dt>
									<dd>
										<ActorNetworkView
											entityId={{
												$network: entityId.$network,
												$actor: contract.$deployer[EntityMetaKey.Id],
											}}
											href={resolve(
												'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
												{
													networkId: String(entityId.$network.chainId),
													address: contract.$deployer[EntityMetaKey.Id].address,
												},
											)}
											layout={EntityLayout.Title}
											open={false}
											showTypeAnnotation={false}
										/>
									</dd>
								</div>
							{/if}

							{#if contract.$creationTransaction}
								<div>
									<dt>Creation transaction</dt>
									<dd>
										<EvmTransactionView
											entityId={contract.$creationTransaction[EntityMetaKey.Id]}
											href={resolve(
												'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
												{
													networkId: String(entityId.$network.chainId),
													transactionId: contract.$creationTransaction[EntityMetaKey.Id].txHash,
												},
											)}
											layout={EntityLayout.Title}
											open={false}
										/>
									</dd>
								</div>
							{/if}

							{#if contract.$implementation}
								<div>
									<dt>Implementation (proxy)</dt>
									<dd>
										<svelte:self
											entityId={contract.$implementation[EntityMetaKey.Id]}
											href={resolve(
												'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
												{
													networkId: String(entityId.$network.chainId),
													address: contract.$implementation[EntityMetaKey.Id].address,
												},
											)}
											layout={EntityLayout.Title}
											open={false}
											title="Implementation"
										/>
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

							{#if contract.abi !== undefined}
								<div>
									<dt>ABI (JSON)</dt>
									<dd>
										<TruncatedValue
											value={contract.abi}
											format={TruncatedValueFormat.Visual}
										/>
									</dd>
								</div>
							{:else}
								<div>
									<dt>ABI (JSON)</dt>
									<dd>No ABI JSON yet.</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/if}
			</dl>
		</div>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.EvmContract}
			{entityId}
		/>

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${contractIdKey}:carousel-execution`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<Heading>Placement</Heading>
						<Tooltip contentProps={{ side: 'top' }}>
							{#snippet Content()}
								<p>
									Deployment is anchored on this execution-chain id and contract address—state transitions and receipts for this bytecode live there.
								</p>
								<p>
									Validators finalize blocks that advance this contract’s storage and balance state.
								</p>
							{/snippet}
							<abbr
								class="entity-heading-tip"
								aria-label="Execution placement"
							>ⓘ</abbr>
						</Tooltip>
					</header>
				{/snippet}

				{#snippet Markers(_context)}
					<a
						data-scroll-marker-label="Home"
						href={`#${contractIdKey}:home-network`}
					>Home</a>
					{#if _children}
						<a
							data-scroll-marker-label="Route"
							href={`#${contractIdKey}:page-content`}
						>Route</a>
					{/if}
				{/snippet}

				{#snippet body(_ctx)}
					<section
						id={`${contractIdKey}:home-network`}
					>
						<NetworkView
							entityId={{
								chainId: entityId.$network.chainId,
							}}
							href={resolve(
								'/(explore)/(networks)/network/[networkId]',
								{ networkId: String(entityId.$network.chainId) },
							)}
							layout={EntityLayout.Summary}
						/>
					</section>

					{#if _children}
						<section
							id={`${contractIdKey}:page-content`}
						>
							{@render _children()}
						</section>
					{/if}
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${contractIdKey}:carousel-contract-details`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<Heading>Contract details</Heading>
					</header>
				{/snippet}

				{#snippet Markers(_context)}
					<ResourceBoundary resource={contract}>
						{#snippet children(contract)}
							{#if contract.$deployer || contract.$creationTransaction}
								<a
									data-scroll-marker-label="Deployment"
									href={`#${contractIdKey}:contract-deployment`}
								>Deployment</a>
							{/if}

							{#if contract.$verification}
								<a
									data-scroll-marker-label="Verification"
									href={`#${contractIdKey}:contract-verification`}
								>Verification</a>
							{/if}

							{#if contract.bytecodeHash || contract.code}
								<a
									data-scroll-marker-label="Bytecode"
									href={`#${contractIdKey}:contract-bytecode`}
								>Bytecode</a>
							{/if}

							{#if (contract.storageSlotReads ?? []).length > 0}
								<a
									data-scroll-marker-label="Slots"
									href={`#${contractIdKey}:contract-storage-slots`}
								>Slots</a>
							{/if}

							{#if contract.$implementation}
								<a
									data-scroll-marker-label="Proxy"
									href={`#${contractIdKey}:contract-proxy`}
								>Proxy</a>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet body(_ctx)}
					<ResourceBoundary resource={contract}>
						{#snippet children(contract)}
							{#if contract.$deployer || contract.$creationTransaction}
								<section id={`${contractIdKey}:contract-deployment`}>
									{#if contract.$deployer}
										<div class="entity-details">
											<ActorNetworkView
												entityId={{
													$network: entityId.$network,
													$actor: contract.$deployer[EntityMetaKey.Id],
												}}
												href={resolve(
													'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
													{
														networkId: String(entityId.$network.chainId),
														address: contract.$deployer[EntityMetaKey.Id].address,
													},
												)}
												layout={EntityLayout.Title}
												showTypeAnnotation={false}
											/>
										</div>
									{/if}

									{#if contract.$creationTransaction}
										<div class="entity-details">
											<EvmTransactionView
												entityId={contract.$creationTransaction[EntityMetaKey.Id]}
												href={resolve(
													'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
													{
														networkId: String(entityId.$network.chainId),
														transactionId: contract.$creationTransaction[EntityMetaKey.Id].txHash,
													},
												)}
												layout={EntityLayout.Title}
											/>
										</div>
									{/if}
								</section>
							{/if}

							{#if contract.$verification}
								<section id={`${contractIdKey}:contract-verification`}>
									<EvmContractVerificationView
										entityId={contract.$verification[EntityMetaKey.Id]}
										href={resolve(
											'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
											{
												networkId: String(entityId.$network.chainId),
												address: entityId.address,
											},
										)}
										layout={EntityLayout.SummaryDetails}
										open={true}
									/>
								</section>
							{/if}

							{#if contract.bytecodeHash || contract.code}
								<section id={`${contractIdKey}:contract-bytecode`}>
									{#if contract.bytecodeHash}
										<div class="entity-details">
											<div data-row="inline wrap gap-2 align-baseline">
												<span data-text="annotation">Bytecode hash</span>
												<TruncatedValue
													value={contract.bytecodeHash}
													format={TruncatedValueFormat.Visual}
												/>
											</div>
										</div>
									{/if}

									{#if contract.code}
										<div class="entity-details">
											<div data-row="inline wrap gap-2 align-baseline">
												<span data-text="annotation">Runtime bytecode</span>
												<TruncatedValue
													value={contract.code}
													format={TruncatedValueFormat.Visual}
												/>
											</div>
										</div>
									{/if}
								</section>
							{/if}

							{#if (contract.storageSlotReads ?? []).length > 0}
								<section id={`${contractIdKey}:contract-storage-slots`}>
									<div class="entity-details">
										<div data-row="wrap align-center gap-2">
											<span data-text="annotation">Sampled storage slots</span>
											<Tooltip contentProps={{ side: 'top' }}>
												{#snippet Content()}
													<p>First contiguous slots sampled from the archive RPC (bounded); use explorers for exhaustive storage views.</p>
												{/snippet}
												<abbr
													class="entity-heading-tip"
													aria-label="Slot sampling"
												>ⓘ</abbr>
											</Tooltip>
										</div>
										<table>
											<thead>
												<tr>
													<th scope="col" data-text="annotation">Slot</th>
													<th scope="col" data-text="annotation">Value</th>
												</tr>
											</thead>
											<tbody>
												{#each (
													contract.storageSlotReads
													?? []
												) as row (`${row.slot}`)}
													<tr>
														<td>
															<TruncatedValue
																value={row.slot}
																format={TruncatedValueFormat.Visual}
															/>
														</td>
														<td>
															<TruncatedValue
																value={row.value}
																format={TruncatedValueFormat.Visual}
															/>
														</td>
													</tr>
												{/each}
											</tbody>
										</table>
									</div>
								</section>
							{/if}

							{#if contract.$implementation}
								<section id={`${contractIdKey}:contract-proxy`}>
									<div class="entity-details">
										<svelte:self
											entityId={contract.$implementation[EntityMetaKey.Id]}
											href={resolve(
												'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
												{
													networkId: String(entityId.$network.chainId),
													address: contract.$implementation[EntityMetaKey.Id].address,
												},
											)}
											layout={EntityLayout.Title}
											title="Implementation"
										/>
									</div>
								</section>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>


<style>
	.entity-view-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 40ch;
			}
		}
	}
</style>
