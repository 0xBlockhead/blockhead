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
	import BlockheadStateChannelDepositView from '$/views/BlockheadStateChannelDepositView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'blockhead state channel deposit'} • blockhead state channel deposit • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadStateChannelDepositView
		selection={
			select(EntityType.BlockheadStateChannelDeposit, data.selector, {
				sources: [
					Source.Local_Internal,
				],
			})
		}
	/>
</Page>
