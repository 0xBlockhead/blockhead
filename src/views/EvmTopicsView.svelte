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
	import EvmTopicView from '$/views/EvmTopicView.svelte'


	// Props
	let {
		entityFieldReference,
		open = $bindable(true),
		title = 'Topics',
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
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const global = useEntity(
		EntityType._Global,
		entityFieldReference.entityId,
		{
			$: [
				Source.Openchain_Rest,
			],
			$$evmTopics: {
				$limit: 4096,
			},
		},
	)

	const topics = derive(
		global,
		(loaded) => {
			const rows: Entity<typeof schema, EntityType.EvmTopic>[] = (
				loaded.$$evmTopics
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
	{title}
	bind:open
	{...entitiesListRest}
>
	{#snippet body()}
		{#key stringify(entityFieldReference.entityId)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmTopic}
				id={`${entitiesListRest.id}-items`}
				href={entitiesListRest.href}
				{title}
				open={true}
				getKey={(topic) => topic[EntityMetaKey.Id].hex}
				getSortValue={(topic) => topic[EntityMetaKey.Id].hex}
				placeholderText="Loading topics…"
				resource={topics}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No topics indexed yet.
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
		{/key}
	{/snippet}
</EntitiesList>
