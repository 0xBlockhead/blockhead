<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityFieldReference,
		title = 'ERC-4337 paymasters',
		open = $bindable(true),
		collapsible = true,
		id,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Erc4337Paymaster>
			title?: string
			open?: boolean
			collapsible?: boolean
			id: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary, { Layout as ResourceBoundaryLayout } from '$/components/ResourceBoundary.svelte'
	import UnorderedList from '$/components/UnorderedList.svelte'
	import Erc4337PaymasterView from '$/views/Erc4337PaymasterView.svelte'
</script>


<EntitiesList
	entityType={EntityType.Erc4337Paymaster}

	{id}
	{title}
	bind:open
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Paymasters are gas-sponsorship contracts in ERC-4337, distinct from smart accounts and bundler operators.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const network = useEntity(
				EntityType.EvmNetwork,
				entityFieldReference.entityId,
				{
					blockHeight: {
						$: [
							Source.Voltaire_JsonRpc,
						],
					},
					$$erc4337Paymasters: {
						$: [
							Source.Blockscout_Rest,
						],
						$limit: 16,
					},
				},
			)}
			{@const paymasters = derive(
				network,
				(network): Entity<typeof schema, EntityType.Erc4337Paymaster>[] => (
					network.$$erc4337Paymasters ?? []
				),
			)}
			<div data-column="gap-3">
				<ResourceBoundary
					layout={ResourceBoundaryLayout.Block}
					placeholderText="Loading paymasters…"
					resource={paymasters}
				>
					{#snippet children(paymasters)}
						<UnorderedList
							getKey={(row) => stringify(row[EntityMetaKey.Id])}
							getSortValue={(row) => BigInt(row[EntityMetaKey.Id].address)}
							items={paymasters.slice(0, 16)}
							orientation={ListOrientation.Column}
							placeholderRanges={[]}
						>
							{#snippet Empty()}
								<p data-text="muted">No indexed paymasters yet.</p>
							{/snippet}

							{#snippet Item({ item })}
								<Erc4337PaymasterView
									entityId={item[EntityMetaKey.Id]}
									layout={EntityLayout.Summary}
									open={false}
								/>
							{/snippet}
						</UnorderedList>
					{/snippet}
				</ResourceBoundary>
			</div>
		{/if}
	{/snippet}
</EntitiesList>
