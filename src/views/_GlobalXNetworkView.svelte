<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType._GlobalXNetwork>, 'prefetched'> = $props()

	const viewDomId = $derived('-global-xnetwork-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import XUsersView from '$/views/XUsersView.svelte'
	import XPostsView from '$/views/XPostsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalXNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		{selection.entitySelector.scope}
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-x-directory'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'x-users',
						label: 'Users',
					},
					{
						id: 'x-posts',
						label: 'Posts',
					},
				]
			}
			data-card
			class='network-view-collapsible-directory'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Directory</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionXUsers({ id, label })}
				<XUsersView
					selection={selection.$$observedUsers}
					collapsible={false}
					title={label}
					emptyText='No X users in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionXPosts({ id, label })}
				<XPostsView
					selection={selection.$$observedPosts}
					collapsible={false}
					title={label}
					emptyText='No X posts in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
