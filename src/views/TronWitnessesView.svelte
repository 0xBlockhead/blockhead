<script lang="ts">
import { stringify } from 'devalue'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Witnesses',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.TronWitness>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()


	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import TronWitnessView from '$/views/TronWitnessView.svelte'
</script>


<EntitiesList entityType={EntityType.TronWitness} {title} bind:open {id} href={href} {...EntitiesListProps}>
	{#snippet TypeAnnotationTooltip()}
		<p>Witnesses are TRON block producers elected through delegated proof-of-stake voting.</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={proxy(
					entityFieldReference.entityType,
					entityFieldReference.selector,
				).field(entityFieldReference.fieldName, {
					sources: [
						Source.TronGrid_Rest,
					],
					limit: 16,
				})} placeholderText="Loading witnesses…">
				{#snippet children(witnesses)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.TronWitness}
				id={`${id}-items`}
				href={href}
				getKey={(witness) => stringify(witness.entitySelector)}
				open={true}
				items={witnesses.entities}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}<p data-text="muted">No witnesses yet.</p>{/snippet}
				{#snippet Item({ item })}
					<TronWitnessView selector={item.entitySelector} layout={EntityLayout.Summary} />
				{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
