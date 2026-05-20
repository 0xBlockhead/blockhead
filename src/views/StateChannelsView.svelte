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
		title = 'State channels',
		open = $bindable(true),
		collapsible = true,
		href,
		id,
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.StateChannel>
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
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import Tooltip from '$/components/Tooltip.svelte'
	import ChannelView from '$/views/ChannelView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	{collapsible}
	entityType={EntityType.StateChannel}
	{href}
	{id}
	{title}
>
	{#snippet Empty()}
		<div data-row="wrap align-center gap-2">
			<p data-text="muted">
				No state channels in this datastore yet.
			</p>
			<Tooltip contentProps={{ side: 'top' }}>
				{#snippet Content()}
					<p>
						Participants update a joint ledger off-chain and settle or challenge on-chain if cooperation stops.
					</p>
					<p>
						Not chat apps, AMM pools, or receipt logs.
					</p>
				{/snippet}
				<abbr
					class="entity-heading-tip"
					aria-label="About state channels"
				>ⓘ</abbr>
			</Tooltip>
		</div>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					[entityFieldReference.fieldName]: {
						$: [Source.Local_Internal],
					},
				},
			)}
			{@const stateChannels = derive(
				parent,
				(parent) => {
					const rows: Entity<typeof schema, EntityType.StateChannel>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						rows.map((value) => ({
							value,
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.StateChannel}
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].id}
				{href}
				id={`${id}-items`}
				placeholderKeys={new SvelteSet()}
				open={true}
				resource={stateChannels}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<div data-row="wrap align-center gap-2">
						<p data-text="muted">
							No state channels in this datastore yet.
						</p>
						<Tooltip contentProps={{ side: 'top' }}>
							{#snippet Content()}
								<p>
									Participants update a joint ledger off-chain and settle or challenge on-chain if cooperation stops.
								</p>
								<p>
									Not chat apps, AMM pools, or receipt logs.
								</p>
							{/snippet}
							<abbr
								class="entity-heading-tip"
								aria-label="About state channels"
							>ⓘ</abbr>
						</Tooltip>
					</div>
				{/snippet}

				{#snippet Item(props)}
					{#if props.item}
						{@const channelId = props.item.value[EntityMetaKey.Id]}
						<ChannelView
							entityId={channelId}
							href={resolve('/(assets)/(channels)/channel/[channelId]', {
								channelId: channelId.id,
							})}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
