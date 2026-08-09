<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import PayoutView from '$/views/PayoutView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'payout'} • payout • Blockhead</title>
</svelte:head>


<Page>
	<PayoutView
		selection={
			select(EntityType.Payout, data.selector, {
				sources: [data.selector.source],
			})
		}
	/>
</Page>
