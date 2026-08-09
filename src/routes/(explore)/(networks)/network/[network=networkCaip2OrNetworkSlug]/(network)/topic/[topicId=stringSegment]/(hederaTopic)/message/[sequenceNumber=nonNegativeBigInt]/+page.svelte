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
	import HederaTopicMessageView from '$/views/HederaTopicMessageView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'hedera topic message'} • hedera topic message • Blockhead</title>
</svelte:head>


<Page>
	<HederaTopicMessageView
		selection={
			select(EntityType.HederaTopicMessage, {
				$topic: data.selector,
				sequenceNumber: BigInt(params.sequenceNumber),
			})
		}
	/>
</Page>
