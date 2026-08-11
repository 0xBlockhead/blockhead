<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.EvmNft> = $props()

	const contract = $derived(selection.entitySelector.$contract)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Eip8004Scan_Rest,
			Source.OpenSea_Rest,
		],
	}))
	const evmNft = $derived(viewSelection({
		fields: {
			format: true,
			name: true,
			image: true,
		},
	}))
	const titleFallback = $derived((prefetched.name ?? '') || selection.entitySelector.tokenId || 'EVM NFT')


	// Components
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNft}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'format' in selection.entitySelector
				&& selection.entitySelector.format === 'Eip8004Registration'
				&& 'caip2' in contract.$network ?
					resolve(
						'/~/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId=stringSegment]',
						{
							chainId: contract.$network.caip2.reference,
							contractAddress: contract.address,
							tokenId: selection.entitySelector.tokenId,
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary resource={evmNft}>
			{#snippet children(entity)}
				{@const image = entity.image}
				{#if image}
					<IconComponent
						src={image}
						alt={entity.name ?? selection.entitySelector.tokenId}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={evmNft}>
			{#snippet children(entity)}
				{(entity.name ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span data-text="font-monospace">{selection.entitySelector.tokenId}</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			On-chain agent identity: registry contract, token id, and registration metadata URI resolved via 8004scan.
		</p>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Contract</dt>
				<dd>
					<EvmContractView
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Token ID</dt>
				<dd>
					{selection.entitySelector.tokenId}
				</dd>
			</div>

			<div>
				<dt>Standard</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									standard: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.standard}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Format</dt>
				<dd>
					<ResourceBoundary
						resource={evmNft}
					>
						{#snippet children(entity)}
							{entity.format}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<ProjectionBoundary
			resource={selection.Eip8004Registration}
		>
			{#snippet Applicable(projection)}
				<dl data-column-item="center">
					<div>
						<dt>Agent registry</dt>
						<dd>
							<ResourceBoundary
								resource={projection.agentRegistry}
							>
								{#snippet children(agentRegistry)}
									{agentRegistry}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<div>
						<dt>Agent ID</dt>
						<dd>
							<ResourceBoundary
								resource={projection.agentId}
							>
								{#snippet children(agentId)}
									{agentId}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<ResourceBoundary
						resource={projection.agentUri}
					>
						{#snippet children(agentUri)}
							{#if agentUri != null}
								<div>
									<dt>Agent URI</dt>
									<dd>
										<a
											href={agentUri}
											target="_blank"
											rel="noreferrer noopener"
										>
											<TruncatedValue value={agentUri} />
										</a>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.contactEndpoint}
					>
						{#snippet children(contactEndpoint)}
							{#if contactEndpoint != null}
								<div>
									<dt>Contact endpoint</dt>
									<dd>
										{contactEndpoint}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.$agentWallet}
					>
						{#snippet children(evmAccount)}
							{#if evmAccount != null}
								{@const evmAccountInitial = untrack(() => evmAccount)}
								<div>
									<dt>Agent wallet</dt>
									<dd>
										<EvmAccountView
											selection={select(EntityType.EvmAccount, (evmAccount ?? evmAccountInitial)[EntityMetaKey.Selector])}
											layout={EntityLayout.Value}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dl>
			{/snippet}
		</ProjectionBoundary>

		<dl data-column-item="center">
			<ProjectionBoundary
				resource={selection.Eip8004Registration}
			>
				{#snippet Applicable(projection)}
					<ResourceBoundary
						resource={projection.x402Support}
					>
						{#snippet children(x402Support)}
							{#if x402Support != null}
								<div>
									<dt>x402 support</dt>
									<dd>
										{x402Support ? 'Yes' : 'No'}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ProjectionBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							active: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const active = entity.active}
					{#if active != null}
						<div>
							<dt>Active</dt>
							<dd>
								{active ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ProjectionBoundary
				resource={selection.Eip8004Registration}
			>
				{#snippet Applicable(projection)}
					<ResourceBoundary
						resource={projection.supportedTrust}
					>
						{#snippet children(supportedTrust)}
							{#if supportedTrust != null}
								<div>
									<dt>Supported trust</dt>
									<dd>
										{supportedTrust.join(', ')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.registrationTypeIri}
					>
						{#snippet children(registrationTypeIri)}
							{#if registrationTypeIri != null}
								<div>
									<dt>Registration type IRI</dt>
									<dd>
										{registrationTypeIri}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.fetchedAt}
					>
						{#snippet children(fetchedAt)}
							{#if fetchedAt != null}
								<div>
									<dt>Fetched at</dt>
									<dd>
										<Timestamp timestamp={fetchedAt} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ProjectionBoundary>
		</dl>

		<ResourceBoundary
			resource={
				viewSelection({
					fields: {
						description: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const description = entity.description}
				{#if description != null && description !== ''}
					<p data-text="long-text">{description}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
