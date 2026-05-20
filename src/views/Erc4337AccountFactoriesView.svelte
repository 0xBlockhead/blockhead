<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Erc4337AccountFactoryView from '$/views/Erc4337AccountFactoryView.svelte'


	// Props
	let {
		entityFieldReference,
		title = 'ERC-4337 account factories',
		open = $bindable(true),
		collapsible = true,
		id,
		href,
		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Erc4337AccountFactory>
			title?: string
			open?: boolean
			collapsible?: boolean
			id: string
			href: string
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
</script>


<EntitiesList
	entityType={EntityType.Erc4337AccountFactory}
	{id}
	{href}
	{title}
	bind:open
	{...entitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Account factories deploy smart-account implementations; they are not paymasters or bundlers.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const network = useEntity(
				EntityType.Network,
				entityFieldReference.entityId,
				{
					blockHeight: {
						$: [
							Source.Voltaire_JsonRpc,
						],
					},
					$$erc4337AccountFactories: {
						$: [
							Source.Blockscout_Rest,
						],
						$limit: 16,
					},
				},
			)}
			{@const accountFactories = derive(
				network,
				(network): Entity<typeof schema, EntityType.Erc4337AccountFactory>[] => (
					(network.$$erc4337AccountFactories ?? []).slice(0, 16)
				),
			)}
			<div data-column="gap-3">
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.Erc4337AccountFactory}
					id={`${id}-items`}
					{href}
					{title}
					open={true}
					getKey={(row) => stringify(row[EntityMetaKey.Id])}
					getSortValue={(row) => BigInt(row[EntityMetaKey.Id].address)}
					placeholderText="Loading account factories…"
					resource={accountFactories}
					UnorderedListProps={{ orientation: ListOrientation.Column }}
				>
					{#snippet Empty()}
						<p data-text="muted">No indexed account factories yet.</p>
					{/snippet}

					{#snippet Item(props)}
						{#if props.item}
							<Erc4337AccountFactoryView
								entityId={props.item[EntityMetaKey.Id]}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/erc-4337/account-factory/[address]',
									{
										networkId: String(props.item[EntityMetaKey.Id].$network.chainId),
										address: props.item[EntityMetaKey.Id].address,
									},
								)}
								layout={EntityLayout.Summary}
								open={false}
							/>
						{/if}
					{/snippet}
				</EntitiesList>
			</div>
		{/if}
	{/snippet}
</EntitiesList>
