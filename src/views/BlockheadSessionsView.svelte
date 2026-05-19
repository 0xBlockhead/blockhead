<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { stringify } from 'devalue'

	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import BlockheadSessionView from '$/views/BlockheadSessionView.svelte'


	// Props
	let {
		entityFieldReference,
		title = 'Simulator sessions',
		open = $bindable(true),
		href,
		id,
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.BlockheadSession
			>
			title?: string
			open?: boolean
			href: string
			id: string
		},
		Omit<ComponentProps<typeof EntitiesList>, 'entityType'>
	> = $props()


	const parentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		(
			open ?
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Local_Internal,
						],
					},
				}
			:
				{
					$: [
						Source.Local_Internal,
					],
				}
		),
	)

	const sessions = derive(
		parentEntity,
		(merged) => {
			const rows: Entity<typeof schema, EntityType.BlockheadSession>[] = (
				merged[entityFieldReference.fieldName] ?? []
			)
				.toSorted((a, b) => (
					stringify(a[EntityMetaKey.Id]).localeCompare(stringify(b[EntityMetaKey.Id]))
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
	entityType={EntityType.BlockheadSession}
	{href}
	{id}
	{title}
	bind:open
	getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	getSortValue={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	resource={sessions}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...entitiesListRest}
>
	{#snippet TypeAnnotationTooltip()}
					<p>
						Saved simulation projects: named capture points, loop counters, and replay bookkeeping for scripted EVM or HTTP traces.
					</p>
					<p>
						Such traces are diagnostics—compare their implied state roots to a live node instead of treating them as canonical chain history.
					</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No sessions yet.
		</p>
	{/snippet}

	{#snippet Item({ item: envelope })}
		{#if envelope}
			<BlockheadSessionView
				entityId={envelope.value[EntityMetaKey.Id]}
				href={resolve(
					'/~/(manage)/manage/(profiles)/profile/[profileId]',
					{ profileId: envelope.value[EntityMetaKey.Id].id },
				)}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
