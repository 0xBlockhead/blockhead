<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'

	const pageSelection = $derived(select(EntityType._GlobalIpfsAccess, {
		scope: '_GlobalIpfsAccess',
	}, {
		sources: [
			Source.Constants_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalIpfsAccessView from '$/views/_GlobalIpfsAccessView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? 'global IPFS access' : 'global IPFS access')} • global IPFS access • Blockhead</title>
</svelte:head>


<Page>
	<GlobalIpfsAccessView
		href={resolve('/ipfs/access')}
		selection={pageSelection}
	/>
</Page>
