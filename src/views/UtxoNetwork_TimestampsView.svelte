<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
		import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Network snapshots',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.UtxoNetwork_Timestamp>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()


	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import UtxoNetwork_TimestampView from '$/views/UtxoNetwork_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.UtxoNetwork_Timestamp}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Network snapshots capture observed UTXO chain state such as tip, mempool size, fee estimates, and chain-size metrics at a resolver timestamp.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary
				resource={proxy(
						entityFieldReference.entityType,
						entityFieldReference.selector,
					).field(entityFieldReference.fieldName, {
						sources: [
							Source.Blockchair_Rest,
							Source.Esplora_Rest,
							Source.MempoolSpace_Rest,
							Source.BitcoinCore_JsonRpc,
							Source.LitecoinCore_JsonRpc,
							Source.DogecoinCore_JsonRpc,
							Source.BitcoinCashNode_JsonRpc,
							Source.Zcashd_JsonRpc,
						],
						limit: 16,
					})}
				placeholderText="Loading timestamps…"
			>
				{#snippet children(timestamps)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.UtxoNetwork_Timestamp}
				id={`${id}-items`}
				href={href}
				getKey={(timestamp) => stringify(timestamp.entitySelector)}
				getSortValue={(timestamp) => -timestamp.entitySelector.timestampMs}
				open={true}
				items={timestamps.entities}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No network snapshots yet.
					</p>
				{/snippet}

				{#snippet Item(context)}
					<UtxoNetwork_TimestampView
						selector={context!.item.entitySelector}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
