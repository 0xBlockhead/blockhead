<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type LightningChannelsResource = EntityProxyEntitiesResource<
		typeof schema,
		EntityType.LightningChannel
	>

	// State
	let { selection, title = 'Channels', open = $bindable(true), id, href = '', ...EntitiesListProps }: WithRest<{ selection: LightningChannelsResource, title?: string, open?: boolean, id: string, href?: string }, Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>> = $props()

	
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LightningChannelView from '$/views/LightningChannelView.svelte'
</script>


<EntitiesList entityType={EntityType.LightningChannel} {title} bind:open {id} href={href} {...EntitiesListProps}>
	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={selection} placeholderText="Loading channels…">
				{#snippet children(channels)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.LightningChannel}
						id={`${id}-lightning-channels`}
						href={href}
						getKey={(channel) => channel.entitySelector.channelId}
						getSortValue={(channel) => channel.entitySelector.channelId}
						open={true}
						items={channels.values}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}<p data-text="muted">No channels listed yet.</p>{/snippet}
						{#snippet Item({ item })}
							<LightningChannelView selection={select(EntityType.LightningChannel, item.entitySelector)} layout={EntityLayout.Summary} />
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
