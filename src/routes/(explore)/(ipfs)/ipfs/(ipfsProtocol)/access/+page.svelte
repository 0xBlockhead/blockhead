<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType._GlobalIpfsAccess, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? 'global IPFS access' : 'global IPFS access')))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalIpfsAccessView from '$/views/_GlobalIpfsAccessView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • global IPFS access • Blockhead</title>
</svelte:head>


<Page>
	<GlobalIpfsAccessView
		href={resolve('/ipfs/access')}
		selection={pageSelection}
	/>
</Page>
