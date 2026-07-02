<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalIpfsAccessView from '$/views/_GlobalIpfsAccessView.svelte'
</script>


<svelte:head>
	<title>global IPFS access • Blockhead</title>
</svelte:head>


<Page>
	<GlobalIpfsAccessView
		href={resolve('/(explore)/(ipfs)/ipfs/access')}
		selection={select(EntityType._GlobalIpfsAccess, data.selector)}
	/>
</Page>
