<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
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
	import MevRelayView from '$/views/MevRelayView.svelte'
</script>


<Page>
	<MevRelayView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/relay/[host]', {
				caip2: params.caip2,
				host: params.host,
			})
		}
		selection={
			select(EntityType.MevRelay, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				host: decodeURIComponent(params.host),
			}, {
				fields: {
					url: true,
				},
			})
		}
	/>
</Page>
