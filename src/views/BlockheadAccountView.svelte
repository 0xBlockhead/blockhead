<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadAccount>, 'prefetched'> = $props()


	// Components
	import AccountView from '$/views/AccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAccount}
	entitySelector={selection.entitySelector}
	title={title ?? 'blockhead account'}
	href={
		href === undefined ?
			resolve(
				'/~/accounts/account/[namespace=stringSegment]:[reference=stringSegment]/[accountAddress=stringSegment]',
				{
					namespace: selection.entitySelector.$account.caip10.namespace,
					reference: selection.entitySelector.$account.caip10.reference,
					accountAddress: selection.entitySelector.$account.caip10.accountAddress,
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
		<AccountView
			selection={select(EntityType.Account, selection.entitySelector.$account)}
			href={null}
			layout={EntityLayout.Title}
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
		</dl>
	{/snippet}
</EntityView>
