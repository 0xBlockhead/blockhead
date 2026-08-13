<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
		params,
	}: LayoutProps = $props()
</script>


<p>
	<a
		href={resolve('/(social)/(atproto)/atproto/(globalAtprotoNetwork)/repo/[repoDid=stringSegment]/commit/cid/[commitCid=stringSegment]/[source=stringSegment]/car-manifest.json', params)}
	>
		Download verified decoded CAR commit manifest JSON
	</a>
</p>

{@render children()}
