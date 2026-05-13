<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const global = useEntity(
		EntityType._Global,
		entityFieldReference.entityId,
		{
			$$evmSelectors: {
				$: [
					Source.Openchain_Rest,
				],
			},
		},
	)

	const selectors = derive(
		global,
		(loaded): Entity<typeof schema, EntityType.EvmSelector>[] => {
			const rows = (
				loaded.$$evmSelectors
				?? []
			)
			return (
				rows.toSorted((a, b) => (
					a[EntityMetaKey.Id].hex
						> b[EntityMetaKey.Id].hex ?
						1
					:
						a[EntityMetaKey.Id].hex
							< b[EntityMetaKey.Id].hex ?
							-1
						:
							0
				))
			)
		},
	)
</script>


<EntitiesList
	entityType={EntityType.EvmSelector}
	{title}
	bind:open
	{...entitiesListRest}
>
	{#snippet body()}
		{#key stringify(entityFieldReference.entityId)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmSelector}
				id={`${entitiesListRest.id}-items`}
				href={entitiesListRest.href}
				{title}
				open={true}
				getKey={(row) => row[EntityMetaKey.Id].hex}
				getSortValue={(row) => row[EntityMetaKey.Id].hex}
				placeholderKeys={new SvelteSet()}
				placeholderText="Loading selectors…"
				resource={selectors}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No selectors indexed yet.
					</p>
				{/snippet}

				{#snippet Item(props)}
					{#if props.isPlaceholder === false}
						<EvmSelectorView
							entityId={props.item[EntityMetaKey.Id]}
							href={resolve('/(explore)/(evm)/evm/(selectors)/selector/[hex]', {
								hex: props.item[EntityMetaKey.Id].hex,
							})}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/key}
	{/snippet}
</EntitiesList>
