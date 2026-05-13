<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
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
	import EvmBlobView from '$/views/EvmBlobView.svelte'


	// Props
	let {
		entityFieldReference,
		title = 'Blobs',
		open = $bindable(true),
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmBlob>
			title?: string
			open?: boolean
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
			blockHeight: {
				$: [
					Source.Voltaire_JsonRpc,
				],
			},
			$$blobs: {
				$: [
					Source.Voltaire_JsonRpc,
				],
			},
		},
	)

	const blobs = derive(
		network,
		(loaded) => {
			const rows = (
				loaded.$$blobs
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
					.slice(0, 32)
			)
		},
	)
</script>


<EntitiesList
	entityType={EntityType.EvmBlob}
	{title}
	bind:open
	{...entitiesListRest}
>
	{#snippet body()}
		{#key stringify(entityFieldReference.entityId)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmBlob}
				id={`${entitiesListRest.id}-items`}
				href={entitiesListRest.href}
				{title}
				open={true}
				getKey={(row) => stringify(row[EntityMetaKey.Id])}
				placeholderText="Loading blobs…"
				resource={blobs}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No EIP-4844 blobs in the sampled recent blocks for this network (or the RPC did not return full
						transactions).
					</p>
				{/snippet}

				{#snippet Item(props)}
					{#if props.isPlaceholder === false}
						<EvmBlobView
							entityId={props.item[EntityMetaKey.Id]}
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/(blobs)/blob/[transactionId]/[blobIndex]',
								{
									networkId: String(
										props.item[EntityMetaKey.Id].$network.chainId,
									),
									transactionId: props.item[EntityMetaKey.Id].txHash,
									blobIndex: String(props.item[EntityMetaKey.Id].blobIndex),
								},
							)}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/key}
	{/snippet}
</EntitiesList>
