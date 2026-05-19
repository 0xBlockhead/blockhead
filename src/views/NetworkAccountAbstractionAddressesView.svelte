<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'

	import { resolve } from '$app/paths'

	import { stringify } from 'devalue'

	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Components
	import EvmAccountAbstractionAddressView from '$/views/EvmAccountAbstractionAddressView.svelte'


	// Props
	let {
		entityFieldReference,

		open = $bindable(true),

		title,

		id,

		href,

		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmAccountAbstractionAddress>

			open?: boolean

			title: string

			id: string

			href: string
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType' | 'href' | 'id' | 'title'
		>
	> = $props()


	const fieldName = entityFieldReference.fieldName


	// State
	const networkSelections = (
		open ?
			({
				blockHeight: {
					$: [
						Source.Voltaire_JsonRpc,
					],
				},
				[fieldName]: {
					$: [
						Source.Blockscout_Rest,
					],
				},
			})
		:
			{}
	)

	const network = useEntity(
		EntityType.Network,
		entityFieldReference.entityId,
		networkSelections,
	)

	const addresses = derive(
		network,
		(loaded): Entity<typeof schema, EntityType.EvmAccountAbstractionAddress>[] => (
			entityFieldReference.fieldName === '$$accountAbstractionSmartAccounts' ?
				loaded.$$accountAbstractionSmartAccounts ?? []
			: entityFieldReference.fieldName === '$$accountAbstractionBundlers' ?
				loaded.$$accountAbstractionBundlers ?? []
			: entityFieldReference.fieldName === '$$accountAbstractionPaymasters' ?
				loaded.$$accountAbstractionPaymasters ?? []
			:
				loaded.$$accountAbstractionFactories ?? []
		),
	)

	const addressesSorted = derive(
		addresses,
		(rows) => (
			(rows ?? [])
				.toSorted((leftRow, rightRow) => {
					const left = BigInt(leftRow[EntityMetaKey.Id].address)
					const right = BigInt(rightRow[EntityMetaKey.Id].address)
					return (
						right > left ?
							1
						: right < left ?
							-1
						:
							0
					)
				})
		),
	)
</script>


<EntitiesList
	entityType={EntityType.EvmAccountAbstractionAddress}
	{href}
	{id}
	{title}
	bind:open
	{...entitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
					<p>
						Blockscout-indexed ERC-4337 registry addresses for this execution chain (role plus deployment contract).
					</p>
					<p>
						Open a row for aggregate operation counts and the underlying contract card.
					</p>
	{/snippet}

	{#snippet body()}
		<div data-column="gap-3">
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmAccountAbstractionAddress}
				id={`${id}-items`}
				{href}
				{title}
				open={true}
				getKey={(item) => stringify(item[EntityMetaKey.Id])}
				getSortValue={(item) => BigInt(item[EntityMetaKey.Id].address)}
				placeholderText="Loading indexed addresses…"
				resource={addressesSorted}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No addresses.
					</p>
				{/snippet}

				{#snippet Item(props)}
					{#if props.item}
						<EvmAccountAbstractionAddressView
							entityId={props.item[EntityMetaKey.Id]}
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/account-abstraction/[aaRole]/[address]',
								{
									networkId: String(props.item[EntityMetaKey.Id].$network.chainId),
									aaRole: props.item[EntityMetaKey.Id].role,
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
