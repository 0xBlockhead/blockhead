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
	import HederaTokenAssociation_TimestampView from '$/views/HederaTokenAssociation_TimestampView.svelte'
</script>


<Page>
	<HederaTokenAssociation_TimestampView
		selection={select(EntityType.HederaTokenAssociation_Timestamp, data.selector)}
	/>
</Page>
