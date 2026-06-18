<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		id = 'users',
		title = 'Users',
		open = $bindable(true),
		collapsible = true,
		CollapsibleProps = {},
		href,
	}: {
		selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
		id?: string
		title?: string
		CollapsibleProps?: ComponentProps<typeof EntitiesList>['CollapsibleProps']
		href?: ComponentProps<typeof EntitiesList>['href']
		open?: boolean
		collapsible?: boolean
	} = $props()

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<EntitiesList
	{CollapsibleProps}
	entityType={EntityType.FarcasterUser}
	{id}
	{title}
	bind:open
	{collapsible}
	{href}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Farcaster users are numeric FIDs registered through Hubs and Snapchain-style sync; directory APIs enumerate who exists on that network view.
		</p>
		<p>
			Human-readable fnames resolve per profile; empty directories usually mean the indexer has not caught up yet.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No Farcaster users in this farcasterUsers yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
			{#if open}
				<ResourceBoundary
					resource={selection({
						sources: [Source.Snapchain_Rest],
					})}
					placeholderText="Loading Farcaster users…"
				>
					{#snippet children(users)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.FarcasterUser}
						id={`${id}-items`}
						{title}
						open={true}
							items={users.values}
						getKey={(farcasterUser) => stringify(farcasterUser[EntityMetaKey.Selector])}
						getSortValue={(farcasterUser) => farcasterUser[EntityMetaKey.Selector].fid}
						placeholderText="Loading Farcaster users…"
					>
						{#snippet Empty()}
							<p data-text="muted">
								No Farcaster users in this farcasterUsers yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<FarcasterUserView
								selector={item[EntityMetaKey.Selector]}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
