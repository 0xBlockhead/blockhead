<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { entityResolversByEntityType } from '$/resolvers/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityFieldReference,
		href,
		id,
		title = 'Metric snapshots',
		open = $bindable(false),
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.XPost_Timestamp>
		href: string
		id: string
		title?: string
		open?: boolean
	} = $props()


	// Functions
	const xPostTimestampSources = (
		entityResolversByEntityType[EntityType.XPost_Timestamp]?.map((resolver) => resolver.source)
		?? [Source.Local_Internal]
	)


	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import XPost_TimestampView from '$/views/XPost_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.XPost_Timestamp}
	{href}
	{id}
	bind:open
	{title}
>
	{#snippet TypeAnnotationTooltip()}
			<p>
				Timestamped social metric snapshots captured from provider-visible counters.
			</p>
		{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: xPostTimestampSources,
			[entityFieldReference.fieldName]: {
				$: xPostTimestampSources,
				$limit: 64,
			},
		},
	)}
			{@const xPostTimestamps = derive(
		parent,
		(parent) => {
			const xPostTimestamps: Entity<typeof schema, EntityType.XPost_Timestamp>[] = (
				parent[entityFieldReference.fieldName] ?? []
			)
			return xPostTimestamps.map((value) => ({
				value,
			}))
		},
	)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.XPost_Timestamp}
				id={`${id}-items`}
				href={href}
				{title}
				resource={xPostTimestamps}
				open={true}
			>
				{#snippet Item({ item })}
						<XPost_TimestampView
							entityId={item.value[EntityMetaKey.Id]}
							{href}
							layout={EntityLayout.Summary}
							open={false}
							showTypeAnnotation={false}
						/>
					{/snippet}

			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
