<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
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
			'/(explore)/(services)/services/eip-8004/[serviceId]',
			{ serviceId: entityId.serviceId },
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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.Eip8004Service}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
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
			{#snippet children(loadedService)}
				{loadedService.name ?? entityId.identityId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		{@render Title()}
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
			{#snippet children(loadedService)}
				<dl data-column-item="center">
					<div>
						<dt>Network</dt>
						<dd>{String(entityId.$network.chainId)}</dd>
					</div>

					<div>
						<dt>Registry</dt>
						<dd>
							{#if loadedService.$registry}
								<EvmContractView
									entityId={loadedService.$registry[EntityMetaKey.Id]}
									layout={EntityLayout.SummaryDetails}
									open={true}
									showTypeAnnotation={false}
								/>
							{/if}
						</dd>
					</div>

					{#if open}
						<div>
							<dt>Registration URI</dt>
							<dd>
								<a
									href={loadedService.registrationUri}
									rel="noreferrer"
									target="_blank"
								>{loadedService.registrationUri}</a>
							</dd>
						</div>

						{#if loadedService.contactEndpoint}
							<div>
								<dt>Contact endpoint</dt>
								<dd>
									<a
										href={loadedService.contactEndpoint}
										rel="noreferrer"
										target="_blank"
									>{loadedService.contactEndpoint}</a>
								</dd>
							</div>
						{/if}

						{#if loadedService.description}
							<div>
								<dt>Description</dt>
								<dd>
									<p>{loadedService.description}</p>
								</dd>
							</div>
						{/if}

						{#if loadedService.registrationTypeIri}
							<div>
								<dt>Registration type</dt>
								<dd>{loadedService.registrationTypeIri}</dd>
							</div>
						{/if}

						{#if loadedService.x402Support != null}
							<div>
								<dt>x402 support</dt>
								<dd>{loadedService.x402Support ? 'Yes' : 'No'}</dd>
							</div>
						{/if}

						{#if loadedService.active != null}
							<div>
								<dt>Active</dt>
								<dd>{loadedService.active ? 'Yes' : 'No'}</dd>
							</div>
						{/if}

						{#if loadedService.supportedTrust != null && service.supportedTrust.length > 0}
							<div>
								<dt>Supported trust</dt>
								<dd>{loadedService.supportedTrust.join(', ')}</dd>
							</div>
						{/if}

						{#if loadedService.image}
							<div>
								<dt>Image</dt>
								<dd>
									<a
										href={loadedService.image}
										rel="noreferrer"
										target="_blank"
									>{loadedService.image}</a>
								</dd>
							</div>
						{/if}

						<div>
							<dt>Fetched</dt>
							<dd>
								<Timestamp
									timestamp={loadedService.fetchedAt}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
		<EntityDetails
			entityType={EntityType.Eip8004Service}
			{entityId}
		/>
	{/snippet}
</EntityView>
