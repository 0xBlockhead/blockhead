<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NetworkStackView from '$/views/NetworkStackView.svelte'
</script>


<Page>
	<NetworkStackView
		href={
			resolve('/(explore)/network-stack/[networkStackId]', {
				networkStackId: params.networkStackId,
			})
		}
		selection={
			select(EntityType.NetworkStack, {
				networkStackId: params.networkStackId,
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					label: true,
				},
			})
		}
	/>
</Page>
