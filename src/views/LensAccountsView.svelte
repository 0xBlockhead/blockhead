<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		open = $bindable(true),
		title = 'Accounts',
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.LensAccount>
			href: string
			id: string
			open?: boolean
			title?: string
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

	const lensNetwork = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [Source.Constants_Internal],
			protocolName: {},
			$$lensAccounts: {
				$: [
					Source.Constants_Internal,
					Source.Lens_Graphql,
				],
			},
		},
	)

	const accounts = derive(
		lensNetwork,
		(loaded) => (
			loaded.$$lensAccounts
			?? []
		),
	)
</script>


<EntitiesList
	entityType={EntityType.LensAccount}
	{href}
	{id}
	bind:open
	{title}
	{...entitiesListRest}
>
	{#snippet body()}
		{#key stringify(entityFieldReference.entityId)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.LensAccount}
				id={`${id}-items`}
				{href}
				{title}
				open={true}
				getKey={(row) => stringify(row[EntityMetaKey.Id])}
				getSortValue={(row) => row[EntityMetaKey.Id].address}
				placeholderKeys={new SvelteSet()}
				placeholderText="Loading Lens network…"
				resource={accounts}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No Lens accounts to show yet.
					</p>
				{/snippet}

				{#snippet Item(props)}
					{#if props.item}
						<LensAccountView
							entityId={{ address: props.item[EntityMetaKey.Id].address }}
							href={resolve('/(social)/lens/account/[address]', {
								address: props.item[EntityMetaKey.Id].address,
							})}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/key}
	{/snippet}
</EntitiesList>
