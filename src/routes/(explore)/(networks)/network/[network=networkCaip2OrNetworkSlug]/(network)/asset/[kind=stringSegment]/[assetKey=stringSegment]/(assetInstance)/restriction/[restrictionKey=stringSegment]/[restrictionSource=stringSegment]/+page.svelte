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
	import TransferRestrictionView from '$/views/TransferRestrictionView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'transfer restriction'} • transfer restriction • Blockhead</title>
</svelte:head>


<Page>
	<TransferRestrictionView
		selection={
			select(EntityType.TransferRestriction, data.selector, {
				sources: [data.selector.source],
			})
		}
	/>
</Page>
