<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		id = 'profiles',
		href = '',
		title = 'Farcaster profiles',
		open = $bindable(true),
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
			id?: string
			href?: string
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()


	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<EntitiesList
	entityType={EntityType.FarcasterUser}
	{id}
	{title}
	bind:open
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
			<p>
				Farcaster profiles are on-chain-anchored identities keyed by numeric FID, with off-chain social graph data on hubs.
			</p>
			<p>
				A single directory response is always a bounded subset (e.g. one hub’s registry snapshot)—never the entire protocol user set in one page.
			</p>
		{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: [Source.Snapchain_Rest],
				})} placeholderText={`Loading ${title.toLowerCase()}…`}>
				{#snippet children(users)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.FarcasterUser}
						id={`${id}-items`}
						href={href}
						{title}
						getKey={(row) => row.entitySelector.fid}
						getSortValue={(row) => row.entitySelector.fid}
						placeholderKeys={new SvelteSet<number>()}
						placeholderText="Loading profiles…"
						items={users.entities}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
						open={true}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No profiles in this slice yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<FarcasterUserView
								selector={{ fid: item.entitySelector.fid }}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
