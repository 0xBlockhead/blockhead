<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Receipt logs',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
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
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()

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
	{...EntitiesListProps}
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

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,({ fields: {
					[entityFieldReference.fieldName]: {
						sources: [
							Source.Blockscout_Rest,
							Source.Voltaire_JsonRpc,
						],
					},
				} }),
			)}
			{@const logs = derive(
				parent,
				(parent) => (
					[...(parent.fields[entityFieldReference.fieldName]?.values ?? [])]
						.map((value) => ({
							value,
						}))
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmLog}
				getKey={(line) => stringify(line.value[EntityMetaKey.Selector])}
				getSortValue={(line) => line.value[EntityMetaKey.Selector].logIndex}
				placeholderText="Loading receipt logs…"
				resource={logs}
				{title}
				href={EntitiesListProps.href ?? ''}
				id={`${EntitiesListProps.id ?? 'receipt-logs'}:items`}
				open={true}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No receipt logs on this transaction.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const line = item.value}
					{@const logId = line[EntityMetaKey.Selector]}
					<EvmLogView
						selector={logId}
						layout={EntityLayout.Summary}
						open={false}
						collapsible={false}
						showParentTransaction={false}
						showTypeAnnotation={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
