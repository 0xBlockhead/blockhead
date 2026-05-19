<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import { resolve } from '$app/paths'

	import { EvmAccountAbstractionRegistryRole } from '$/constants/EvmAccountAbstractionRegistryRole.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Props
	let {
		entityId,

		href: hrefProp,

		layout = EntityLayout.SummaryDetails,

		open = $bindable(layout === EntityLayout.SummaryDetails),

		title = 'Account abstraction address',

		children,

		...entityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmAccountAbstractionAddress>

			href?: string

			layout?: EntityLayout

			open?: boolean

			title?: string

			children?: Snippet
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'Heading'
			| 'href'
			| 'layout'
			| 'open'
			| 'title'
		>
	> = $props()


	const aaRoleHeading = (
		role: EvmAccountAbstractionRegistryRole,
	) => (
		role === EvmAccountAbstractionRegistryRole.SmartAccount ?
			'Smart account'
		: role === EvmAccountAbstractionRegistryRole.Bundler ?
			'Bundler'
		: role === EvmAccountAbstractionRegistryRole.Paymaster ?
			'Paymaster'
		:
			'Factory'
	)


	const href = $derived(
		hrefProp
		?? resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/account-abstraction/[aaRole]/[address]',
			{
				networkId: String(entityId.$network.chainId),
				aaRole: entityId.role,
				address: entityId.address,
			},
		),
	)


	// State
	const row = useEntity(
		EntityType.EvmAccountAbstractionAddress,
		entityId,
		{
			$: [
				Source.Blockscout_Rest,
			],
			totalOperations: {},
		},
	)


	// Components
	import Address from '$/views/Address.svelte'
	import ContractView from '$/views/ContractView.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
</script>


<EntityView
	entityType={EntityType.EvmAccountAbstractionAddress}
	{entityId}
	{layout}
	bind:open
	{title}
	{...entityViewProps}
	href={href}
>
	{#snippet Heading()}
		<span data-row="wrap gap-2 align-center">
			<span data-tag>{aaRoleHeading(entityId.role)}</span>
			<Address
				address={entityId.address}
				network={entityId.$network}
			/>
		</span>
	{/snippet}

	{#snippet Id()}
		<Address
			address={entityId.address}
			network={entityId.$network}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Indexed ERC-4337 registry participant on this chain (role + contract address).
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<ResourceBoundary
			placeholderText="Loading…"
			resource={row}
		>
			{#snippet children(loaded)}
				<dl data-column-item="center">
					<div>
						<dt>Chain ID</dt>
						<dd data-text="mono">
							{String(entityId.$network.chainId)}
						</dd>
					</div>

					{#if contentOpen}
						{#if loaded.totalOperations != null}
							<div>
								<dt>Total operations</dt>
								<dd>{String(loaded.totalOperations)}</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.EvmAccountAbstractionAddress}
			{entityId}
		/>

		<ResourceBoundary resource={row}>
			{#snippet children(_loaded)}
				<div class="entity-details" data-column="gap-2">
					<ContractView
						entityId={{
							$network: entityId.$network,
							address: entityId.address,
						}}
						href={resolve(
							'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
							{
								networkId: String(entityId.$network.chainId),
								address: entityId.address,
							},
						)}
						layout={EntityLayout.Summary}
						open={false}
						title="Contract"
					/>
				</div>
			{/snippet}
		</ResourceBoundary>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
