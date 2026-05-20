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
		collapsible = true,
		id,
		href,
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmBlob>
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
	entityType={EntityType.EvmBlob}
	{id}
	{href}
	{title}
	bind:open
	{...entitiesListRest}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Blob transactions carry large binary payloads alongside execution blocks; headers point at commitments while bodies hold the data for rollups.
		</p>
		<p>
			That layer is separate from contract ABI decoding or ENS metadata.
		</p>
		<p>
			Lists sample recent sidecars; nodes may omit blob bodies unless blob RPC is enabled.
		</p>
	{/snippet}

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
							Source.Voltaire_JsonRpc,
						],
						$limit: 32,
					},
				},
			)}
			{@const blobs = derive(
				network,
				(network) => (
					(network[fieldName] ?? []).slice(0, 32)
				),
			)}
			<div data-column="gap-3">
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.EvmBlob}
					id={`${id}-items`}
					{href}
					{title}
					open={true}
					getKey={(row) => stringify(row[EntityMetaKey.Id])}
					getSortValue={(row) => stringify(row[EntityMetaKey.Id])}
					placeholderText="Loading blobs…"
					resource={blobs}
					UnorderedListProps={{ orientation: ListOrientation.Column }}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No blobs in this sample yet.
						</p>
					{/snippet}

					{#snippet Item(props)}
						{#if props.item}
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
			</div>
		{/if}
	{/snippet}
</EntitiesList>
