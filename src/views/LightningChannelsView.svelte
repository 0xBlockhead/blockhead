<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	// State
	let { entityFieldReference, title = 'Channels', open = $bindable(true), id, href = '', ...EntitiesListProps }: WithRest<{ entityFieldReference: EntityFieldReference<typeof schema, EntityType.LightningChannel>, title?: string, open?: boolean, id: string, href?: string }, Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>> = $props()

	import { subscribe } from '$/routes/+layout.svelte'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LightningChannelView from '$/views/LightningChannelView.svelte'
</script>


<EntitiesList entityType={EntityType.LightningChannel} {title} bind:open {id} href={href} {...EntitiesListProps}>
	{#snippet body()}
		{#if open}
			{@const parent = subscribe(entityFieldReference.entityType, entityFieldReference.entityId, ({ fields: { [entityFieldReference.fieldName]: { sources: [Source.LightningMempoolSpace_Rest, Source.LightningLnd_Rest], limit: 32 } } }))}
			{@const channels = derive(parent, (parent): readonly Entity<typeof schema, EntityType.LightningChannel>[] => (parent.fields[entityFieldReference.fieldName]?.values ?? []))}
			<EntitiesList collapsible={false} showSummary={false} entityType={EntityType.LightningChannel} id={`${id}-lightning-channels`} href={href} getKey={(channel) => channel[EntityMetaKey.Id].channelId} getSortValue={(channel) => channel[EntityMetaKey.Id].channelId} open={true} resource={channels} {title} UnorderedListProps={{ orientation: ListOrientation.Column }}>
				{#snippet Empty()}<p data-text="muted">No channels listed yet.</p>{/snippet}
				{#snippet Item(context)}
					<LightningChannelView entityId={context!.item[EntityMetaKey.Id]} layout={EntityLayout.Summary} open={false} />
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
