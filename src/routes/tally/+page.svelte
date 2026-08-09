<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import HeadingComponent from '$/components/Heading.svelte'


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Tally governance • Blockhead</title>
</svelte:head>


<Page>
	<section data-card>
		<header data-row-item='flexible'>
			<HeadingComponent>Tally governance</HeadingComponent>
		</header>

		<p>Browse a Tally governor or proposal from its canonical Tally link, then follow its organization, network, proposal status, schedule, and discussion links in Blockhead.</p>
		<p><a href={resolve('/snapshot/spaces')}>Browse Snapshot spaces and proposals</a></p>
	</section>
</Page>
