<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()

	const detailHref = $derived(
		resolve(
			'/(explore)/account/[namespace=stringSegment]:[reference=stringSegment]/[accountAddress=stringSegment]',
			{
				namespace: params.namespace,
				reference: params.reference,
				accountAddress: params.accountAddress,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import AccountView from '$/views/AccountView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if data?.selector != null}
			<AccountView
				selection={
					select(EntityType.Account, data.selector, {
						sources: [
							Source.Constants_Internal,
						],
					})
				}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
