<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import UrlsView from '$/views/UrlsView.svelte'
</script>


<svelte:head>
	<title>Faucets • Blockhead</title>
</svelte:head>


<Page>
	<UrlsView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/faucets', {
				caip2: params.caip2,
			})
		}
		title='Faucets'
		selection={
			select(EntityType.Network, {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			})[EntityProxyField]<EntityType.Url>('$$faucetUrls')
		}
		id='faucet-urls'
	/>
</Page>
