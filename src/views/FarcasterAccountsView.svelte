<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadFarcasterAccountConnectionView from '$/views/BlockheadFarcasterAccountConnectionView.svelte'


	// Props
	let {
		entityFieldReference,
		id = 'accounts',
		href = resolve('/farcaster/accounts'),
		title = 'Accounts',
		open = $bindable(true),
		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.BlockheadFarcasterAccountConnection
			>
			id?: string
			href?: string
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { Source } from '$/sources/$Source.ts'


	const globalEntity = useEntity(
		EntityType._Global,
		entityFieldReference.entityId,
		{
			$: [Source.Local_Internal],
			$$blockheadFarcasterAccountConnections: {},
		},
	)

	const connections = derive(
		globalEntity,
		(globalRow) => (
			(globalRow['$$blockheadFarcasterAccountConnections'] ?? [])
				.toSorted((a, b) => (
					a[EntityMetaKey.Id].fid - b[EntityMetaKey.Id].fid
				))
				.map((result) => ({
					result,
				}))
		),
	)
</script>


<EntitiesList
	entityType={EntityType.BlockheadFarcasterAccountConnection}
	{id}
	{href}
	{title}
	bind:open
	getKey={(row) => row.result[EntityMetaKey.Id].fid}
	getSortValue={(row) => row.result[EntityMetaKey.Id].fid}
	placeholderKeys={new SvelteSet()}
	placeholderText="Loading accounts…"
	resource={connections}
	{...entitiesListProps}
>
	{#snippet Empty()}
		<p data-text="muted">
			No accounts yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			{@const fid = props.item.result[EntityMetaKey.Id]}
			<BlockheadFarcasterAccountConnectionView
				entityId={{ fid: fid.fid }}
				href={resolve('/(social)/(farcaster)/farcaster/(accounts)/account/[accountId]', {
					accountId: String(fid.fid),
				})}
				layout={EntityLayout.Summary}
				open={false}
				title="Account"
			/>
		{/if}
	{/snippet}
</EntitiesList>
