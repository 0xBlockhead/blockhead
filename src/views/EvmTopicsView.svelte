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
	import Tooltip from '$/components/Tooltip.svelte'
	import EvmTopicView from '$/views/EvmTopicView.svelte'


	// Props
	let {
		entityFieldReference,
		open = $bindable(true),

		title = 'Log topics',
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmTopic>
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

	const global = useEntity(
		EntityType._Global,
		entityFieldReference.entityId,
		{
			...(open ?
				{
					$: [
						Source.Openchain_Rest,
					],
					$$evmTopics: {
						$limit: 4096,
					},
				}
			:
				{}),
		},
	)

	const topics = derive(
		global,
		(global) => {
			const rows: Entity<typeof schema, EntityType.EvmTopic>[] = (
				global.$$evmTopics
				?? []
			)
			return (
				rows.toSorted((first, second) => (
					first[EntityMetaKey.Id].hex.localeCompare(second[EntityMetaKey.Id].hex)
				))
			)
		},
	)
</script>


<EntitiesList
	entityType={EntityType.EvmTopic}
	getKey={(topic) => topic[EntityMetaKey.Id].hex}
	getSortValue={(topic) => topic[EntityMetaKey.Id].hex}
	placeholderText="Loading indexed log topics…"
	resource={topics}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{title}
	bind:open
	{...entitiesListRest}
>
		{#snippet TypeAnnotationTooltip()}
			<p>
				Log topics are the hashed event signatures that appear in the topic position of EVM event logs.
			</p>
			<p>
				They identify which event fired, distinct from function selectors used in contract calls.
			</p>
		{/snippet}
		{#snippet Empty()}
			<p data-text="muted">
				No indexed log topics yet.
			</p>
		{/snippet}

		{#snippet Item(props)}
			{#if props.item}
				<EvmTopicView
					entityId={props.item[EntityMetaKey.Id]}
					href={resolve('/(explore)/(evm)/evm/(topics)/topic/[hex]', {
						hex: props.item[EntityMetaKey.Id].hex,
					})}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{/if}
		{/snippet}
</EntitiesList>
