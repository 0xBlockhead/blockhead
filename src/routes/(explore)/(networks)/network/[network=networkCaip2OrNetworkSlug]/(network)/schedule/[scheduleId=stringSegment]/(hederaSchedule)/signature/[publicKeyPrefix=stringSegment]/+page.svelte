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
	import HederaScheduleSignatureView from '$/views/HederaScheduleSignatureView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'hedera schedule signature'} • hedera schedule signature • Blockhead</title>
</svelte:head>


<Page>
	<HederaScheduleSignatureView
		selection={
			select(EntityType.HederaScheduleSignature, {
				$schedule: data.selector,
				publicKeyPrefix: params.publicKeyPrefix,
			})
		}
	/>
</Page>
