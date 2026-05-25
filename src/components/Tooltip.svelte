<script module lang="ts">
	export type TooltipTriggerProps = {
		popovertarget: string
		popovertargetaction: 'toggle' | 'show' | 'hide'
		[key: string]: unknown
	}
</script>


<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'


	// State
	let {
		content = '',
		triggerLabel = '',
		triggerAction = 'hover',
		triggerProps = {},
		contentProps = {},
		Trigger,
		Content,
		children,
	}: {
		content?: string
		triggerLabel?: string
		triggerAction?: 'hover' | 'click'
		triggerProps?: Record<string, unknown>
		contentProps?: Record<string, unknown>
		Trigger?: Snippet<[TooltipTriggerProps]>
		Content?: Snippet
		children?: Snippet
	} = $props()


	// Functions
	const onTriggerEnter = () => {
		if (triggerAction !== 'hover' || !triggerEl || !popoverEl) return
		;(popoverEl as HTMLElement & { showPopover(opts?: { source?: HTMLElement }): void }).showPopover({
			source: triggerEl,
		})
	}

	const onTriggerLeave = () => {
		if (triggerAction !== 'hover' || !popoverEl) return
		popoverEl.hidePopover()
	}


	// State
	const popoverId = $props.id()

	let triggerEl: HTMLElement | null = $state(null)

	let popoverEl: HTMLElement | null = $state(null)


	const side = $derived((contentProps?.side as string) ?? 'top')

	const sideOffset = $derived((contentProps?.sideOffset as number) ?? 6)
</script>


<span
	class="tooltip-wrapper"
	data-trigger-action={triggerAction}
>
	{#if triggerAction === 'click'}
		{#if Trigger}
			{@render Trigger({
				...triggerProps,
				popovertarget: popoverId,
				popovertargetaction: 'toggle',
			})}
		{:else}
			<button
				class="tooltip-trigger"
				type="button"
				popovertarget={popoverId}
				popovertargetaction="toggle"
				{...triggerProps}
			>
				{#if children}
					{@render children()}
				{:else}
					<span>{triggerLabel}</span>
				{/if}
			</button>
		{/if}
	{:else}
		<span
			class="tooltip-trigger"
			bind:this={triggerEl}
			role="button"
			tabindex="0"
			{...triggerProps}
			onmouseenter={onTriggerEnter}
			onmouseleave={onTriggerLeave}
			onfocus={onTriggerEnter}
			onblur={onTriggerLeave}
		>
			{#if children}
				{@render children()}
			{:else}
				<span>{triggerLabel}</span>
			{/if}
		</span>
	{/if}

	{#if Content || content}
		<div
			id={popoverId}
			class="tooltip-content"
			popover={triggerAction === 'click' ? 'auto' : 'hint'}
			bind:this={popoverEl}
			data-side={side}
			style="--side-offset: {sideOffset}px"
		>
			{#if Content}
				{@render Content()}
			{:else}
				{content}
			{/if}
		</div>
	{/if}
</span>


<style>
	.tooltip-wrapper {
		display: inline-flex;
	}

	.tooltip-wrapper[data-trigger-action='hover'] .tooltip-trigger {
		cursor: default;
	}

	.tooltip-trigger {
		anchor-name: --tooltip-anchor;
	}

	.tooltip-content {
		position: fixed;
		position-anchor: --tooltip-anchor;
		position-area: var(--position-area, top);
		position-try-fallbacks:
			flip-block,
			flip-inline,
			flip-block flip-inline;
		position-visibility: anchors-visible;
		z-index: 100;
		padding: 0.375rem 0.5rem;
		background-color: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		box-shadow: 0 4px 16px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.35));
		font-size: 0.875em;
		max-inline-size: min(20rem, 90vw);
		color: var(--color-fg);
	}

	.tooltip-content :global(p:first-child) {
		margin-block-start: 0;
	}

	.tooltip-content :global(p:last-child) {
		margin-block-end: 0;
	}

	.tooltip-content :global(p + p) {
		margin-block-start: 0.5em;
	}

	.tooltip-content[data-side='top'] {
		--position-area: top;
		margin-block-end: var(--side-offset, 6px);
	}

	.tooltip-content[data-side='bottom'] {
		--position-area: bottom;
		margin-block-start: var(--side-offset, 6px);
	}

	.tooltip-content[data-side='left'] {
		--position-area: left;
		margin-inline-end: var(--side-offset, 6px);
	}

	.tooltip-content[data-side='right'] {
		--position-area: right;
		margin-inline-start: var(--side-offset, 6px);
	}
</style>
