<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.FilecoinMessageSubcall, {
		$message: data.selector,
		index: Number(params.index),
	}, {
		sources: [
			Source.Filfox_Rest,
		],
		fields: {
			method: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMessageSubcallView from '$/views/FilecoinMessageSubcallView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'filecoin message subcall' : pageSelection.entity.method || 'filecoin message subcall')} • filecoin message subcall • Blockhead</title>
</svelte:head>


<Page>
	<FilecoinMessageSubcallView
		selection={pageSelection}
	/>
</Page>
