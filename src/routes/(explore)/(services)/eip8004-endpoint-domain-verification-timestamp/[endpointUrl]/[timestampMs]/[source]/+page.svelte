<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import Eip8004EndpointDomainVerification_TimestampView from '$/views/Eip8004EndpointDomainVerification_TimestampView.svelte'
</script>


<Page>
	<Eip8004EndpointDomainVerification_TimestampView
		selection={select(EntityType.Eip8004EndpointDomainVerification_Timestamp, data.selector)}
	/>
</Page>
