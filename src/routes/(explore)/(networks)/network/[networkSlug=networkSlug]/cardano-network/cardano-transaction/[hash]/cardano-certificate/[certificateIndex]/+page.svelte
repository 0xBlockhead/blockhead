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
	import CardanoCertificateView from '$/views/CardanoCertificateView.svelte'
</script>


<Page>
	<CardanoCertificateView
		selection={select(EntityType.CardanoCertificate, data.selector)}
	/>
</Page>
