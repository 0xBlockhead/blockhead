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


	// Props
	let {
		entityFieldReference,
		title = 'Topics',
		open = $bindable(true),
		href,
		id,
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmTopic>
			open?: boolean
			title?: string
			href: string
			id: string
		},
		Omit<ComponentProps<typeof EntitiesList>, 'entityType'>
	> = $props()


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const fieldName = entityFieldReference.fieldName

	const topicsParent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Openchain_Rest,
			],
			[fieldName]: {
				$: [
					Source.Openchain_Rest,
				],
				$limit: 4096,
			},
		},
	)

	const topics = derive(
		topicsParent,
		(merged) => (
			(
				merged[fieldName as keyof typeof merged] as (
					Entity<typeof schema, EntityType.EvmTopic>
				)[]
			)
				.toSorted((first, second) => (
					first[EntityMetaKey.Id].hex.localeCompare(second[EntityMetaKey.Id].hex)
				))
				.map((topic) => ({
					result: topic,
				}))
		),
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import EvmTopicView from '$/views/EvmTopicView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.EvmTopic}
	getKey={(envelope) => envelope.result[EntityMetaKey.Id].hex}
	getSortValue={(envelope) => envelope.result[EntityMetaKey.Id].hex}
	{href}
	{id}
	placeholderKeys={new SvelteSet()}
	resource={topics}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<p data-text="muted">
			No topics indexed yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.isPlaceholder === false}
			{@const topicId = props.item.result[EntityMetaKey.Id]}
			<EvmTopicView
				entityId={topicId}
				href={resolve('/(explore)/(evm)/evm/(topics)/topic/[hex]', {
					hex: topicId.hex,
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
