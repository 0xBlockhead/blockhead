<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
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

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,({ fields: {
					[entityFieldReference.fieldName]: {
						sources: [
							Source.Eip8004Scan_Rest,
						],
						limit: limit,
					},
				} }),
			)}
			{@const registrations = derive(
				parent,
				(parent) => {
					const eip8004Registrations: readonly Entity<typeof schema, EntityType.EvmNft>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return (
						eip8004Registrations.map((value) => ({
							value,
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				data-entity-field-name={entityFieldReference.fieldName}
				data-entity-field-parent={stringify(entityFieldReference.selector)}
				data-entity-field-type={entityFieldReference.entityType}
				entityType={EntityType.EvmNft}
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Selector])}
				open={true}
				resource={registrations}
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
						selector={item.value[EntityMetaKey.Selector]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
