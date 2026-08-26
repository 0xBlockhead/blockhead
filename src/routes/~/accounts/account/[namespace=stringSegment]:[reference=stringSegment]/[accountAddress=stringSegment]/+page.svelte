<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAccountView from '$/views/BlockheadAccountView.svelte'
</script>


<svelte:head>
	<title>blockhead account • blockhead account • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadAccountView
		selection={
			select(EntityType.BlockheadAccount, {
				$account: {
					caip10: {
						namespace: params.namespace,
						reference: params.reference,
						accountAddress: params.accountAddress,
					},
				},
			}, {
				sources: [
					Source.Local_Internal,
				],
			})
		}
	/>
</Page>
