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
		id,
		open = $bindable(true),
		collapsible = true,
		title = 'ERC-8004 Registrations',
		limit = 100,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmNft>
			id: string
			open?: boolean
			collapsible?: boolean
			title?: string
			limit?: number
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
	import Eip8004RegistrationView from '$/views/Eip8004RegistrationView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	data-entity-field-name={entityFieldReference.fieldName}
	data-entity-field-parent={stringify(entityFieldReference.selector)}
	data-entity-field-type={entityFieldReference.entityType}
	entityType={EntityType.EvmNft}
	{id}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			On-chain agent identity registrations indexed by <a href="https://8004scan.io/developers">8004scan</a>.
		</p>
		<p>
			Each row is a registry token id on a network plus its registration metadata URI.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No ERC-8004 registrations in this slice yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary resource={proxy(
					entityFieldReference.entityType,
					entityFieldReference.selector,
				).field(entityFieldReference.fieldName, {
					sources: [
						Source.Eip8004Scan_Rest,
					],
					limit,
				})} placeholderText="Loading registrations…">
				{#snippet children(registrations)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				data-entity-field-name={entityFieldReference.fieldName}
				data-entity-field-parent={stringify(entityFieldReference.selector)}
				data-entity-field-type={entityFieldReference.entityType}
				entityType={EntityType.EvmNft}
				getKey={(registration) => stringify(registration.entitySelector)}
				open={true}
				items={registrations.entities}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No ERC-8004 registrations in this slice yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					<Eip8004RegistrationView
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
