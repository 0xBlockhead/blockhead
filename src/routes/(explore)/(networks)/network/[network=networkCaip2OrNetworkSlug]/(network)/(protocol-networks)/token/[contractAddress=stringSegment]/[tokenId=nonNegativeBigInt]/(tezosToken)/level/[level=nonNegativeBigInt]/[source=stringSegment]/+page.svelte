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


	// Components
	import Page from '$/components/Page.svelte'
	import TezosToken_TimestampView from '$/views/TezosToken_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'tezos token timestamp'} • tezos token timestamp • Blockhead</title>
</svelte:head>


<Page>
	<TezosToken_TimestampView
		selection={
			select(EntityType.TezosToken_Timestamp, {
				$token: data.selector,
				level: BigInt(params.level),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
