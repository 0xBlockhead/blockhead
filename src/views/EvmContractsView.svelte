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
	import ContractView from '$/views/ContractView.svelte'


	// Props
	let {
		entityFieldReference,

		title = 'Contracts',

		open = $bindable(true),

		id,

		href,

		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmContract>
			title?: string
			open?: boolean
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

	const network = useEntity(
		EntityType.Network,
		entityFieldReference.entityId,
		{
			...(open ? {
				blockHeight: {
					$: [
						Source.Voltaire_JsonRpc,
					],
				},
				$$contracts: {
					$: [
						Source.Blockscout_Rest,
					],
				},
			} : {}),
		},
	)

	const contracts = derive(
		network,
		(network): Entity<typeof schema, EntityType.EvmContract>[] => {
			const rows = (
				network.$$contracts
				?? []
			)
			return (
				rows
					.toSorted((a, b) => (
						stringify(b[EntityMetaKey.Id])
							> stringify(a[EntityMetaKey.Id]) ?
							1
						:
							stringify(b[EntityMetaKey.Id])
								< stringify(a[EntityMetaKey.Id]) ?
								-1
							:
								0
					))
					.slice(0, 16)
			)
		},
	)
</script>


<EntitiesList
	entityType={EntityType.EvmContract}
	{id}
	{href}
	{title}
	bind:open
	{...entitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Explorer-verified contracts pair immutable bytecode with published ABI metadata so calldata, events, and errors decode predictably.
		</p>
		<p>
			Blob commitments for rollups are separate from interface metadata at the address.
		</p>
		<p>
			Rows mirror recent deployments the explorer indexed for this network.
		</p>
	{/snippet}

	{#snippet body()}
		<div data-column="gap-3">
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmContract}
				id={`${id}-items`}
				{href}
				{title}
				open={true}
				getKey={(row) => stringify(row[EntityMetaKey.Id])}
				getSortValue={(row) => BigInt(row[EntityMetaKey.Id].address)}
				placeholderText="Loading verified contracts…"
				resource={contracts}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No verified contracts yet.
					</p>
				{/snippet}

				{#snippet Item(props)}
					{#if props.item}
						<ContractView
							entityId={props.item[EntityMetaKey.Id]}
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
								{
									networkId: String(
										props.item[EntityMetaKey.Id].$network.chainId,
									),
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
	{/snippet}
</EntitiesList>
