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


	// Components
	import Page from '$/components/Page.svelte'
	import PendlePositionView from '$/views/PendlePositionView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'Pendle position'} • Pendle position • Blockhead</title>
</svelte:head>


<Page>
	<PendlePositionView
		selection={
			select(EntityType.PendlePosition, {
				$account: {
					$network: data.selector.$network,
					$actor: {
						address: params.accountAddress,
					},
				},
				$market: data.selector,
			}, {
				sources: [
					Source.Pendle_Rest,
				],
			})
		}
	/>
</Page>
