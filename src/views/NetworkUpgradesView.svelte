<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Props
	let {
		entityFieldReference,
		title = 'Upgrades',
		open = $bindable(true),
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.NetworkUpgrade>
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'collapsible'
			| 'id',
			| 'href'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			[entityFieldReference.fieldName]: {
				$: [
					Source.Constants_Internal,
				],
				$limit: 512,
			},
		},
	)

	const upgrades = derive(
		parent,
		(parent) => (
			(parent[entityFieldReference.fieldName] ?? [])
				.map((value) => ({
					value,
				}))
		),
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import NetworkUpgradeView from '$/views/NetworkUpgradeView.svelte'
</script>


<EntitiesList
	entityType={EntityType.NetworkUpgrade}
	{title}
	bind:open
	getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	resource={upgrades}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Each network upgrade references a <strong>network execution upgrade</strong>; when both layers shipped together it also references a <strong>network consensus upgrade</strong>.
		</p>
		<p>
			Cards link to the paired execution and consensus fork views when present.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No upgrades yet.
		</p>
	{/snippet}

	{#snippet Item({ item: envelope })}
		{@const slug = envelope.value.slug ?? envelope.value[EntityMetaKey.Id].upgradeId}
		<NetworkUpgradeView
			entityId={envelope.value[EntityMetaKey.Id]}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
