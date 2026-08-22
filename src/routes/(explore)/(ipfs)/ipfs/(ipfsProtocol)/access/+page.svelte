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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalIpfsAccessView from '$/views/_GlobalIpfsAccessView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'global IPFS access'} • global IPFS access • Blockhead</title>
</svelte:head>


<Page>
	<GlobalIpfsAccessView
		selection={
			select(EntityType._GlobalIpfsAccess, data.selector, {
				sources: [
					Source.Constants_Internal,
				],
			})
		}
	/>
</Page>
