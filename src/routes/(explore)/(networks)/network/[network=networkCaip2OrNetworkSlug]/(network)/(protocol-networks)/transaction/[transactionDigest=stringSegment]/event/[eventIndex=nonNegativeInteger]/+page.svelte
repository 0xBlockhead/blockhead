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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SuiEventView from '$/views/SuiEventView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'Sui event'} • Sui event • Blockhead</title>
</svelte:head>


<Page>
	<SuiEventView
		selection={
			select(EntityType.SuiEvent, {
				$network: data.selector,
				transactionDigest: params.transactionDigest,
				eventIndex: Number(params.eventIndex),
			})
		}
	/>
</Page>
