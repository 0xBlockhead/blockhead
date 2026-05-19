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
		id,
		href,
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmBlob>
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
				$$blobs: {
					$: [
						Source.Voltaire_JsonRpc,
					],
				},
			} : {}),
		},
	)

	const blobs = derive(
		network,
		(network) => {
			const rows = (
				network.$$blobs
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
	{/snippet}
</EntitiesList>
