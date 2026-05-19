<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'

	import EntitiesList from '$/components/EntitiesList.svelte'

	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { resolve } from '$app/paths'


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
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		(
			open ?
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Openchain_Rest,
						],
					},
				}
			:
				{}
		),
	)

	const selectors = derive(
		parent,
		(parent) => {
			const rows: Entity<typeof schema, EntityType.EvmSelector>[] = (
				parent[entityFieldReference.fieldName] ?? []
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


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import Tooltip from '$/components/Tooltip.svelte'
	import EvmSelectorView from '$/views/EvmSelectorView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.EvmSelector}
	getKey={(envelope) => envelope.value[EntityMetaKey.Id].hex}
	getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].hex}
	placeholderKeys={new SvelteSet()}
	resource={selectors}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Function selectors are the first four bytes of keccak(functionName(types)) used as the calldata discriminator on EVM chains.
		</p>
		<p>
			Catalogs map those bytes to human-readable signatures—distinct from log event topics or social posts.
		</p>
	{/snippet}

	{#snippet Empty()}
			<p data-text="muted">
				No contract function selectors indexed yet.
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
