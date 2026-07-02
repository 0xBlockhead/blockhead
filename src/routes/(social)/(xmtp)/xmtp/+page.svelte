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
	import XmtpNetworkView from '$/views/XmtpNetworkView.svelte'
</script>


<svelte:head>
	<title>XMTP • Blockhead</title>
</svelte:head>


<Page>
	<XmtpNetworkView
		href={resolve('/(social)/(xmtp)/xmtp')}
		selection={
			select(EntityType.XmtpNetwork, data.selector, {
				fields: {
					protocolName: true,
					registryLabel: true,
					topology: true,
					homeUrl: true,
					docsUrl: true,
				},
			})
		}
	/>
</Page>
