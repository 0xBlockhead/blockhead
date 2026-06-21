<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context


	// State
	let {
		selection,
		title = 'Receipt logs',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmLog>
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


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			<ResourceBoundary
				resource={selection({
						sources: [
							Source.Blockscout_Rest,
							Source.Voltaire_JsonRpc,
						],
						fields: {
							topics: true,
						},
					})}
				placeholderText="Loading receipt logs…"
			>
				{#snippet children(logs)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.EvmLog}
						getKey={(log) => stringify(log.entitySelector)}
						getSortValue={(log) => log.entitySelector.logIndex}
						placeholderText="Loading receipt logs…"
						items={logs.entities}
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
							<EvmLogView
								selection={select(EntityType.EvmLog, item.entitySelector)}
								layout={EntityLayout.Summary}

								collapsible={false}
								showTypeAnnotation={false}
							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
