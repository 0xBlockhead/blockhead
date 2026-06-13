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
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	// State
	let {
		title = 'Pool observations',
		open = $bindable(true),
		entityFieldReference,
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.LiquidityPool_Timestamp>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()

	import { subscribe } from '$/routes/+layout.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import LiquidityPool_TimestampView from '$/views/LiquidityPool_TimestampView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	entityType={EntityType.LiquidityPool_Timestamp}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Timestamped pool observations separate volatile market metrics from the stable pool identity.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No pool observations yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const pool = subscribe(entityFieldReference.entityType,
				entityFieldReference.entityId,({ fields: {
					[entityFieldReference.fieldName]: {
						sources: [
							Source.Dexscreener_OpenApi,
						],
						limit: 64,
					},
				} }),
			)}
			{@const timestamps = derive(
				pool,
				(pool) => {
					const liquidityPoolTimestamps: readonly Entity<typeof schema, EntityType.LiquidityPool_Timestamp>[] = pool.fields[entityFieldReference.fieldName]?.values ?? []
					return liquidityPoolTimestamps.map((value) => ({
						value,
					}))
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				{...EntitiesListProps}
				entityType={EntityType.LiquidityPool_Timestamp}
				getKey={(timestamp) => stringify(timestamp.value[EntityMetaKey.Id])}
				getSortValue={(timestamp) => String(timestamp.value[EntityMetaKey.Id].timestampMs)}
				placeholderKeys={new SvelteSet<string>()}
				resource={timestamps}
				{title}
				open={true}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No pool observations yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					<LiquidityPool_TimestampView
						entityId={item.value[EntityMetaKey.Id]}
						id={stringify(item.value[EntityMetaKey.Id])}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
