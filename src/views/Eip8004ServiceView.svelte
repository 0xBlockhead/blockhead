<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'
	import { evmChainIdFromNetworkId } from '$/lib/caip.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
			entityId,
			href = resolve(
				'/(explore)/(services)/services/agent/[chainId]/[identityId]',
				{
					chainId: String(evmChainIdFromNetworkId(entityId.$network)),
					identityId: entityId.identityId,
				},
			),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Eip8004Service>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const service = useEntity(
		EntityType.Eip8004Service,
		entityId,
		{
			$: [
				Source.Eip8004Scan_Rest,
			],
			$registry: {},
			registrationUri: {},
			contactEndpoint: {},
			name: {},
			description: {},
			image: {},
			registrationTypeIri: {},
			x402Support: {},
			active: {},
			supportedTrust: {},
			fetchedAt: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.Eip8004Service}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary resource={service}>
			{#snippet children(service)}
				{#if service.image}
					<IconComponent
						src={service.image}
						alt={service.name ?? entityId.identityId}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span data-text="font-monospace">
			{entityId.identityId}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={service}
			placeholderText="Loading agent service…"
		>
			{#snippet children(service)}
				{service.name ?? entityId.identityId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			On-chain agent identity: registry contract, token id, and registration metadata URI resolved via 8004scan.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={service}
			placeholderText="Loading agent service…"
		>
			{#snippet children(service)}
				{#if open && service.description}
					<p>
						<TruncatedValue
							value={service.description}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}

				<dl data-column-item="center">
					<div>
						<dt>Network</dt>
						<dd>
							<EvmNetworkView
								entityId={entityId.$network}
								layout={EntityLayout.Value}
								open={false}
							/>
						</dd>
					</div>

					{#if service.$registry}
						<div>
							<dt>Registry</dt>
							<dd>
								<EvmContractView
									entityId={service.$registry[EntityMetaKey.Id]}
									layout={EntityLayout.SummaryDetails}
									open={true}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}

					{#if open && service.registrationUri}
						<div>
							<dt>Registration URI</dt>
							<dd>
								<a
									href={service.registrationUri}
									rel="noreferrer"
									target="_blank"
								>{service.registrationUri}</a>
							</dd>
						</div>
					{/if}

					{#if open && service.contactEndpoint}
						<div>
							<dt>Contact endpoint</dt>
							<dd>
								<a
									href={service.contactEndpoint}
									rel="noreferrer"
									target="_blank"
								>{service.contactEndpoint}</a>
							</dd>
						</div>
					{/if}

					{#if open && service.registrationTypeIri}
						<div>
							<dt>Registration type</dt>
							<dd>{service.registrationTypeIri}</dd>
						</div>
					{/if}

					{#if open && service.x402Support != null}
						<div>
							<dt>x402 support</dt>
							<dd>{service.x402Support ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if open && service.active != null}
						<div>
							<dt>Active</dt>
							<dd>{service.active ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if open && service.supportedTrust != null && service.supportedTrust.length > 0}
						<div>
							<dt>Supported trust</dt>
							<dd>{service.supportedTrust.join(', ')}</dd>
						</div>
					{/if}

					{#if open && service.image}
						<div>
							<dt>Image</dt>
							<dd>
								<a
									href={service.image}
									rel="noreferrer"
									target="_blank"
								>{service.image}</a>
							</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Fetched</dt>
							<dd>
								<Timestamp
									timestamp={service.fetchedAt}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
	{/snippet}
</EntityView>
