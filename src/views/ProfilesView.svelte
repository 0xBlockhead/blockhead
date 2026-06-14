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
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	// State
	let {
		entityFieldReference,
		id = 'profiles',
		href = '',
		title = 'Farcaster profiles',
		open = $bindable(true),
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.FarcasterUser>
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

	import { subscribe } from '$/routes/+layout.svelte'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			{@const parent = subscribe(entityFieldReference.entityType,
		entityFieldReference.selector,({ fields: {
			[entityFieldReference.fieldName]: {
				sources: [
					Source.Snapchain_Rest,
				],
			},
		} }),
	)}
			{@const users = derive(
		parent,
		(parent) => {
			const farcasterUsers: readonly Entity<typeof schema, EntityType.FarcasterUser>[] = (
				parent.fields[entityFieldReference.fieldName]?.values ?? []
			)
			return (
				farcasterUsers.map((value) => ({
					value,
				}))
			)
		},
	)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.FarcasterUser}
				id={`${id}-items`}
				href={href}
				{title}
				getKey={(envelope) => envelope.value[EntityMetaKey.Selector].fid}
				getSortValue={(envelope) => envelope.value[EntityMetaKey.Selector].fid}
				placeholderKeys={new SvelteSet<number>()}
				placeholderText="Loading profiles…"
				resource={users}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
						<p data-text="muted">
							No profiles in this slice yet.
						</p>
					{/snippet}

				{#snippet Item({ item })}
						{@const userId = item.value[EntityMetaKey.Selector]}
						<FarcasterUserView
							selector={{ fid: userId.fid }}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}

			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
