<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		id = 'casts',
		title = 'Casts',
		limit = 25,
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
			id?: string
			title?: string
			limit?: number
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<EntitiesList
	entityType={EntityType.FarcasterCast}
	{id}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Casts are immutable messages (FID + hash) referenced by feeds; trending, author, and channel feeds differ only in hub query semantics.
		</p>
		<p>
			An empty feed response usually means no hashes matched that filter at the hub—not that the chain halted.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No casts yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
			{#if open}
				<ResourceBoundary
					resource={selection({
						sources: [
							import.meta.env.PUBLIC_NEYNAR_API_KEY?.trim() ?
								Source.Neynar_Rest
							:
								Source.Snapchain_Rest,
						],
						limit,
					})}
					placeholderText="Loading feed casts (Farcaster FID + cast hash)…"
				>
					{#snippet children(casts)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.FarcasterCast}
						id={`${id}-items`}
						href={EntitiesListProps.href}
						{title}
						open={true}
							items={casts.values}
						getKey={(farcasterCast) => stringify(farcasterCast[EntityMetaKey.Selector])}
						getSortValue={(farcasterCast) => stringify(farcasterCast[EntityMetaKey.Selector])}
						placeholderText="Loading feed casts (Farcaster FID + cast hash)…"
					>
						{#snippet Empty()}
							<p data-text="muted">
								No casts yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<FarcasterCastView
								selector={item[EntityMetaKey.Selector]}
								layout={EntityLayout.Summary}

								variant="feed"
							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
