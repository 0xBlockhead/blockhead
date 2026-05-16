<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmSelectorView from '$/views/EvmSelectorView.svelte'


	// Props
	let {
		entityFieldReference,
		open = $bindable(true),
		title = 'Selectors',
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmSelector>
			open?: boolean
			title?: string
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { SvelteSet } from 'svelte/reactivity'

	const parentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			[entityFieldReference.fieldName]: {
				$: [
					Source.Openchain_Rest,
				],
			},
		},
	)

	const envelopes = derive(
		parentEntity,
		(merged) => {
			const rows: Entity<typeof schema, EntityType.EvmSelector>[] = (
				merged[entityFieldReference.fieldName] ?? []
			)
				.toSorted((a, b) => (
					a[EntityMetaKey.Id].hex > b[EntityMetaKey.Id].hex ?
						1
					:
						a[EntityMetaKey.Id].hex < b[EntityMetaKey.Id].hex ?
							-1
						:
							0
				))
			return (
				rows.map((value) => ({
					value,
				}))
			)
		},
	)
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.EvmSelector}
	getKey={(envelope) => envelope.value[EntityMetaKey.Id].hex}
	getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].hex}
	placeholderKeys={new SvelteSet()}
	resource={envelopes}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<p data-text="muted">
			No selectors indexed yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			<EvmSelectorView
				entityId={props.item.value[EntityMetaKey.Id]}
				href={resolve('/(explore)/(evm)/evm/(selectors)/selector/[hex]', {
					hex: props.item.value[EntityMetaKey.Id].hex,
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
