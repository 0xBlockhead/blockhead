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
	import EvmErrorView from '$/views/EvmErrorView.svelte'


	// Props
	let {
		entityFieldReference,
		open = $bindable(true),
		title = 'Errors',
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmError>
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

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const global = useEntity(
		EntityType._Global,
		entityFieldReference.entityId,
		{
			$$evmErrors: {
				$: [
					Source.Openchain_Rest,
				],
			},
		},
	)

	const errors = derive(
		global,
		(loaded): Entity<typeof schema, EntityType.EvmError>[] => {
			const rows = (
				loaded.$$evmErrors
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
	entityType={EntityType.EvmError}
	{title}
	bind:open
	{...entitiesListRest}
>
	{#snippet body()}
		{#key stringify(entityFieldReference.entityId)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmError}
				id={`${entitiesListRest.id}-items`}
				href={entitiesListRest.href}
				{title}
				open={true}
				getKey={(row) => row[EntityMetaKey.Id].hex}
				getSortValue={(row) => row[EntityMetaKey.Id].hex}
				placeholderText="Loading errors…"
				resource={errors}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No errors indexed yet.
					</p>
				{/snippet}

				{#snippet Item(props)}
					{#if props.item}
						<EvmErrorView
							entityId={props.item[EntityMetaKey.Id]}
							href={resolve('/(explore)/(evm)/evm/(errors)/error/[hex]', {
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
