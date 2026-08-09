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

	const pageSelection = $derived(select(EntityType.FilecoinMessageFee, {
		$message: data.selector,
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMessageFeeView from '$/views/FilecoinMessageFeeView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.source || 'filecoin message fee')} • filecoin message fee • Blockhead</title>
</svelte:head>


<Page>
	<FilecoinMessageFeeView
		selection={pageSelection}
	/>
</Page>
