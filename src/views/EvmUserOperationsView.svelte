<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'

	import { stringify } from 'devalue'

	import { resolve } from '$app/paths'

	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UnorderedList from '$/components/UnorderedList.svelte'
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
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmUserOperationView from '$/views/EvmUserOperationView.svelte'


	// Props
	let {
		entityFieldReference,

		open = $bindable(true),

		collapsible = true,

		title = 'User operations',

		id,

		href,

		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmUserOperation>

			open?: boolean

			collapsible?: boolean

			title?: string

			id: string

			href: string
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType' | 'href' | 'id' | 'title'
		>
	> = $props()
</script>


<EntitiesList
	entityType={EntityType.EvmUserOperation}
	{entityFieldReference}
	{href}
	{id}
	{title}
	bind:open
	{...entitiesListProps}
>
	{#snippet body()}
		{#if open}
			{@const fieldName = entityFieldReference.fieldName}
			{@const network = useEntity(
				EntityType.Network,
				entityFieldReference.entityId,
				{
					blockHeight: {
						$: [
							Source.Voltaire_JsonRpc,
						],
					},
					[fieldName]: {
						$: [
							Source.Blockscout_Rest,
						],
						$limit: 16,
					},
				},
			)}
			{@const userOperations = derive(
				network,
				(network): Entity<typeof schema, EntityType.EvmUserOperation>[] => (
					network[fieldName]
					?? []
				),
			)}
			<div data-column="gap-3">
				<ResourceBoundary
					placeholderText="Loading user operations…"
					resource={userOperations}
				>
					{#snippet children(userOperations)}
						<UnorderedList
							getKey={(row) => stringify(row[EntityMetaKey.Id])}
							items={userOperations}
							orientation={ListOrientation.Column}
							placeholderRanges={[]}
						>
							{#snippet Empty()}
								<p data-text="muted">No user operations.</p>
							{/snippet}

							{#snippet Item({ item })}
								{#if item}
									<EvmUserOperationView
										entityId={item[EntityMetaKey.Id]}
										href={resolve(
											'/(explore)/(networks)/network/[networkId]/(network)/user-operation/[userOperationHash]',
											{
												networkId: String(item[EntityMetaKey.Id].$network.chainId),
												userOperationHash: item[EntityMetaKey.Id].hash,
											},
										)}
										layout={EntityLayout.Summary}
										open={false}
									>
										{#snippet HeadingSnippet()}
											<TruncatedValue
												format={TruncatedValueFormat.Visual}
												value={item[EntityMetaKey.Id].hash}
											/>
										{/snippet}
									</EvmUserOperationView>
								{/if}
							{/snippet}
						</UnorderedList>
					{/snippet}
				</ResourceBoundary>
			</div>
		{/if}
	{/snippet}
</EntitiesList>
