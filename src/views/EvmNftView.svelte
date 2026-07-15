<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import IconComponent from '$/components/Icon.svelte'
	import { EvmNftFormat, EvmNftStandard } from '$/constants/Evm.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { UrlString } from '$/schema/UrlString.ts'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.EvmNft>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.EvmNft>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const evmNft = $derived(selection({
		sources: [
			Source.Eip8004Scan_Rest,
		],
		fields: {
			format: true,
			name: true,
			image: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.tokenId) ?? '')].filter(Boolean).join(' ') || 'EVM NFT')
	const viewDomId = $derived('evm-nft-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNft}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.tokenId !== undefined && pendingEntity.$contract !== undefined && pendingEntity.$contract.$network !== undefined && pendingEntity.$contract.$network.caip2 !== undefined && pendingEntity.$contract.$network.caip2.reference !== undefined && pendingEntity.$contract.address !== undefined ? resolve('/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId=stringSegment]', {
			tokenId: String(pendingEntity.tokenId ?? ''),
			chainId: String(pendingEntity.$contract.$network.caip2.reference ?? ''),
			contractAddress: String(pendingEntity.$contract.address ?? ''),
		}) : undefined)
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
						src={String(image)}
						alt={String(entity.name ?? selection.entitySelector.tokenId ?? '')}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={evmNft}>
			{#snippet Pending()}
				{[String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.tokenId) ?? '')].filter(Boolean).join(' ') || 'EVM NFT'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span data-text="font-monospace">
			{String(selection.entitySelector.tokenId ?? '')}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			On-chain agent identity: registry contract, token id, and registration metadata URI resolved via 8004scan.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Contract</dt>
				<dd>
					<EvmContractView
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract, {})}
						href={
							(selection.entitySelector.$contract.address !== undefined && selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
								address: String(selection.entitySelector.$contract.address ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$contract.$network.caip2) ?? ''),
							}) : selection.entitySelector.$contract.address !== undefined && selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
								address: String(selection.entitySelector.$contract.address ?? ''),
								network: String(selection.entitySelector.$contract.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Token ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									tokenId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const tokenId = pendingEntity.tokenId}
							{#if tokenId !== undefined && tokenId !== null}
								{String((tokenId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const tokenId = resolvedEntity.tokenId}
							{#if tokenId !== undefined && tokenId !== null}
								{String((tokenId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Standard</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									standard: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const standard = pendingEntity.standard}
							{#if standard !== undefined && standard !== null}
								{String((standard) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const standard = resolvedEntity.standard}
							{#if standard !== undefined && standard !== null}
								{String((standard) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Format</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									format: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const format = pendingEntity.format}
							{#if format !== undefined && format !== null}
								{String((format) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const format = resolvedEntity.format}
							{#if format !== undefined && format !== null}
								{String((format) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ProjectionBoundary
				resource={selection.Eip8004Registration}
			>
				{#snippet Applicable(projection)}
					<div>
						<dt>Agent registry</dt>
						<dd>
							<ResourceBoundary
								resource={
									projection.agentRegistry({
										fields: {
											agentRegistry: true,
										},
									})
								}
							>
								{#snippet Pending()}{/snippet}
								{#snippet children(agentRegistry)}
									{#if agentRegistry !== undefined && agentRegistry !== null}
										{String((agentRegistry) ?? '')}
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<div>
						<dt>Agent ID</dt>
						<dd>
							<ResourceBoundary
								resource={
									projection.agentId({
										fields: {
											agentId: true,
										},
									})
								}
							>
								{#snippet Pending()}{/snippet}
								{#snippet children(agentId)}
									{#if agentId !== undefined && agentId !== null}
										{String((agentId) ?? '')}
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<ResourceBoundary
						resource={
							projection.agentUri({
								fields: {
									agentUri: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
						{#snippet children(agentUri)}
							{#if agentUri !== undefined && agentUri !== null}
								<div>
									<dt>Agent URI</dt>
									<dd>
										<svelte:element
											this={'a'}
											href={String(agentUri)}
											target="_blank"
											rel="noreferrer noopener"
										>
											<TruncatedValue value={String(agentUri)} />
										</svelte:element>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={
							projection.contactEndpoint({
								fields: {
									contactEndpoint: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
						{#snippet children(contactEndpoint)}
							{#if contactEndpoint !== undefined && contactEndpoint !== null}
								<div>
									<dt>Contact endpoint</dt>
									<dd>
										{String((contactEndpoint) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.$agentWallet}
					>
						{#snippet Pending()}{/snippet}

						{#snippet children(evmAccount)}
							{#if evmAccount != null && evmAccount[EntityMetaKey.Selector] != null}
								<div>
									<dt>Agent wallet</dt>
									<dd>
										<EvmAccountView
											selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
											prefetched={evmAccount}
											href={
												(evmAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/account/[address=evmAddress]', {
													address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
												}) : undefined)
											}
											layout={EntityLayout.Value}
											open={false}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ProjectionBoundary>
		</dl>

		<dl data-column-item="center">
			<ProjectionBoundary
				resource={selection.Eip8004Registration}
			>
				{#snippet Applicable(projection)}
					<ResourceBoundary
						resource={
							projection.x402Support({
								fields: {
									x402Support: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
						{#snippet children(x402Support)}
							{#if x402Support !== undefined && x402Support !== null}
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
					selection({
						fields: {
							active: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const active = pendingEntity.active}
					{#if active !== undefined && active !== null}
						<div>
							<dt>Active</dt>
							<dd>
								{active ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const active = resolvedEntity.active}
					{#if active !== undefined && active !== null}
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
						resource={
							projection.supportedTrust({
								fields: {
									supportedTrust: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
						{#snippet children(supportedTrust)}
							{#if supportedTrust !== undefined && supportedTrust !== null}
								<div>
									<dt>Supported trust</dt>
									<dd>
										{supportedTrust == null ? '' : String(((supportedTrust).join(', ')) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={
							projection.registrationTypeIri({
								fields: {
									registrationTypeIri: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
						{#snippet children(registrationTypeIri)}
							{#if registrationTypeIri !== undefined && registrationTypeIri !== null}
								<div>
									<dt>Registration type IRI</dt>
									<dd>
										{String((registrationTypeIri) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={
							projection.fetchedAt({
								fields: {
									fetchedAt: true,
								},
							})
						}
					>
						{#snippet Pending()}{/snippet}
						{#snippet children(fetchedAt)}
							{#if fetchedAt !== undefined && fetchedAt !== null}
								<div>
									<dt>Fetched at</dt>
									<dd>
										<Timestamp timestamp={Number(fetchedAt)} />
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
				selection({
					fields: {
						description: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const description = resolvedEntity.description}
				{#if description !== undefined && description !== null && description !== ''}
					<p data-text="long-text">{String((description) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
