<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Blobs',
		open = $bindable(true),
		collapsible = true,
		id,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmBlob>
			title?: string
			open?: boolean
			collapsible?: boolean
			id: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	

	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmBlobView from '$/views/EvmBlobView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmBlob}
	{id}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
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

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary
				resource={proxy(
						entityFieldReference.entityType,
						entityFieldReference.selector,
					).field(entityFieldReference.fieldName, {
						sources: [Source.Voltaire_JsonRpc],
						limit: entityFieldReference.entityType === EntityType.EvmNetwork ? 8 : undefined,
					})}
				placeholderText="Loading blobs…"
			>
				{#snippet children(blobs)}
					<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.EvmBlob}
					id={`${id}-items`}
					{title}
					open={true}
						getKey={(row) => stringify(row.entitySelector)}
						getSortValue={(row) => stringify(row.entitySelector)}
					placeholderText="Loading blobs…"
					items={blobs.entities}
					UnorderedListProps={{ orientation: ListOrientation.Column }}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No blobs in this sample yet.
						</p>
					{/snippet}

					{#snippet Item({ item })}
						<EvmBlobView
							selector={item.entitySelector}
							layout={EntityLayout.Summary}

						/>
					{/snippet}
				</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
