<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	let {
		entityFieldReference,
		open = $bindable(true),
		title = 'Revert data',
		id,
		href,
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmError>
			open?: boolean
			title?: string
			id: string
			href: string
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()

	const parentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			...(open ? {
				[entityFieldReference.fieldName]: {
					$: [
						Source.Openchain_Rest,
					],
				},
			} : {}),
		},
	)

	const envelopes = derive(
		parentEntity,
		(merged) => {
			const rows: Entity<typeof schema, EntityType.EvmError>[] = (
				merged[entityFieldReference.fieldName] ?? []
			)
				.toSorted((a, b) => (
					a[EntityMetaKey.Id].hex.localeCompare(b[EntityMetaKey.Id].hex)
				))
			return (
				rows.map((evmEntity) => ({
					evmEntity,
				}))
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmErrorView from '$/views/EvmErrorView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmError}
	{id}
	{href}
	{title}
	bind:open
	{...entitiesListRest}
>
	{#snippet TypeAnnotationTooltip()}
					<p>
						Revert data uses four-byte selectors (like calldata) but labels custom errors and standard revert shapes instead of function entrypoints.
					</p>
					<p>
						Catalogs map those prefixes to signatures so tooling can decode the trailing words similarly to call arguments.
					</p>
					<p>
						This list is a subset of error selectors for the parent contract or address under inspection.
					</p>
	{/snippet}

	{#snippet body()}
		<div data-column="gap-3">
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmError}
				id={`${id}-items`}
				{href}
				{title}
				open={true}
				getKey={(envelope) => envelope.evmEntity[EntityMetaKey.Id].hex}
				getSortValue={(envelope) => envelope.evmEntity[EntityMetaKey.Id].hex}
				placeholderText="Loading revert data…"
				resource={envelopes}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No revert selectors yet.
					</p>
				{/snippet}

				{#snippet Item(props)}
					{#if props.item}
						<EvmErrorView
							entityId={props.item.evmEntity[EntityMetaKey.Id]}
							href={resolve('/(explore)/(evm)/evm/(errors)/error/[hex]', {
								hex: props.item.evmEntity[EntityMetaKey.Id].hex,
							})}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		</div>
	{/snippet}
</EntitiesList>
