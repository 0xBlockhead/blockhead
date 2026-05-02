<script lang="ts">
	// State
	import type { Snippet } from 'svelte'

	let {
		children,
		Pending,
		Failed,
	}: {
		children?: Snippet
		Pending?: Snippet
		Failed?: Snippet<[
			error: unknown,
			retry: () => void,
		]>
	} = $props()


	// Functions
	import { serializeError } from '$/lib/errors.ts'
	import { stringify } from '$/lib/json.ts'
</script>


<svelte:boundary
	onerror={(error) => {
		console.error(error)
	}}
>
	{#if children}
		{@render children()}
	{/if}

	{#snippet pending()}
		{#if Pending}
			{@render Pending()}
		{:else}
			<div
				data-card
				data-row
				class="loading"
			>
				<p>
					Loading...
				</p>
			</div>
		{/if}
	{/snippet}

	{#snippet failed(
		error,
		retry
	)}
		{#if Failed}
			{@render Failed(
				error,
				retry
			)}
		{:else}
			<div
				data-card
			>
				<header data-row="wrap">
					<div
						data-row="start"
						data-row-item="flexible"
					>
						<p role="alert">
							{error instanceof Error ? error.name : 'Error'}
						</p>
					</div>

					<div
						data-row
					>
						<button
							type="button"
							onclick={() => navigator.clipboard.writeText(String(serializeError(error)))}
						>
							Copy
						</button>

						{#if retry}
							<button
								type="button"
								onclick={retry}
							>
								Retry
							</button>
						{/if}
					</div>
				</header>

				<div class="error-content">
					{#if error instanceof Error}
						<p class="error-message">{error.message}</p>

						{#if error.stack}
							<details class="error-stack">
								<summary>
									Stack trace
								</summary>
								<pre>{error.stack}</pre>
							</details>
						{/if}
					{:else}
						<pre>{stringify(error ?? null, null, 2)}</pre>
					{/if}
				</div>
			</div>
		{/if}
	{/snippet}
</svelte:boundary>


<style>
	.loading {
		cursor: wait;
	}

	.error-content {
		.error-message,
		pre {
			overflow: auto;
			min-width: 100%;
			width: 0;
		}

		pre {
			font-size: smaller;
		}
	}

	:global(body.svelte-inspector-enabled) {
		div {
			pointer-events: none;
		}
	}
</style>
