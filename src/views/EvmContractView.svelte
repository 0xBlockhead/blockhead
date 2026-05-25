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


	// (Derived)
	const contractIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import Address from '$/views/Address.svelte'
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
	import EvmContractView from '$/views/EvmContractView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


{#snippet PlacementTooltipContent()}
	<p>
		Deployment is anchored on this execution-chain id and contract address—state transitions and receipts for this bytecode live there.
	</p>
	<p>
		Validators finalize blocks that advance this contract’s storage and balance state.
	</p>
{/snippet}

{#snippet StorageSlotsTooltipContent()}
	<p>First contiguous slots sampled from the archive RPC (bounded); use explorers for exhaustive storage views.</p>
{/snippet}


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
		{contract.ready && contract.current.precompileName ?
			'Precompile'
		:
			title}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Smart-contract bytecode at this address answers calls with ABI-encoded calldata.
		</p>
		<p>
			Precompiles are native protocol contracts with fixed addresses—no deployer, creation transaction, or published ABI.
		</p>
		<p>
			A published ABI explains functions, return data, and ABI event declarations—separate from receipt logs, name-service text records, or EIP-4844 blob sidecars.
		</p>
		<p>
			When the resolver surfaces an implementation contract for this proxy address, behavior follows that implementation and storage layout, not the proxy bytecode alone.
		</p>
	{/snippet}

	{#snippet Value()}
		{#if contract.ready && contract.current.precompileName}
			{contract.current.precompileName}
		{:else}
			<TruncatedValue
				format={TruncatedValueFormat.Visual}
				value={entityId.address}
			/>
		{/if}
	{/snippet}

	{#snippet Title()}
		{contract.ready && contract.current.precompileName ?
			'Precompile'
		:
			title}
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<div data-column="gap-1">
			<dl data-column-item="center">
				<div>
					<dt>Chain ID</dt>
					<dd>{String(entityId.$network.chainId)}</dd>
				</div>
				{#if contentOpen}
					<ResourceBoundary
						placeholderText="Loading contract details…"
						resource={contract}
					>
						{#snippet children(loadedContract)}
							{#if loadedContract.precompileName}
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

							{#if !loadedContract.precompileName && loadedContract.$deployer}
								<div>
									<dt>Deployer</dt>
									<dd>
										<ActorNetworkView
											entityId={{
												$network: entityId.$network,
												$actor: loadedContract.$deployer[EntityMetaKey.Id],
											}}
											href={resolve(
												'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
												{
													networkId: String(entityId.$network.chainId),
													address: loadedContract.$deployer[EntityMetaKey.Id].address,
												},
											)}
											layout={EntityLayout.Title}
											open={false}
										/>
									</dd>
								</div>
							{/if}

							{#if !loadedContract.precompileName && contract.$creationTransaction}
								<div>
									<dt>Creation transaction</dt>
									<dd>
										<EvmTransactionView
											entityId={loadedContract.$creationTransaction[EntityMetaKey.Id]}
											href={resolve(
												'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
												{
													networkId: String(entityId.$network.chainId),
													transactionId: loadedContract.$creationTransaction[EntityMetaKey.Id].txHash,
												},
											)}
											layout={EntityLayout.Title}
											open={false}
										/>
									</dd>
								</div>
							{/if}

							{#if !loadedContract.precompileName && contract.$implementation}
								<div>
									<dt>Implementation (proxy)</dt>
									<dd>
										<EvmContractView
											entityId={loadedContract.$implementation[EntityMetaKey.Id]}
											href={resolve(
												'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
												{
													networkId: String(entityId.$network.chainId),
													address: loadedContract.$implementation[EntityMetaKey.Id].address,
												},
											)}
											layout={EntityLayout.Title}
											open={false}
											title="Implementation"
										/>
									</dd>
								</div>
							{/if}

							{#if loadedContract.bytecodeHash}
								<div>
									<dt>Bytecode hash</dt>
									<dd>
										<TruncatedValue
											value={loadedContract.bytecodeHash}
											format={TruncatedValueFormat.Visual}
										/>
									</dd>
								</div>
							{/if}

							{#if loadedContract.code}
								<div>
									<dt>Runtime bytecode</dt>
									<dd>
										<TruncatedValue
											value={loadedContract.code}
											format={TruncatedValueFormat.Visual}
										/>
									</dd>
								</div>
							{/if}

							{#if !loadedContract.precompileName}
								{#if loadedContract.abi !== undefined}
									<div>
										<dt>ABI (JSON)</dt>
										<dd>
											<TruncatedValue
												value={loadedContract.abi}
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
		<EntityDetails
			entityType={EntityType.EvmContract}
			{entityId}
		/>
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
			data-carousel-basis="40ch"
		>
			<CollapsibleTabs
				id={`${contractIdKey}:carousel-execution`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
				Summary={PlacementCarouselSummary}
				Markers={PlacementCarouselMarkers}
				body={PlacementCarouselBody}
			/>
			<CollapsibleTabs
				id={`${contractIdKey}:carousel-contract-details`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
				Summary={ContractDetailsCarouselSummary}
				Markers={ContractDetailsCarouselMarkers}
				body={ContractDetailsCarouselBody}
			/>
		</div>
	{/snippet}
</EntityView>


{#snippet PlacementCarouselSummary({ open: _isOpen })}
	<header data-row-item="flexible" data-row="wrap gap-4">
		<Heading>Placement</Heading>
		<Tooltip
			contentProps={{ side: 'top' }}
			Content={PlacementTooltipContent}
		>
			<abbr
				class="entity-heading-tip"
				aria-label="Execution placement"
			>ⓘ</abbr>
		</Tooltip>
	</header>
{/snippet}

{#snippet PlacementCarouselMarkers({ open: _markersOpen })}
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

{#snippet PlacementCarouselBody({ open: _bodyOpen })}
	<section id={`${contractIdKey}:home-network`}>
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
		<section id={`${contractIdKey}:page-content`}>
			{@render _children()}
		</section>
	{/if}
{/snippet}

{#snippet ContractDetailsCarouselSummary({ open: _isOpen })}
	<header data-row-item="flexible" data-row="wrap gap-4">
		<Heading>Contract details</Heading>
	</header>
{/snippet}

{#snippet ContractDetailsCarouselMarkers({ open: _markersOpen })}
	<ResourceBoundary resource={contract}>
		{#snippet children(loadedContract)}
			{#if !loadedContract.precompileName && (loadedContract.$deployer || loadedContract.$creationTransaction)}
				<a
					data-scroll-marker-label="Deployment"
					href={`#${contractIdKey}:contract-deployment`}
				>Deployment</a>
			{/if}

			{#if !loadedContract.precompileName && loadedContract.$verification}
				<a
					data-scroll-marker-label="Verification"
					href={`#${contractIdKey}:contract-verification`}
				>Verification</a>
			{/if}

			{#if loadedContract.bytecodeHash || loadedContract.code}
				<a
					data-scroll-marker-label="Bytecode"
					href={`#${contractIdKey}:contract-bytecode`}
				>Bytecode</a>
			{/if}

			{#if (loadedContract.storageSlotReads ?? []).length > 0}
				<a
					data-scroll-marker-label="Slots"
					href={`#${contractIdKey}:contract-storage-slots`}
				>Slots</a>
			{/if}

			{#if !loadedContract.precompileName && loadedContract.$implementation}
				<a
					data-scroll-marker-label="Proxy"
					href={`#${contractIdKey}:contract-proxy`}
				>Proxy</a>
			{/if}
		{/snippet}
	</ResourceBoundary>
{/snippet}

{#snippet ContractDetailsCarouselBody({ open: _bodyOpen })}
	<ResourceBoundary resource={contract}>
		{#snippet children(loadedContract)}
			{#if !loadedContract.precompileName && (loadedContract.$deployer || loadedContract.$creationTransaction)}
				<section id={`${contractIdKey}:contract-deployment`}>
					{#if loadedContract.$deployer}
						<div class="entity-details">
							<ActorNetworkView
								entityId={{
									$network: entityId.$network,
									$actor: loadedContract.$deployer[EntityMetaKey.Id],
								}}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
									{
										networkId: String(entityId.$network.chainId),
										address: loadedContract.$deployer[EntityMetaKey.Id].address,
									},
								)}
								layout={EntityLayout.Title}
							/>
						</div>
					{/if}

					{#if loadedContract.$creationTransaction}
						<div class="entity-details">
							<EvmTransactionView
								entityId={loadedContract.$creationTransaction[EntityMetaKey.Id]}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
									{
										networkId: String(entityId.$network.chainId),
										transactionId: loadedContract.$creationTransaction[EntityMetaKey.Id].txHash,
									},
								)}
								layout={EntityLayout.Title}
							/>
						</div>
					{/if}
				</section>
			{/if}

			{#if !loadedContract.precompileName && loadedContract.$verification}
				<section id={`${contractIdKey}:contract-verification`}>
					<EvmContractVerificationView
						entityId={loadedContract.$verification[EntityMetaKey.Id]}
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

			{#if loadedContract.bytecodeHash || loadedContract.code}
				<section id={`${contractIdKey}:contract-bytecode`}>
					{#if loadedContract.bytecodeHash}
						<div class="entity-details">
							<div data-row="inline wrap gap-2 align-baseline">
								<span data-text="annotation">Bytecode hash</span>
								<TruncatedValue
									value={loadedContract.bytecodeHash}
									format={TruncatedValueFormat.Visual}
								/>
							</div>
						</div>
					{/if}

					{#if loadedContract.code}
						<div class="entity-details">
							<div data-row="inline wrap gap-2 align-baseline">
								<span data-text="annotation">Runtime bytecode</span>
								<TruncatedValue
									value={loadedContract.code}
									format={TruncatedValueFormat.Visual}
								/>
							</div>
						</div>
					{/if}
				</section>
			{/if}

			{#if (loadedContract.storageSlotReads ?? []).length > 0}
				<section id={`${contractIdKey}:contract-storage-slots`}>
					<div class="entity-details">
						<div data-row="wrap align-center gap-2">
							<span data-text="annotation">Sampled storage slots</span>
							<Tooltip
								contentProps={{ side: 'top' }}
								Content={StorageSlotsTooltipContent}
							>
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
									loadedContract.storageSlotReads
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

			{#if !loadedContract.precompileName && loadedContract.$implementation}
				<section id={`${contractIdKey}:contract-proxy`}>
					<div class="entity-details">
						<EvmContractView
							entityId={loadedContract.$implementation[EntityMetaKey.Id]}
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
								{
									networkId: String(entityId.$network.chainId),
									address: loadedContract.$implementation[EntityMetaKey.Id].address,
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


