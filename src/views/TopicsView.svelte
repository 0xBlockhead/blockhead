<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		title = 'Log topics',
		open = $bindable(true),
		href,
		id,
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmTopic>
			title?: string
			open?: boolean
			href: string
			id: string
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const fieldName = entityFieldReference.fieldName

	const topicsParent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Openchain_Rest,
			],
			...(
				open ?
					{
						[fieldName]: {
							$limit: 4096,
						},
					}
				:
					{}
			),
		},
	)

	const topics = derive(
		topicsParent,
		(merged) => {
			const rows: Entity<typeof schema, EntityType.EvmTopic>[] = merged[fieldName] ?? []
			return (
				rows.toSorted((first, second) => (
					first[EntityMetaKey.Id].hex.localeCompare(second[EntityMetaKey.Id].hex)
				))
			)
		},
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
	{href}
	{id}
	{title}
	resource={topics}
	placeholderText="Loading topics…"
	getKey={(topic) => topic[EntityMetaKey.Id].hex}
	getSortValue={(topic) => topic[EntityMetaKey.Id].hex}
	placeholderKeys={new SvelteSet()}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet TypeAnnotationTooltip()}
					<p>
						Event log topics are keccak hashes of the canonical event signature for indexed logs on EVM chains.
					</p>
					<p>
						They are indexed separately from function selectors, market candles, storage links, or messaging threads.
					</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No log topics indexed yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			{@const topicId = props.item[EntityMetaKey.Id]}
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
