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


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		title = 'Receipt logs',
		open = $bindable(true),
		collapsible = true,
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.EvmLog
			>
			title?: string
			open?: boolean
			collapsible?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmLogView from '$/views/EvmLogView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmLog}
	{title}
	bind:open
	{collapsible}
	{...entitiesListRest}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Each row is one <code>LOG</code> opcode captured on the parent transaction receipt—emitter address, topics, and data payload.
		</p>
		<p>
			Topic 0 often fingerprints an ABI log declaration; additional topics carry indexed arguments when the emitter used ABI-style indexing.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No receipt logs on this transaction.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const fieldName = entityFieldReference.fieldName}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					[fieldName]: {
						$: [
							Source.Blockscout_Rest,
							Source.Voltaire_JsonRpc,
						],
					},
				},
			)}
			{@const logs = derive(
				parent,
				(parent) => (
					[...(parent[fieldName] ?? [])]
						.map((value) => ({
							value,
						}))
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmLog}
				getKey={(line) => stringify(line.value[EntityMetaKey.Id])}
				getSortValue={(line) => line.value[EntityMetaKey.Id].logIndex}
				placeholderText="Loading receipt logs…"
				resource={logs}
				{title}
				href={entitiesListRest.href ?? ''}
				id={`${entitiesListRest.id ?? 'receipt-logs'}:items`}
				open={true}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No receipt logs on this transaction.
					</p>
				{/snippet}

				{#snippet Item(props)}
					{#if props.item}
						{@const line = props.item.value}
						{@const logId = line[EntityMetaKey.Id]}
						<EvmLogView
							entityId={logId}
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]/log/[logIndex]',
								{
									networkId: String(logId.$network.chainId),
									transactionId: logId.txHash,
									logIndex: String(logId.logIndex),
								},
							)}
							layout={EntityLayout.Summary}
							open={false}
							collapsible={false}
							showParentTransaction={false}
							showTypeAnnotation={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
