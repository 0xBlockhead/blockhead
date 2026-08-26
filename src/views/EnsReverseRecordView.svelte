<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.EnsReverseRecord>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EnsReverseRecord_TimestampsView from '$/views/EnsReverseRecord_TimestampsView.svelte'
	import AccountView from '$/views/AccountView.svelte'
	import EnsNameView from '$/views/EnsNameView.svelte'
</script>


<EntityView
	entityType={EntityType.EnsReverseRecord}
	entitySelector={selection.entitySelector}
	title={title ?? 'ENS reverse record'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/account/[namespace=stringSegment]:[reference=stringSegment]/[accountAddress=stringSegment]/(account)/ens/reverse/[ensName=stringSegment]',
				{
					namespace: selection.entitySelector.$account.caip10.namespace,
					reference: selection.entitySelector.$account.caip10.reference,
					accountAddress: selection.entitySelector.$account.caip10.accountAddress,
					ensName: encodeURIComponent(selection.entitySelector.$name.name),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<EnsNameView
			selection={select(EntityType.EnsName, selection.entitySelector.$name)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<AccountView
			selection={select(EntityType.Account, selection.entitySelector.$account)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<AccountView
						selection={select(EntityType.Account, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Name</dt>
				<dd>
					<EnsNameView
						selection={select(EntityType.EnsName, selection.entitySelector.$name)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EnsReverseRecord_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
