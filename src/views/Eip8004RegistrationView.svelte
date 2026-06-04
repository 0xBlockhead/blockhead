<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EvmNftFormat } from '$/constants/Evm.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
			entityId,
			href = resolve(
				'/(explore)/(services)/services/agent/[chainId]/[contractAddress]/[tokenId]',
				{
					chainId: String(evmChainIdFromCaip2(`${entityId.$contract.$network.caip2.namespace}:${entityId.$contract.$network.caip2.reference}`)),
					contractAddress: entityId.$contract.address,
					tokenId: entityId.tokenId,
				},
			),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmNft>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const registration = useEntity(
		EntityType.EvmNft,
		entityId,
		{
			$: [
				Source.Eip8004Scan_Rest,
			],
			format: {},
			name: {},
			description: {},
			image: {},
			fetchedAt: {},
			$case: {
				format: {
					[EvmNftFormat.Eip8004Registration]: {
						agentRegistry: {},
						agentId: {},
						agentUri: {},
						$agentWallet: {},
						contactEndpoint: {},
						registrationTypeIri: {},
						x402Support: {},
						active: {},
						supportedTrust: {},
					},
				},
			},
		},
	)


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
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary resource={registration}>
			{#snippet children(registration)}
				{#if registration.image}
					<IconComponent
						src={registration.image}
						alt={registration.name ?? entityId.tokenId}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span data-text="font-monospace">
			{entityId.tokenId}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={registration}
			placeholderText="Loading ERC-8004 registration…"
		>
			{#snippet children(registration)}
				{registration.name ?? entityId.tokenId}
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
				{#if open && registration.description}
					<p>
						<TruncatedValue
							value={registration.description}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}

				<dl data-column-item="center">
					<div>
						<dt>Network</dt>
						<dd>
							<EvmNetworkView
								entityId={entityId.$contract.$network}
								layout={EntityLayout.Value}
								open={false}
							/>
						</dd>
					</div>

					<div>
						<dt>Registry</dt>
						<dd>
							<EvmContractView
								entityId={entityId.$contract}
								layout={EntityLayout.Value}
								open={true}
								showTypeAnnotation={false}
							/>
						</dd>
					</div>

					{#if open && registration.agentUri}
						<div>
							<dt>Agent URI</dt>
							<dd>
								<a
									href={registration.agentUri}
									rel="noreferrer"
									target="_blank"
								>{registration.agentUri}</a>
							</dd>
						</div>
					{/if}

					{#if open && registration.$agentWallet}
						<div>
							<dt>Agent wallet</dt>
							<dd>
								<EvmAccountView
									entityId={registration.$agentWallet[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if open && registration.contactEndpoint}
						<div>
							<dt>Contact endpoint</dt>
							<dd>
								<a
									href={registration.contactEndpoint}
									rel="noreferrer"
									target="_blank"
								>{registration.contactEndpoint}</a>
							</dd>
						</div>
					{/if}

					{#if open && registration.registrationTypeIri}
						<div>
							<dt>Registration type</dt>
							<dd>{registration.registrationTypeIri}</dd>
						</div>
					{/if}

					{#if open && registration.x402Support != null}
						<div>
							<dt>x402 support</dt>
							<dd>{registration.x402Support ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if open && registration.active != null}
						<div>
							<dt>Active</dt>
							<dd>{registration.active ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if open && registration.supportedTrust != null && registration.supportedTrust.length > 0}
						<div>
							<dt>Supported trust</dt>
							<dd>{registration.supportedTrust.join(', ')}</dd>
						</div>
					{/if}

					{#if open && registration.fetchedAt != null}
						<div>
							<dt>Fetched</dt>
							<dd>
								<Timestamp
									timestamp={registration.fetchedAt}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

</EntityView>
