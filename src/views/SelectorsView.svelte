<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	// State
	let {
		entityFieldReference,
		open = $bindable(true),
		collapsible = true,
		title = 'Selectors',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmSelector>
			open?: boolean
			collapsible?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()

	import { subscribe } from '$/routes/+layout.svelte'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmSelectorView from '$/views/EvmSelectorView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	entityType={EntityType.EvmSelector}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Function selectors are the first four bytes of keccak(functionName(types)) used as the calldata discriminator on EVM chains.
		</p>
		<p>
			Catalogs map those bytes to human-readable signatures—distinct from receipt log topics or social posts.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No contract function selectors indexed yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,({ fields: {
					[entityFieldReference.fieldName]: {
						sources: [
							Source.Openchain_Rest,
						],
					},
				} }),
			)}
			{@const selectors = derive(
				parent,
				(parent) => {
					const evmSelectors: readonly Entity<typeof schema, EntityType.EvmSelector>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return (
						evmSelectors.map((value) => ({
							value,
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmSelector}
				getKey={(envelope) => envelope.value[EntityMetaKey.Selector].hex}
				getSortValue={(envelope) => envelope.value[EntityMetaKey.Selector].hex}
				open={true}
				resource={selectors}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No contract function selectors indexed yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					<EvmSelectorView
						selector={item.value[EntityMetaKey.Selector]}
						layout={EntityLayout.Summary}
						open={false}
						showTypeAnnotation={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
