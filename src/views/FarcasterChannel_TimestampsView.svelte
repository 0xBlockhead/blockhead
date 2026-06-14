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
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.FarcasterChannel_Timestamp>
		href: string
		id: string
		title?: string
		open?: boolean
	} = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import FarcasterChannel_TimestampView from '$/views/FarcasterChannel_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.FarcasterChannel_Timestamp}
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
				entityFieldReference.selector,({ sources: [
						Source.Farcaster_Rest,
					], fields: { [entityFieldReference.fieldName]: {
						sources: [
							Source.Farcaster_Rest,
						],
						limit: 64,
					},
				} }),
			)}
			{@const farcasterChannelTimestamps = derive(
				parent,
				(parent) => {
					const farcasterChannelTimestamps: readonly Entity<typeof schema, EntityType.FarcasterChannel_Timestamp>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return farcasterChannelTimestamps.map((value) => ({
						value,
					}))
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.FarcasterChannel_Timestamp}
				id={`${id}-items`}
				href={href}
				open={true}
				resource={farcasterChannelTimestamps}
			>
				{#snippet Item({ item })}
					<FarcasterChannel_TimestampView
						selector={item.value[EntityMetaKey.Selector]}
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
