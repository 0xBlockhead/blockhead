<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import LightningChannelsView from '$/views/LightningChannelsView.svelte'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Channels • Blockhead</title>
</svelte:head>


<Page>
	<LightningChannelsView
		selection={select(EntityType.LightningNetwork, {
			$network: { slug: params.networkSlug },
		})[EntityProxyField]<EntityType.LightningChannel>('$$channels')({ limit: 16 })}
		href={resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/channels', {
			networkSlug: params.networkSlug,
		})}
		id='channels'
	/>
</Page>
