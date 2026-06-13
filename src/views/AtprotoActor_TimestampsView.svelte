<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		href,
		id,
		title = 'Metric snapshots',
		open = $bindable(false),
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.AtprotoActor_Timestamp>
		href: string
		id: string
		title?: string
		open?: boolean
	} = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import AtprotoActor_TimestampView from '$/views/AtprotoActor_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.AtprotoActor_Timestamp}
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
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.entityId,({ sources: [
						Source.Atproto_Xrpc,
						Source.Atproto_BskySocial_Xrpc,
					], fields: { [entityFieldReference.fieldName]: {
						sources: [
							Source.Atproto_Xrpc,
							Source.Atproto_BskySocial_Xrpc,
						],
						limit: 64,
					},
				} }),
			)}
			{@const atprotoActorTimestamps = derive(
				parent,
				(parent) => {
					const atprotoActorTimestamps: readonly Entity<typeof schema, EntityType.AtprotoActor_Timestamp>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return atprotoActorTimestamps.map((value) => ({
						value,
					}))
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.AtprotoActor_Timestamp}
				id={`${id}-items`}
				href={href}
				open={true}
				resource={atprotoActorTimestamps}
			>
				{#snippet Item({ item })}
					<AtprotoActor_TimestampView
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
