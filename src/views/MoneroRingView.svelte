<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.MoneroRing>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import MoneroRingMemberView from '$/views/MoneroRingMemberView.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroRing}
	entitySelector={selection.entitySelector}
	title={'Monero Ring'}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		Monero Ring
	{/snippet}

	{#snippet Content()}
		<EntitiesList
			entityType={EntityType.MoneroRingMember}
			href={`#${encodeURIComponent(`${stringify(selection.entitySelector)}:members`)}`}
			id={`${stringify(selection.entitySelector)}:members`}
			title="Ring members"
			bind:open
			collapsible={false}
		>
			{#snippet body()}
				{#if open}
					{@const moneroRingMembers = selection(
					).$$members}
					<ResourceBoundary resource={moneroRingMembers} placeholderText="Loading Monero ring members...">
						{#snippet children(moneroRingMembers)}
							<EntitiesList
								collapsible={false}
								showSummary={false}
								entityType={EntityType.MoneroRingMember}
								href={`#${encodeURIComponent(`${stringify(selection.entitySelector)}:members`)}`}
								id={`${stringify(selection.entitySelector)}:members-items`}
								title="Ring members"
								open={true}
								items={moneroRingMembers.entities}
								getKey={(row) => stringify(row.entitySelector)}
							>
								{#snippet Item({ item: member })}
									<MoneroRingMemberView
										selection={select(EntityType.MoneroRingMember, member.entitySelector)}
										layout={EntityLayout.Summary}

									/>
								{/snippet}
							</EntitiesList>
						{/snippet}
					</ResourceBoundary>
				{/if}
			{/snippet}
		</EntitiesList>
	{/snippet}
</EntityView>
