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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.XrplAmendment, data.selector, {
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XrplAmendmentView from '$/views/XrplAmendmentView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? 'XRPL amendment' : 'XRPL amendment'))} • XRPL amendment • Blockhead</title>
</svelte:head>


<Page>
	<XrplAmendmentView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/amendment/[amendmentId=stringSegment]', {
				network: params.network,
				amendmentId: params.amendmentId,
			})
		}
		selection={pageSelection}
	/>
</Page>
