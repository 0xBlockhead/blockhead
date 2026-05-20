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
	import Erc4337BundlerView from '$/views/Erc4337BundlerView.svelte'


	// Props
	let {
		entityFieldReference,
		title = 'ERC-4337 bundlers',
		open = $bindable(true),
		collapsible = true,
		id,
		href,
		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Erc4337Bundler>
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
	entityType={EntityType.Erc4337Bundler}
	{id}
	{href}
	{title}
	bind:open
	{...entitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Bundlers submit user-operation bundles; they are not smart-account wallets or paymaster contracts.
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
					$$erc4337Bundlers: {
						$: [
							Source.Blockscout_Rest,
						],
						$limit: 16,
					},
				},
			)}
			{@const bundlers = derive(
				network,
				(network): Entity<typeof schema, EntityType.Erc4337Bundler>[] => (
					(network.$$erc4337Bundlers ?? []).slice(0, 16)
				),
			)}
			<div data-column="gap-3">
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.Erc4337Bundler}
					id={`${id}-items`}
					{href}
					{title}
					open={true}
					getKey={(row) => stringify(row[EntityMetaKey.Id])}
					getSortValue={(row) => BigInt(row[EntityMetaKey.Id].address)}
					placeholderText="Loading bundlers…"
					resource={bundlers}
					UnorderedListProps={{ orientation: ListOrientation.Column }}
				>
					{#snippet Empty()}
						<p data-text="muted">No indexed bundlers yet.</p>
					{/snippet}

					{#snippet Item(props)}
						{#if props.item}
							<Erc4337BundlerView
								entityId={props.item[EntityMetaKey.Id]}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/erc-4337/bundler/[address]',
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
