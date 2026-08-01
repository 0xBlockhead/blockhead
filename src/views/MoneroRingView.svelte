<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.MoneroRing>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MoneroRingMembersView from '$/views/MoneroRingMembersView.svelte'
	import MoneroKeyImageView from '$/views/MoneroKeyImageView.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroRing}
	entitySelector={selection.entitySelector}
	title={title ?? 'monero ring'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<MoneroKeyImageView
			selection={select(EntityType.MoneroKeyImage, selection.entitySelector.$keyImage)}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		Ring
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Key image</dt>
				<dd>
					<MoneroKeyImageView
						selection={select(EntityType.MoneroKeyImage, selection.entitySelector.$keyImage)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const membersResource = selection.$$members}
		<ResourceBoundary
			resource={membersResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<MoneroRingMembersView
						selection={membersResource}
						countResource={membersResource.count}
						title='Members'
						id='members'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
