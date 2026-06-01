<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { entityResolversByEntityType } from '$/resolvers/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	let {
		entityFieldReference,
		href,
		id,
		title = 'Metric snapshots',
		open = $bindable(false),
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.XUser_Timestamp>
		href: string
		id: string
		title?: string
		open?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const xUserTimestampSources = (
		entityResolversByEntityType[EntityType.XUser_Timestamp]?.map((resolver) => resolver.source)
		?? [Source.Local_Internal]
	)

	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import XUser_TimestampView from '$/views/XUser_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.XUser_Timestamp}
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
			$: xUserTimestampSources,
			[entityFieldReference.fieldName]: {
				$: xUserTimestampSources,
				$limit: 64,
			},
		},
	)}
			{@const xUserTimestamps = derive(
		parent,
		(parent) => {
			const xUserTimestamps: Entity<typeof schema, EntityType.XUser_Timestamp>[] = (
				parent[entityFieldReference.fieldName] ?? []
			)
			return xUserTimestamps.map((value) => ({
				value,
			}))
		},
	)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.XUser_Timestamp}
				id={`${id}-items`}
				href={href}
				{title}
				resource={xUserTimestamps}
				open={true}
			>
				{#snippet Item({ item })}
						<XUser_TimestampView
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
