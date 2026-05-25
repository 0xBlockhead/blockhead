<script>
	// Functions
	import { greet } from './greet.ts'


	// State
	let { host = 'SvelteKit', guest = 'Vitest' } = $props()
</script>


<h1>{greet(host)}</h1>
<p>{greet(guest)}</p>
