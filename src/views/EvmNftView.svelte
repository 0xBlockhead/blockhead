<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import IconComponent from '$/components/Icon.svelte'
	import { EvmNftFormat, EvmNftStandard } from '$/constants/Evm.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmNft>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmNft>>
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

	const evmNft = $derived(selection({
		sources: [
			Source.Eip8004Scan_Rest,
		],
		fields: {
			format: true,
			name: true,
			image: true,
			...(open && {
				description: true,
				tokenUri: true,
				agentUri: true,
				contactEndpoint: true,
				$agentWallet: true,
				x402Support: true,
				active: true,
				supportedTrust: true,
				registrationTypeIri: true,
				fetchedAt: true,
				standard: true,
				agentRegistry: true,
				agentId: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.tokenId) ?? '')].filter(Boolean).join(' ') || 'EVM NFT')
	const viewDomId = $derived('evm-nft-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNft}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId]', {
			chainId: String(({ ...selection.entitySelector, ...prefetched }).$contract.$network.caip2.reference),
			contractAddress: String(({ ...selection.entitySelector, ...prefetched }).$contract.address),
			tokenId: String(({ ...selection.entitySelector, ...prefetched }).tokenId),
		})
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
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.tokenId) ?? '')].filter(Boolean).join(' ') || 'EVM NFT'}
		{:else}
			<ResourceBoundary resource={evmNft}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.tokenId) ?? '')].filter(Boolean).join(' ') || 'EVM NFT'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
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
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
								caip2: `${String(selection.entitySelector.$contract.$network.caip2.namespace)}:${String(selection.entitySelector.$contract.$network.caip2.reference)}`,
								address: String(selection.entitySelector.$contract.address),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Standard</dt>
				<dd>
					<ResourceBoundary resource={evmNft}>
						{#snippet Pending()}
							{@const standard = prefetched.standard ?? selection.entitySelector.standard}
							{#if standard !== undefined && standard !== null}
								{String((standard) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const standard = entity.standard ?? selection.entitySelector.standard ?? prefetched.standard}
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
					<ResourceBoundary resource={evmNft}>
						{#snippet Pending()}
							{@const format = prefetched.format ?? selection.entitySelector.format}
							{#if format !== undefined && format !== null}
								{String((format) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const format = entity.format ?? selection.entitySelector.format ?? prefetched.format}
							{#if format !== undefined && format !== null}
								{String((format) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={evmNft}>
				{#snippet Pending()}
					{@const agentRegistry = prefetched.agentRegistry ?? selection.entitySelector.agentRegistry}
					{#if agentRegistry !== undefined && agentRegistry !== null}
						<div>
							<dt>Agent registry</dt>
							<dd>
								{String((agentRegistry) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const agentRegistry = entity.agentRegistry ?? selection.entitySelector.agentRegistry ?? prefetched.agentRegistry}
					{#if agentRegistry !== undefined && agentRegistry !== null}
						<div>
							<dt>Agent registry</dt>
							<dd>
								{String((agentRegistry) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={evmNft}>
				{#snippet Pending()}
					{@const agentId = prefetched.agentId ?? selection.entitySelector.agentId}
					{#if agentId !== undefined && agentId !== null}
						<div>
							<dt>Agent ID</dt>
							<dd>
								{String((agentId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const agentId = entity.agentId ?? selection.entitySelector.agentId ?? prefetched.agentId}
					{#if agentId !== undefined && agentId !== null}
						<div>
							<dt>Agent ID</dt>
							<dd>
								{String((agentId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={evmNft}>
				{#snippet Pending()}
					{@const agentUri = prefetched.agentUri ?? selection.entitySelector.agentUri}
					{#if agentUri !== undefined && agentUri !== null}
						<div>
							<dt>Agent URI</dt>
							<dd>
								{String((agentUri) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const agentUri = entity.agentUri ?? selection.entitySelector.agentUri ?? prefetched.agentUri}
					{#if agentUri !== undefined && agentUri !== null}
						<div>
							<dt>Agent URI</dt>
							<dd>
								{String((agentUri) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={evmNft}>
				{#snippet Pending()}
					{@const contactEndpoint = prefetched.contactEndpoint ?? selection.entitySelector.contactEndpoint}
					{#if contactEndpoint !== undefined && contactEndpoint !== null}
						<div>
							<dt>Contact endpoint</dt>
							<dd>
								{String((contactEndpoint) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const contactEndpoint = entity.contactEndpoint ?? selection.entitySelector.contactEndpoint ?? prefetched.contactEndpoint}
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
				resource={selection[EntityProxyField]<EntityType.EvmAccount, false>('$agentWallet')}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>Agent wallet</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount.entitySelector)}
									prefetched={evmAccount}
									href={
										resolve('/(explore)/account/[address=evmAddress]', {
											address: String(evmAccount.entitySelector.address),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={evmNft}>
				{#snippet Pending()}
					{@const x402Support = prefetched.x402Support ?? selection.entitySelector.x402Support}
					{#if x402Support !== undefined && x402Support !== null}
						<div>
							<dt>x402 support</dt>
							<dd>
								{String((x402Support) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const x402Support = entity.x402Support ?? selection.entitySelector.x402Support ?? prefetched.x402Support}
					{#if x402Support !== undefined && x402Support !== null}
						<div>
							<dt>x402 support</dt>
							<dd>
								{String((x402Support) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={evmNft}>
				{#snippet Pending()}
					{@const active = prefetched.active ?? selection.entitySelector.active}
					{#if active !== undefined && active !== null}
						<div>
							<dt>Active</dt>
							<dd>
								{String((active) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const active = entity.active ?? selection.entitySelector.active ?? prefetched.active}
					{#if active !== undefined && active !== null}
						<div>
							<dt>Active</dt>
							<dd>
								{String((active) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={evmNft}>
				{#snippet Pending()}
					{@const supportedTrust = prefetched.supportedTrust ?? selection.entitySelector.supportedTrust}
					{#if supportedTrust !== undefined && supportedTrust !== null}
						<div>
							<dt>Supported trust</dt>
							<dd>
								{supportedTrust == null ? '' : String(((supportedTrust).join(', ')) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const supportedTrust = entity.supportedTrust ?? selection.entitySelector.supportedTrust ?? prefetched.supportedTrust}
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

			<ResourceBoundary resource={evmNft}>
				{#snippet Pending()}
					{@const registrationTypeIri = prefetched.registrationTypeIri ?? selection.entitySelector.registrationTypeIri}
					{#if registrationTypeIri !== undefined && registrationTypeIri !== null}
						<div>
							<dt>Registration type IRI</dt>
							<dd>
								{String((registrationTypeIri) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const registrationTypeIri = entity.registrationTypeIri ?? selection.entitySelector.registrationTypeIri ?? prefetched.registrationTypeIri}
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

			<ResourceBoundary resource={evmNft}>
				{#snippet Pending()}
					{@const fetchedAt = prefetched.fetchedAt ?? selection.entitySelector.fetchedAt}
					{#if fetchedAt !== undefined && fetchedAt !== null}
						<div>
							<dt>Fetched at</dt>
							<dd>
								<Timestamp timestamp={Number(fetchedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const fetchedAt = entity.fetchedAt ?? selection.entitySelector.fetchedAt ?? prefetched.fetchedAt}
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
		</dl>

		<ResourceBoundary resource={evmNft}>
			{#snippet children(entity)}
				{@const description = entity.description ?? selection.entitySelector.description ?? prefetched.description}
				{#if description === undefined || description === null || description === ''}
					<p data-text="muted">No description available.</p>
				{:else}
					<p data-text="long-text">{String((description) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
