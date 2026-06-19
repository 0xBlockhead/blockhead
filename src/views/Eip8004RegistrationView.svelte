<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import { EvmNftFormat } from '$/constants/Evm.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
			selection,
			href,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmNft>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'
	import { select } from '$/routes/+layout.svelte'

	const registration = $derived(selection( { sources: [
				Source.Eip8004Scan_Rest,
			], fields: { format: true, name: true, description: true, image: true, fetchedAt: true, $agentWallet: true } }))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNft}
	entitySelector={selection.entitySelector}
	href={href ?? resolve(
			'/(explore)/(services)/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId]',
		{
			chainId: String(evmChainIdFromCaip2(`${selection.entitySelector.$contract.$network.caip2.namespace}:${selection.entitySelector.$contract.$network.caip2.reference}`)),
			contractAddress: selection.entitySelector.$contract.address,
			tokenId: selection.entitySelector.tokenId,
		},
	)}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary resource={registration}>
			{#snippet children(registration)}
				{#if registration.fields.image}
					<IconComponent
						src={registration.fields.image}
						alt={registration.fields.name ?? selection.entitySelector.tokenId}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span data-text="font-monospace">
			{selection.entitySelector.tokenId}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={registration}
			placeholderText="Loading ERC-8004 registration…"
		>
			{#snippet children(registration)}
				{registration.fields.name ?? selection.entitySelector.tokenId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			On-chain agent identity: registry contract, token id, and registration metadata URI resolved via 8004scan.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={registration}
			placeholderText="Loading ERC-8004 registration…"
		>
			{#snippet children(registration)}
				{#if open && registration.fields.description}
					<p>
						<TruncatedValue
							value={registration.fields.description}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}

				<dl data-column-item="center">
					<div>
						<dt>Network</dt>
						<dd>
							<EvmNetworkView
								selection={select(EntityType.EvmNetwork, selection.entitySelector.$contract.$network)}
								layout={EntityLayout.Value}

							/>
						</dd>
					</div>

					<div>
						<dt>Registry</dt>
						<dd>
							<EvmContractView
								selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
								layout={EntityLayout.Value}
								open={true}
								showTypeAnnotation={false}
							/>
						</dd>
					</div>

					{#if open && registration.fields.agentUri}
						<div>
							<dt>Agent URI</dt>
							<dd>
								<a
									href={registration.fields.agentUri}
									rel="noreferrer"
									target="_blank"
								>{registration.fields.agentUri}</a>
							</dd>
						</div>
					{/if}

					{#if open && registration.fields.$agentWallet}
						<div>
							<dt>Agent wallet</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, registration.fields.$agentWallet[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}

								/>
							</dd>
						</div>
					{/if}

					{#if open && registration.fields.contactEndpoint}
						<div>
							<dt>Contact endpoint</dt>
							<dd>
								<a
									href={registration.fields.contactEndpoint}
									rel="noreferrer"
									target="_blank"
								>{registration.fields.contactEndpoint}</a>
							</dd>
						</div>
					{/if}

					{#if open && registration.fields.registrationTypeIri}
						<div>
							<dt>Registration type</dt>
							<dd>{registration.fields.registrationTypeIri}</dd>
						</div>
					{/if}

					{#if open && registration.fields.x402Support != null}
						<div>
							<dt>x402 support</dt>
							<dd>{registration.fields.x402Support ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if open && registration.fields.active != null}
						<div>
							<dt>Active</dt>
							<dd>{registration.fields.active ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if open && registration.fields.supportedTrust != null && registration.fields.supportedTrust.length > 0}
						<div>
							<dt>Supported trust</dt>
							<dd>{registration.fields.supportedTrust.join(', ')}</dd>
						</div>
					{/if}

					{#if open && registration.fields.fetchedAt != null}
						<div>
							<dt>Fetched</dt>
							<dd>
								<Timestamp
									timestamp={registration.fields.fetchedAt}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

</EntityView>
